import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";

const UserContext = createContext<any>(null);
export const UserProvider = (props: any) => {
  const [User, setUser] = useState<Object>();
  const getUser = async () => {
    try {
      const res: AxiosResponse = await axios.get("/api/getUser");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <UserContext.Provider value={User}>{props.children}</UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export default useUser;
