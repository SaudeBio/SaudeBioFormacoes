import { useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  useEffect(() => {
    async function registar() {
      const { data, error } = await supabase.from('users').insert([
        {
          email: 'teste@exemplo.com',
          ip: '123.123.123.123',
          consultas_restantes: 3
        }
      ])
      if (error) {
        console.error('❌ Erro ao inserir:', error.message)
      } else {
        console.log('✅ Inserido com sucesso:', data)
      }
    }

    registar()
  }, [])

  return <h1>Teste de Supabase</h1>
}

export default App
import LoginRegisto from "./LoginRegisto";
import PlataformaSaudeBioFormacoes from "./PlataformaSaudeBioFormacoes";
import { useState } from "react";

export default function App() {
  const [logado, setLogado] = useState(!!localStorage.getItem("utilizador"));

  return logado ? (
    <PlataformaSaudeBioFormacoes />
  ) : (
    <LoginRegisto onLogin={() => setLogado(true)} />
  );
}
<Route
  path="/admin"
  element={
    <ProtectedRoute onlyAdmin>
      <Dashboard />
    </ProtectedRoute>
  }
/>
