import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function LoginRegisto({ onLogin }: { onLogin: () => void }) {
  const [modo, setModo] = useState<"login" | "registo">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (modo === "registo") {
      // REGISTO via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErro("Erro no registo: " + error.message);
        return;
      }

      // Criar entrada adicional na tabela personalizada (opcional)
      const validade = new Date();
      validade.setDate(validade.getDate() + 90); // 90 dias

      const { error: dbError } = await supabase.from("users_apps").insert([
        {
          email,
          plano: "gratuito",
          data_registo: new Date(),
          validade_acesso: validade,
        },
      ]);

      if (dbError) {
        setErro("Erro ao criar conta: " + dbError.message);
        return;
      }

      alert("Conta criada com sucesso! Faz login agora.");
      setModo("login");
      return;
    }

    // LOGIN via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setErro("Login falhou: " + (error?.message || "Utilizador não encontrado."));
      return;
    }

    // Verificar validade do plano na tabela "users_apps"
    const { data: userData, error: userError } = await supabase
      .from("users_apps")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      setErro("Erro ao verificar plano do utilizador.");
      return;
    }

    const hoje = new Date();
    const validade = new Date(userData.validade_acesso);

    if (validade < hoje) {
      setErro("Acesso expirado. Renova o plano para continuar.");
      return;
    }

    // Sessão OK
    localStorage.setItem("utilizador", JSON.stringify(userData));
    onLogin();
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">{modo === "login" ? "Login" : "Registo"}</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {modo === "login" ? "Entrar" : "Registar"}
        </button>
      </form>

      <p className="text-red-500">{erro}</p>

      <button
        className="text-sm text-blue-500 underline"
        onClick={() => setModo(modo === "login" ? "registo" : "login")}
      >
        {modo === "login" ? "Criar conta" : "Já tenho conta"}
      </button>
    </div>
  );
}
