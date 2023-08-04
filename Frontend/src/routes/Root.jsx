import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";

import { Box, Center } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Link } from "react-router-dom";

import useLocalStorageState from "use-local-storage-state";

import axios from "axios";

import UserContext from "../components/contexts/UserContext";
const Root = () => {
  const [token, setToken] = useLocalStorageState("token");
  const [userData, setUserData] = useState("");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/session", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          if (err.response) {
            // show modal
            sessExpOnOpen();
            setToken("");
            localStorage.removeItem("token");
          }
          console.log(err.message);
        });
    } else {
      console.log("Session token absent.");
    }
  }, [token]);

  return (
    <>
      <UserContext.Provider value={{ userData, setUserData }}>
        <NavigationBar />
        <Box h="95vh" mt="5vh" pt="5">
          <Center height="100%">
            <Outlet />
          </Center>
        </Box>
      </UserContext.Provider>
    </>
  );
};

export default Root;
