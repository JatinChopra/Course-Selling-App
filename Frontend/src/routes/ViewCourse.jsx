import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Center, Flex, HStack, VStack, useToast } from "@chakra-ui/react";
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
      {!isloading && courseDetails ? (
        <Box height="93vh" width="80%" px="10" py="5">
          {/* Playing {courseDetails.chapters[0].videourl} */}
          <Flex height="100%">
            {/* <Aspectratio ratio={16 / 9} height="360" width="640"> */}
            <Box padding={"20px"} width="65%" height="65%">
              {courseDetails ? (
                <div
                  style={{
                    height: "100%",
                  }}
                >
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
                      ratio: "16:9", // or any other aspect ratio
                    }}
                  />
                </div>
              ) : (
                <>Loading...</>
              )}
            </Box>
            {courseDetails ? (
              <VStack
                mt="5"
                gap="2"
                height="100%"
                width="40%"
                px="5"
                overflowY={"scroll"}
              >
                {courseDetails.chapters.map((item, index) => {
                  return (
                    <Flex
                      key={index}
                      onClick={() => {
                        setVideourl(item.videourl);
                      }}
                      wrap="nowrap"
                      border={"1px solid"}
                      boxShadow={"md"}
                      borderColor={"gray.200"}
                      //   background="yellow"
                      height="70px"
                      width="100%"
                      alignItems={"center"}
                      minH="80px"
                      px="5"
                      // justifyContent={"center"}
                    >
                      <Box fontWeight={"semibold"}>
                        Chapter {index}: {item.title}{" "}
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            ) : (
              <>Loading...</>
            )}
          </Flex>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default ViewCourse;
