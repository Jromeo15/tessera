import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login, logout } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";

export default function UserMenu() {
  const { user } = useAuth();

  const [openAuth, setOpenAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mode, setMode] = useState("login");

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert("Error registro");
        console.log(error);
        return;
      }
    }

    setOpenAuth(false);
    setEmail("");
    setPassword("");
  }

  async function handleLogout() {
    await logout();
    setOpenMenu(false);
  }

  function handleClick() {
    if (user) {
      setOpenMenu(true);
    } else {
      setOpenAuth(true);
    }
  }

  return (
    <>
      {/* BOTÓN USUARIO */}
      <div className="userMenu" onClick={handleClick}>
        {user ? formatUser(user.email) : "Iniciar sesión"}
      </div>

      {/* ================= LOGIN / REGISTER MODAL ================= */}
      {openAuth && (
        <div className="loginOverlay" onClick={() => setOpenAuth(false)}>
          <div
            className="loginModal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{mode === "login" ? "Login" : "Crear cuenta"}</h3>

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
            >
              {mode === "login"
                ? "Crear cuenta"
                : "Ya tengo cuenta"}
            </button>

            <button onClick={() => setOpenAuth(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ================= SIDEBAR USUARIO ================= */}
      {openMenu && (
        <>
          <div
            className="sidebarOverlay"
            onClick={() => setOpenMenu(false)}
          />

          <div className="userSidebar">
            <div className="userSidebarHeader">
              <div className="userSidebarEmail">
                {formatUser(user.email)}
              </div>
            </div>

            <button className="sidebarBtn">
              Mis niveles
            </button>

            <button
              className="sidebarBtn sidebarBtn--danger"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </>
  );
}