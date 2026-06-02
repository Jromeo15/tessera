import { useAuth } from "../context/AuthContext";
import { login, logout } from "../lib/auth";

export default function UserMenu() {
  const { user } = useAuth();

  function formatUser(email) {
    if (!email) return "";
    return email.split("@")[0];
  }

  async function handleAuth() {
    if (user) {
      await logout();
    } else {
      const email = prompt("Email:");
      const password = prompt("Password:");

      if (!email || !password) return;

      const { error } = await login(email, password);

      if (error) {
        alert("Error login");
        console.log(error);
      }
    }
  }

  return (
    <div className="userMenu" onClick={handleAuth}>
      {user ? formatUser(user.email) : "Iniciar sesión"}
    </div>
  );
}