import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { AuthUser } from "@workspace/api-client-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (user) {
    setLocation("/dashboards");
    return null;
  }

  const mutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        const { token, ...userData } = data as AuthUser & { token: string };
        login(userData, token);
        setLocation("/dashboards");
      },
      onError: () => {
        toast({
          title: "Connexion échouée",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ data: { email, password } });
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <span className="font-serif font-bold text-3xl tracking-tight">
            DATA<span className="text-primary">STORY</span>
          </span>
          <p className="text-muted-foreground mt-2 text-sm">
            Connectez-vous à votre espace client
          </p>
        </div>

        <div className="border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                autoComplete="email"
                className="rounded-none bg-muted border-border text-white placeholder:text-muted-foreground h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="rounded-none bg-muted border-border text-white placeholder:text-muted-foreground h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-none bg-primary hover:bg-primary/90 text-white font-medium h-11"
            >
              {mutation.isPending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Datastory by BBDO Paris
        </p>
      </div>
    </div>
  );
}
