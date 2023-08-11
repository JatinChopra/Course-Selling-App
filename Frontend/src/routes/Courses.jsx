import React, { useState, useEffect } from "react";

import { Box, Flex, Center, Heading, VStack } from "@chakra-ui/react";
import CourseCard from "../components/CourseCard";
import axios from "axios";
import { Image } from "@chakra-ui/react";
import { useToast, AspectRatio, Text, Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import AuthForm from "../components/AuthForm";
// require("dotenv").config();
const BASE_URL = import.meta.env.VITE_API_URL;
import { Spinner } from "@chakra-ui/react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const toast = useToast();

  const {
    isOpen: signupIsOpen,
    onOpen: signupOnOpen,
    onClose: signupOnClose,
  } = useDisclosure();

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
    // console.log(import.meta.env.VITE_API_URL);

    axios
      .get(`${BASE_URL}/api/courses`)
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
      <Flex
        mt={{ base: "30" }}
        height={{ base: "auto", md: "70vh" }}
        // mb="5"
        position="relative"
        justifyContent="center"
        alignItems="center"
        background="#F8F8F8"
        flexDirection={{ base: "column-reverse", md: "row" }}
        textAlign={{ base: "center", md: "left" }}
      >
        <Box
          height="auto"
          width={{ base: "100%", md: "50%" }}
          mr={{ base: 0, md: 10 }}
          alignItems={{ base: "center", md: "flex-start" }}
          alignContent={{ base: "center", md: "flex-start" }}
          p={{ base: "5", md: "10" }}
        >
          <Heading
            color="customTwo.700"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          >
            Empowering Minds,
            <br /> Transforming Futures
          </Heading>
          <Text
            fontSize={{ base: "md", md: "xl", lg: "2xl" }}
            width={{ base: "100%", md: "70%" }}
          >
            Unlock a world of knowledge with our expert-led courses designed to
            elevate your skills and open doors to limitless opportunities
          </Text>
          <Button size="lg" mt="7" colorScheme="buttons" onClick={signupOnOpen}>
            Signup
          </Button>
        </Box>

        <Image
          boxShadow="2xl"
          borderRadius="35px"
          src="/images/hero_section_img.jpeg"
          width={{ base: "150px", md: "300px", lg: "480px" }}
          height={{ base: "150px", md: "300px", lg: "480px" }}
          mt={{ base: "5", md: 0 }}
          mb={{}}
        />
      </Flex>

      <Box px="4" py="10" background="#EAEAEA">
        <Center mb="10" mt="10" background="">
          <VStack mb="10">
            <Heading px="10" color="customTwo.800">
              Explore Courses
            </Heading>
            <Text align={"center"}>
              Expand Your Horizons: Find Your Perfect Course
            </Text>
          </VStack>
        </Center>
        <Center>
          <Flex
            px="10"
            ml="18"
            justifyContent="center"
            flexWrap={"wrap"}
            gap={"12"}
            // background="red"
            width={{
              sm: "100%",
              md: "100%",
              lg: "80%",
            }}
          >
            {!isloading && courses ? (
              courses.map((item, index) => {
                return (
                  <CourseCard
                    key={item._id.toString()}
                    course={item}
                    buttonText={"Enroll"}
                    link={`${BASE_URL}/api/enroll`}
                  />
                );
              })
            ) : (
              <>
                <Spinner />
              </>
            )}
          </Flex>
        </Center>
      </Box>

      <Box height="150px" background="#292F36"></Box>
      <AuthForm
        isOpen={signupIsOpen}
        onOpen={signupOnOpen}
        onClose={signupOnClose}
        isLogin={false}
      />
    </>
  );
};

export default Courses;
