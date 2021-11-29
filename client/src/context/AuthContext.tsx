import { createContext, useEffect, useState, useContext } from "react";
import axiosInstance from "../config/axiosInstance";
import { AxiosResponse } from "axios";

export const AuthContext = createContext<any>({});
export const AuthProvider = (props: any) => {
  const [isAuth, setIsAuth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getAuth = async () => {
    try {
      const res: AxiosResponse = await axiosInstance.get("/api/isAuth");
      setIsAuth(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ isAuth, isLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuthenticate = () => useContext(AuthContext);

export default useAuthenticate;
