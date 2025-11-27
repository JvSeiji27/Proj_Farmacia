import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosInstance";

function AuthPage({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        // LOGIN
        const res = await api.post("/auth/login", { email, password });
        const { user, token, message } = res.data;

        if (user && token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          setIsAuthenticated(true);
          setMessage(message || "Login realizado com sucesso!");

          if (user.role === "ADMIN") {
            navigate("/cadastro");
          } else {
            navigate("/lista");
          }
        } else {
          setMessage("Erro: resposta do servidor inválida.");
        }
      } else {
        // CADASTRO
        await api.post("/users/create", { name, email, password });
        setMessage("Usuário cadastrado com sucesso! Agora faça login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response?.status === 401) {
        setMessage(err.response.data.message || "Email ou senha incorretos.");
      } else {
        setMessage("Erro ao autenticar usuário. Verifique os dados e tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? "Login" : "Cadastro"}
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.toLowerCase().includes("sucesso")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              {/* MUDANÇA AQUI: de text-gray-300 para text-blue-600 */}
    
            <label style={{ color: '#2563eb' }} className="font-semibold block mb-2">Nome </label>
                <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
             {/* MUDANÇA AQUI: de text-gray-300 para text-blue-600 */}
            <label style={{ color: '#2563eb' }} className="font-semibold block mb-2">Email </label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
             {/* MUDANÇA AQUI: de text-gray-300 para text-blue-600 */}
            <label style={{ color: '#2563eb' }} className="font-semibold block mb-2">Senha </label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        {/* MUDANÇA AQUI: de text-gray-400 para text-blue-600 */}
        <p style={{ color: '#2563eb' }} className="text-center mt-6">
          {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={toggleMode}
            className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1"
          >
            {isLogin ? "Cadastre-se" : "Fazer login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;