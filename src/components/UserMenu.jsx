import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login, logout } from "../lib/auth";

export default function UserMenu() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function formatUser(email) {
    if (!email) return "";
    return email.split("@")[0];
  }

  async function handleSubmit() {
    const { error } = await login(email, password);

    if (error) {
      alert("Error login");
      console.log(error);
      return;
    }

    setOpen(false);
    setEmail("");
    setPassword("");
  }

  async function handleAuth() {
    if (user) {
      await logout();
    } else {
      setOpen(true);
    }
  }

  return (
    <>
      <div className="userMenu" onClick={handleAuth}>
        {user ? formatUser(user.email) : "Iniciar sesión"}
      </div>

      {open && (
        <div className="loginOverlay" onClick={() => setOpen(false)}>
          <div className="loginModal" onClick={(e) => e.stopPropagation()}>
            <h3>Login</h3>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={() => setOpen(false)}>
                Cancelar
              </button>

              <button onClick={handleSubmit}>
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}