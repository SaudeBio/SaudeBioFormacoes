import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginRegisto from "./LoginRegisto";
import PlataformaSaudeBioFormacoes from "./PlataformaSaudeBioFormacoes";

export default function App() {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    async function registar() {
      const { data, error } = await supabase.from("users").insert([
        {
          email: "teste@exemplo.com",
          ip: "123.123.123.123",
          consultas_restantes: 3,
        },
      ]);
      if (error) {
        console.error("❌ Erro ao inserir:", error.message);
      } else {
        console.log("✅ Inserido com sucesso:", data);
      }
    }

    registar();
  }, []);

  return logado ? (
    <PlataformaSaudeBioFormacoes />
  ) : (
    <LoginRegisto onLogin={() => setLogado(true)} />
  );
}
