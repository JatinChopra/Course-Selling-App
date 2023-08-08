import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";

import { Box, Center } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Link } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";

import useLocalStorageState from "use-local-storage-state";

import axios from "axios";

import UserContext from "../components/contexts/UserContext";

import SessionExpiredModal from "../components/SessionExpiredModal";

import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const Root = () => {
  const [token, setToken] = useLocalStorageState("token");
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();

  const {
    isOpen: sessExpIsOpen,
    onOpen: sessExpOnOpen,
    onClose: sessExpOnClose,
  } = useDisclosure();

  useEffect(() => {
    if (token) {
      axios
        .get(`${BASE_URL}/api/auth/session`, {
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
            setUserData({});
            navigate("/");
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
        <Box h="95vh" mt="5vh" pt="5" overflowY={"scroll"}>
          <Center>
            <Outlet />
          </Center>
        </Box>
      </UserContext.Provider>

      <SessionExpiredModal
        isOpen={sessExpIsOpen}
        onOpen={sessExpOnOpen}
        onClose={sessExpOnClose}
      />
    </>
  );
};

export default Root;
