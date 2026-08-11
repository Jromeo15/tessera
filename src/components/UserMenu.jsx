import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login, logout } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";
import {
  getMusicVolume,
  getSfxVolume,
  setMusicVolume,
  setSfxVolume,
} from "../lib/soundSettings";

import Extras from "../pages/Extras";

export default function UserMenu() {
  const { user } = useAuth();

  const [openAuth, setOpenAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [openSettings, setOpenSettings] = useState(false);
  const [openExtras, setOpenExtras] = useState(false);

  const [musicVolume, setMusicVolumeState] = useState(
    getMusicVolume()
  );

  const [sfxVolume, setSfxVolumeState] = useState(
    getSfxVolume()
  );

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
        if (password.length < 6) {
          alert("La contraseña debe tener al menos 6 caracteres");
          return;
        }
      
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

  function handleMusicVolumeChange(e) {
    const value = Number(e.target.value);
  
    setMusicVolumeState(value);
    setMusicVolume(value);
  }
  
  function handleSfxVolumeChange(e) {
    const value = Number(e.target.value);
  
    setSfxVolumeState(value);
    setSfxVolume(value);
  }
  
  function closeSettings() {
    setOpenSettings(false);
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
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            {mode === "register" && (
            <p className="loginHint">
                La contraseña debe tener al menos 6 caracteres.
            </p>
            )}

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

           {/*
            <button className="sidebarBtn">
              Mis niveles
            </button>
            */}

            <button
              className="sidebarBtn"
              onClick={() => {
                setOpenMenu(false);
                setOpenExtras(true);
              }}
            >
              Extras
            </button>

            <button
              className="sidebarBtn"
              onClick={() => {
                setOpenMenu(false);
                setOpenSettings(true);
              }}
            >
              Configuración
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

{openSettings && (
  <div
    className="settingsOverlay"
    onClick={closeSettings}
  >
    <div
      className="settingsModal"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Configuración</h3>

      <div className="volumeSetting">
        <div className="volumeSettingHeader">
          <span>Música</span>

          <span>
            {Math.round((musicVolume / 0.5) * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={musicVolume}
          onChange={handleMusicVolumeChange}
        />
      </div>

      <div className="volumeSetting">
        <div className="volumeSettingHeader">
          <span>Efectos</span>

          <span>
            {Math.round((sfxVolume / 0.5) * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={sfxVolume}
          onChange={handleSfxVolumeChange}
        />
      </div>

      <button
        className="sidebarBtn"
        onClick={closeSettings}
      >
        Cerrar
      </button>
    </div>
  </div>
)}

{openExtras && (
  <div
    className="settingsOverlay"
    onClick={() => setOpenExtras(false)}
  >
    <div
      className="settingsModal extrasModal"
      onClick={(e) => e.stopPropagation()}
    >
      <Extras
        embedded={true}
        onBack={() => setOpenExtras(false)}
      />
    </div>
  </div>
)}
    </>
  );
}