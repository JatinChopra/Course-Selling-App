import React, { useState, useEffect } from "react";

import { Box, Flex } from "@chakra-ui/react";
import CourseCard from "../components/CourseCard";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const toast = useToast();

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
      .get("http://localhost:5000/api/courses")
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
            courses.map((item, index) => {
              return (
                <CourseCard
                  key={item._id.toString()}
                  course={item}
                  buttonText={"Enroll"}
                  link={"http://localhost:5000/api/enroll"}
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

export default Courses;
