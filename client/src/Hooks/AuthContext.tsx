import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";

export const AuthContext = createContext<any>(null);
const AuthProvider = (props: any) => {
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
export default AuthProvider;
