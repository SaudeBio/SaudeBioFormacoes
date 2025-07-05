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
      const validade = new Date();
      validade.setDate(validade.getDate() + 90);

      const { error } = await supabase.from("users_apps").insert([
        {
          email,
          password_hash: password, // AVISO: sem encriptação (temporário)
          plano: "gratuito",
          data_registo: new Date(),
          validade_acesso: validade,
        },
      ]);

      if (error) {
        setErro("Erro no registo: " + error.message);
        return;
      }
    }

    // LOGIN
    const { data, error } = await supabase
      .from("users_apps")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      setErro("Utilizador não encontrado.");
      return;
    }

    if (data.password_hash !== password) {
      setErro("Password incorreta.");
      return;
    }

    const hoje = new Date();
    const validade = new Date(data.validade_acesso);

    if (validade < hoje) {
      setErro("Acesso expirado. Renova o plano para continuar.");
      return;
    }

    localStorage.setItem("utilizador", JSON.stringify(data));
    onLogin();
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10 border">
      <h2 className="text-2xl font-bold text-center">
        {modo === "login" ? "Login" : "Criar Conta"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

      {erro && <p className="text-red-600 text-center">{erro}</p>}

      <button
        className="text-sm text-blue-600 underline block mx-auto"
        onClick={() => setModo(modo === "login" ? "registo" : "login")}
      >
        {modo === "login"
          ? "Não tens conta? Regista-te aqui"
          : "Já tens conta? Entra aqui"}
      </button>
    </div>
  );
}
