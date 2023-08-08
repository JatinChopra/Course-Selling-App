import React, { useState, useEffect } from "react";

import { Box, Flex } from "@chakra-ui/react";
import CourseCard from "../components/CourseCard";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useLocalStorageState from "use-local-storage-state";

const BASE_URL = import.meta.env.VITE_API_URL;

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const toast = useToast();
  const [token, setToken] = useLocalStorageState("token");
  const makeToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3500,
      isClosable: true,
    });
  };
  const fetchCourses = () => {
    setIsloading(true);

    axios
      .get(`${BASE_URL}/api/users/learning/courses`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setCourses(res.data.courses);
        setIsloading(false);
      })
      .catch((err) => {
        if (err.response) {
          makeToast("Fetch Error", err.response.data.message, "error");
        }
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Box px="4" py="10" width={"84%"}>
        <Flex
          justifyContent="start"
          // alignItems={"center"}
          // background={"pink"}
          width="100%"
          mt="8"
          flexWrap={"wrap"}
          gap={"5"}
        >
          {!isloading && courses ? (
            courses.map((item) => {
              return (
                <CourseCard
                  key={item._id.toString()}
                  course={item}
                  buttonText={"View"}
                  link={item._id.toString()}
                />
              );
            })
          ) : (
            <>Loading...</>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default MyLearning;
