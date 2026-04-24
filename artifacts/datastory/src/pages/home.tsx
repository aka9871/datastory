import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between border-b border-border">
        <div className="font-serif font-bold text-2xl tracking-tight">
          DATA<span className="text-primary">STORY</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="font-medium">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="font-medium">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6">
          Intelligence meets intuition.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Datastory is the premium client portal by BBDO Paris. Discover, explore, and analyze your curated data dashboards with unprecedented clarity.
        </p>
        <Link href="/sign-in">
          <Button size="lg" className="h-14 px-8 text-lg">
            Access Portal
          </Button>
        </Link>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        &copy; {new Date().getFullYear()} BBDO Paris. All rights reserved.
      </footer>
    </div>
  );
}