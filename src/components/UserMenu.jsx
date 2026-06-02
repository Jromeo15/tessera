import { useAuth } from "../context/AuthContext";
import { login, logout } from "../lib/auth";

export default function UserMenu() {
  const { user } = useAuth();

  async function handleAuth() {
    if (user) {
      await logout();
    } else {
      const email = prompt("Email:");
      const password = prompt("Password:");

      const { error } = await login(email, password);

      if (error) {
        alert("Error login");
        console.log(error);
      }
    }
  }

  return (
    <div className="userMenu" onClick={handleAuth}>
      {user ? user.email : "Iniciar sesión"}
    </div>
  );
}