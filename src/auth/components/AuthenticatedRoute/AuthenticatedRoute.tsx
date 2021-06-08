import { AuthContext } from "auth/contexts/AuthContext";
import { ReactNode, useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router";

type Props = {
  children: ReactNode;
  redirectRoute: string;
} & RouteProps;

export const AuthenticatedRoute = ({
  children,
  redirectRoute,
  ...rest
}: Props) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated() ? children : <Redirect to={redirectRoute} />
      }
    />
  );
};
