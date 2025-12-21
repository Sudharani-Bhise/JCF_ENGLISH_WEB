import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useRequireLogin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (nextPath) => {
    if (!user) {
      navigate("/login", {
        state: { from: nextPath },
      });
    } else {
      navigate(nextPath);
    }
  };
}