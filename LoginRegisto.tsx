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
          password_hash: password,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {modo === "login" ? "Login" : "Criar Conta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {modo === "login" ? "Entrar" : "Registar"}
          </button>
        </form>

        {erro && <p className="text-red-500 mt-4 text-center">{erro}</p>}

        <button
          className="mt-6 text-sm text-blue-500 hover:underline w-full text-center"
          onClick={() => setModo(modo === "login" ? "registo" : "login")}
        >
          {modo === "login"
            ? "Não tens conta? Regista-te aqui"
            : "Já tens conta? Faz login"}
        </button>
      </div>
    </div>
  );
}
