import { createWriteStream, createReadStream, existsSync, mkdirSync } from "fs";
import { stat } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

const UPLOADS_DIR = process.env.LOCAL_UPLOADS_DIR
  ? path.resolve(process.env.LOCAL_UPLOADS_DIR)
  : path.resolve(process.cwd(), "uploads");

function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export class LocalStorageService {
  getObjectEntityUploadURL(baseUrl: string): string {
    ensureUploadsDir();
    const uuid = randomUUID();
    return `${baseUrl}/api/storage/local-upload/${uuid}`;
  }

  normalizeObjectEntityPath(uploadURL: string): string {
    const url = new URL(uploadURL);
    const parts = url.pathname.split("/");
    const uuid = parts[parts.length - 1];
    return `/objects/${uuid}`;
  }

  filePath(uuid: string): string {
    return path.join(UPLOADS_DIR, uuid);
  }

  async saveStream(uuid: string, stream: NodeJS.ReadableStream, contentType: string): Promise<void> {
    ensureUploadsDir();
    const dest = this.filePath(uuid);
    await new Promise<void>((resolve, reject) => {
      const ws = createWriteStream(dest);
      stream.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
      stream.on("error", reject);
    });
  }

  async serveFile(uuid: string): Promise<{ stream: NodeJS.ReadableStream; size: number; contentType: string } | null> {
    const fp = this.filePath(uuid);
    if (!existsSync(fp)) return null;
    const s = await stat(fp);
    const ext = path.extname(uuid).toLowerCase().slice(1);
    const mimeMap: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };
    const contentType = mimeMap[ext] || "application/octet-stream";
    return { stream: createReadStream(fp), size: s.size, contentType };
  }
}

export const localStorage = new LocalStorageService();
