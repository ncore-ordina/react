import { settings } from "auth/oidc-settings";
import { Profile, User, UserManager } from "oidc-client";
import { createContext, useEffect, useState } from "react";

interface AuthState {
  token: string;
  expiresAt: number;
  userInfo: Profile;
}

interface IAuthContext {
  authState: AuthState | null;
  isAuthenticated: () => boolean;
  login: () => void;
  logout: () => void;
  isInitialized: boolean;
}

export const AuthContext = createContext<IAuthContext>({
  authState: null,
  isAuthenticated: () => false,
  login: () => {},
  logout: () => {},
  isInitialized: false,
});

const { Provider } = AuthContext;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userManager] = useState(() => new UserManager(settings));
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const login = () => userManager.signinRedirect();

  const logout = () => {
    userManager.signoutRedirect();
    setAuthState(null);
  };

  const loadUser = async () => {
    const user = await userManager.getUser();
    if (user && user.expired) {
      renewToken();
    } else if (user) {
      setAuthInfo(user);
    }
  };

  const isAuthenticated = () => {
    if (!authState?.userInfo || !authState.expiresAt) {
      return false;
    }

    return new Date().getTime() / 1000 < authState.expiresAt;
  };

  const setAuthInfo = ({ id_token, profile, expires_at }: User) => {
    setAuthState({
      token: id_token,
      userInfo: profile,
      expiresAt: expires_at,
    });
  };

  const renewToken = (): Promise<User | void> =>
    userManager
      .signinSilent()
      .then((user) => setAuthInfo(user))
      .catch(() => userManager.removeUser());

  useEffect(() => {
    loadUser().then(() => setIsInitialized(true));
  }, []);

  useEffect(() => {
    userManager.events.addAccessTokenExpiring(() => {
      renewToken();
    });

    userManager.events.addAccessTokenExpired(() => {
      renewToken();
    });
  }, []);

  return (
    <Provider
      value={{
        authState,
        isAuthenticated,
        login,
        logout,
        isInitialized,
      }}
    >
      {children}
    </Provider>
  );
};
