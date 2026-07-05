import { useState } from "react";
import { AuthContext } from "./AuthContext";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<string | null>(null);

  function login(id: string) {
    setUser(id);
  }
  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
