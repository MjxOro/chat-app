import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";

export const myContext = createContext({});
const Context = (props: any) => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getUser", {
        withCredentials: true,
      })
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data) {
          setUser(res.data);
        }
      });
  }, []);
  return <myContext.Provider value={user}>{props.children}</myContext.Provider>;
};
export default Context;
