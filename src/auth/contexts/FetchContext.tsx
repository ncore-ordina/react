import axios, { AxiosInstance } from "axios";
import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

const FetchContext = createContext<AxiosInstance>(axios);
const { Provider } = FetchContext;

const FetchProvider = ({ children }: { children: React.ReactNode }) => {
  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  const { authState } = useContext(AuthContext);

  authAxios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authState?.token}`;

      return config;
    },
    (error) => Promise.reject(error)
  );

  return <Provider value={authAxios}>{children}</Provider>;
};

export { FetchContext, FetchProvider };
