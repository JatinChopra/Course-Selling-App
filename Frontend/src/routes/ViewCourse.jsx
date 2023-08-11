import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import {
  Center,
  Flex,
  HStack,
  Spinner,
  VStack,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import useLocalStorageState from "use-local-storage-state";

const BASE_URL = import.meta.env.VITE_API_URL;

const ViewCourse = () => {
  const { courseid } = useParams();
  const [courseDetails, setCourseDetail] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const toast = useToast();
  const [token, setToken] = useLocalStorageState("token");
  const [videourl, setVideourl] = useState("");
  const makeToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3500,
      isClosable: true,
    });
  };

  const fetchCourseDetails = () => {
    setIsloading(true);

    axios
      .get(`${BASE_URL}/api/users/learning/${courseid}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        setCourseDetail(res.data.courseDetails);
        setVideourl(res.data.courseDetails.chapters[0].videourl);
        setIsloading(false);
      })
      .catch((err) => {
        if (err.response) {
          makeToast("Error", err.response.data.message, "error");
        }
        console.log(err.response);
      });
  };

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  return (
    <>
      {!isloading ? (
        <Center mt="10">
          {!isloading && courseDetails ? (
            <Box height="auto" width="100%" px={{ base: "4", md: "10" }} py="5">
              <Flex
                flexDirection={{
                  base: "column",
                  md: "column",
                  lg: "row",
                }}
                // background="green"
                justifyContent="center"
                alignItems="center"
              >
                <Box padding="20px" width="100%" height="auto">
                  <div style={{ width: "100%" }}>
                    <Plyr
                      source={{
                        type: "video",
                        sources: [
                          {
                            src: videourl,
                          },
                        ],
                      }}
                      options={{
                        ratio: "16:9",
                      }}
                    />
                  </div>
                </Box>

                <Flex
                  flexDirection={"column"}
                  // background="green"
                  mt={{ base: "5", md: "0", lg: "10" }}
                  gap="2"
                  height="100vh"
                  width="100%"
                  px="5"
                  overflowY="scroll"
                  maxH="50vh"
                >
                  {courseDetails.chapters.map((item, index) => (
                    <Flex
                      minH="70px"
                      borderRadius="10px"
                      background="white"
                      key={index}
                      onClick={() => {
                        setVideourl(item.videourl);
                      }}
                      border="1px solid"
                      boxShadow="md"
                      borderColor="gray.200"
                      height="auto"
                      width="100%"
                      alignItems="center"
                      px="5"
                      py="3"
                    >
                      <Box
                        fontWeight="semibold"
                        background="white"
                        width="100%"
                      >
                        Chapters {index}: {item.title}
                      </Box>
                    </Flex>
                  ))}
                  <Spacer />
                </Flex>
              </Flex>
            </Box>
          ) : (
            <Box background="yellow" height="100%" width="100%"></Box>
          )}
        </Center>
      ) : (
        <Center height={"100vh"}>
          <Spinner />
        </Center>
      )}
    </>
  );
};

export default ViewCourse;
