import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/dashboard'); // Redireciona após login
    } catch (err: any) {
      setErro('Email ou senha inválidos');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md space-y-4">
        <h2 className="text-xl font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="border p-2 w-full"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <p className="text-red-500">{erro}</p>}
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}