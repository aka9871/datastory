import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { localStorage as localStore } from "../lib/localObjectStorage";
import { requireAuth } from "../middlewares/authMiddleware";

const UPLOADS_DIR = process.env.LOCAL_UPLOADS_DIR
  ? path.resolve(process.env.LOCAL_UPLOADS_DIR)
  : path.resolve(process.cwd(), "uploads");

if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, _file, cb) => {
    const ext = path.extname(_file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router: IRouter = Router();

const isReplit = !!process.env.REPL_ID;

function getBaseUrl(req: Request): string {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.headers["x-forwarded-host"] || req.get("host") || "localhost";
  const base = (process.env.BASE_PATH || "").replace(/\/$/, "");
  return `${proto}://${host}${base}`;
}

router.post("/storage/uploads/request-url", requireAuth, async (req: Request, res: Response) => {
  const { name, size, contentType } = req.body ?? {};
  if (!name || typeof size !== "number" || !contentType) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    if (!isReplit) {
      const { file: fileData } = req.body ?? {};
      if (fileData) {
        const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "bin";
        const filename = `${randomUUID()}.${ext}`;
        const buffer = Buffer.from(fileData, "base64");
        const { writeFileSync } = await import("fs");
        const { resolve } = await import("path");
        const uploadsDir = process.env.LOCAL_UPLOADS_DIR
          ? resolve(process.env.LOCAL_UPLOADS_DIR)
          : resolve(process.cwd(), "uploads");
        if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
        writeFileSync(resolve(uploadsDir, filename), buffer);
        const objectPath = `/objects/${filename}`;
        res.json({ objectPath, done: true });
        return;
      }
      res.json({ inlineUpload: true, metadata: { name, size, contentType } });
      return;
    }

    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath, metadata: { name, size, contentType } });
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.post("/storage/direct-upload", requireAuth, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }
  const objectPath = `/objects/${req.file.filename}`;
  res.json({ objectPath });
});

router.get("/storage/local-objects/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;
  try {
    const file = await localStore.serveFile(uuid);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Length", file.size);
    res.setHeader("Cache-Control", "public, max-age=31536000");
    file.stream.pipe(res);
  } catch (error) {
    req.log.error({ err: error }, "Error serving local file");
    res.status(500).json({ error: "Failed to serve file" });
  }
});

router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  if (!isReplit) {
    res.status(404).json({ error: "Not available in this environment" });
    return;
  }
  try {
    const objectStorageService = new ObjectStorageService();
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    const response = await objectStorageService.downloadObject(file);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  if (!isReplit) {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const uuid = wildcardPath.split("/").pop() || wildcardPath;
    try {
      const file = await localStore.serveFile(uuid);
      if (!file) {
        res.status(404).json({ error: "File not found" });
        return;
      }
      res.setHeader("Content-Type", file.contentType);
      res.setHeader("Content-Length", file.size);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      file.stream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: "Failed to serve file" });
    }
    return;
  }

  try {
    const objectStorageService = new ObjectStorageService();
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
