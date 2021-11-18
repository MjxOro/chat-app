import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";

const AuthContext = createContext<any>(null);
export const AuthProvider = (props: any) => {
  const [authState, setAuthState] = useState<boolean>();
  const getAuth = async () => {
    try {
      const res: AxiosResponse = await axios.get("/api/isAuth");
      setAuthState(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAuth();
  }, []);
  console.log(authState);
  return (
    <AuthContext.Provider value={authState}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuthenticate = () => useContext(AuthContext);

export default useAuthenticate;
