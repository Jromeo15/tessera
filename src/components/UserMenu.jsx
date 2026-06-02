import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { user } = useAuth();

  return (
    <div className="userMenu">
      {user ? user.email : "Iniciar sesión"}
    </div>
  );
}