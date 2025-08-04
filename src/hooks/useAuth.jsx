import { useContext, useEffect } from "react";
import { AuthContexth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function useAuth() {
  const { user, loading, setUser } = useContext(AuthContexth);

  useEffect(() => {
    if (loading) return;
    if (user) return;

    if (!user) {
      <Navigate to={"/login"} />;
    }
  }, [user, loading, setUser]);
}

export default useAuth;
