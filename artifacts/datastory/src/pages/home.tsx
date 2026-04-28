import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import bbdoLogo from "/bbdo-logo.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-8 py-5 flex items-center justify-between border-b border-border">
        <span className="font-serif font-bold text-xl tracking-tight">
          DATA<span className="text-primary">STORY</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="font-medium rounded-none">Se connecter</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-6">
          BBDO Paris · Portail Client
        </p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6">
          Vos données,<br />votre vision.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Datastory est votre espace client sécurisé pour visualiser et analyser
          vos tableaux de bord 360°. Suivez la performance de vos campagnes
          en temps réel, depuis une plateforme dédiée à votre marque.
        </p>
        <Link href="/login">
          <Button size="lg" className="h-14 px-8 text-lg rounded-none">
            Accéder à mon espace
          </Button>
        </Link>
      </main>

      <footer className="py-6 flex flex-col items-center gap-3 border-t border-border">
        <img src={bbdoLogo} alt="BBDO Paris" className="h-4 w-auto opacity-40" />
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BBDO Paris. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
