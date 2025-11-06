    import React, { useState } from "react";
    import axios from "axios";

    function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.post("http://localhost:3000/users/create", {
            email,
            password,
            role
        });
        setMessage("Usuário cadastrado com sucesso!");
        } catch (err) {
        setMessage("Erro ao cadastrar usuário");
        }
    };

    return (
        <div style={{ marginTop: 100, textAlign: "center" }}>
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
            <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <br />
            <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <br />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">Usuário</option>
            <option value="ADMIN">Admin</option>
            </select>
            <br />
            <button type="submit">Cadastrar</button>
        </form>
        <p>{message}</p>
        </div>
    );
    }

    export default Register;
