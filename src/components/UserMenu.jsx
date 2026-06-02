import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login, logout } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";

export default function UserMenu() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // login | register

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function formatUser(email) {
    if (!email) return "";
    return email.split("@")[0];
  }

  async function handleSubmit() {
    if (mode === "login") {
      const { error } = await login(email, password);

      if (error) {
        alert("Error login");
        console.log(error);
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert("Error registro");
        console.log(error);
        return;
      }

      alert("Cuenta creada. Revisa tu email si hay confirmación activada.");
      console.log(data);
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

            <h3>
              {mode === "login" ? "Login" : "Crear cuenta"}
            </h3>

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

            <button onClick={handleSubmit}>
              {mode === "login" ? "Entrar" : "Registrarse"}
            </button>

            <button
              onClick={() =>
                setMode(mode === "login" ? "register" : "login")
              }
              style={{
                marginTop: 10,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#666",
              }}
            >
              {mode === "login"
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Login"}
            </button>

            <button onClick={() => setOpen(false)}>
              Cancelar
            </button>

          </div>
        </div>
      )}
    </>
  );
}