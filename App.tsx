import { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import LoginRegisto from "./LoginRegisto";
import PlataformaSaudeBioFormacoes from "./PlataformaSaudeBioFormacoes";

export default function App() {
  const [logado, setLogado] = useState(!!localStorage.getItem("utilizador"));

  return logado ? (
    <PlataformaSaudeBioFormacoes />
  ) : (
    <LoginRegisto onLogin={() => setLogado(true)} />
  );
}
