import React from "react";
import Chat from "./Chat";
import useAuthenticate from "../../context/AuthContext";
import Rooms from "./Rooms";

const Dashboard: React.FC = () => {
  const { isAuth: currentUser } = useAuthenticate();
  console.log(currentUser);

  return (
    <>
      {currentUser && (
        <div>
          <Rooms currentUser={currentUser} />
          <Chat currentUser={currentUser} />
        </div>
      )}
    </>
  );
};
export default Dashboard;
