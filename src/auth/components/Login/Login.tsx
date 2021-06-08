import { AuthContext } from "auth/contexts/AuthContext";
import { useContext, useEffect } from "react";

export const Login = () => {
  const { login } = useContext(AuthContext);
  useEffect(() => login(), []);

  return <></>;
};
