// src/ProtectedRoute.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onlyAdmin?: boolean;
}

export default function ProtectedRoute({ children, onlyAdmin = false }: ProtectedRouteProps) {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const email = session.user.email;
    const admins = ["admin@seudominio.com"];

    if (onlyAdmin && !admins.includes(email || "")) {
      navigate("/login");
    }
  }, [session, navigate, onlyAdmin]);

  return <>{children}</>;
}
