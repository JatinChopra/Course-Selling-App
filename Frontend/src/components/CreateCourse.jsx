import React, { useState, useRef } from "react";

import {
  Box,
  AbsoluteCenter,
  Heading,
  Text,
  Button,
  ButtonGroup,
  FormControl,
  Input,
  Textarea,
  Spacer,
  Flex,
  Center,
  VStack,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import axios from "axios";
import useLocalStorageState from "use-local-storage-state";

const BASE_URL = import.meta.env.VITE_API_URL;

const Create = ({ fetchCourses }) => {
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useLocalStorageState("token");
  const fileInputRef = useRef(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const toast = useToast();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    imageurl: "",
  });

  const makeToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      isClosable: true,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { Authorization: "Bearer " + token },
      });
      setCourse({ ...course, imageurl: res.data.url });
      makeToast("Upload Operation", res.data.message, "success");
      setUploading(false);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
        makeToast("Upload Error", err.response.data.message, "error");
      }
      console.log(err.message);
      setUploading(false);
    }
  };

  const formHandler = (e) => {
    e.preventDefault();
    setCreatingCourse(true);
    axios
      .post(`${BASE_URL}/api/courses`, course, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setCourse({ title: "", imageurl: "", description: "" });
        setFile("");
        makeToast("Course Created", res.data.message, "success");
        setCreatingCourse(false);
        fetchCourses();
      })
      .catch((err) => {
        if (err.response) {
          makeToast("Create Course", err.response.data.message, "error");
        }
        console.log(err.message);
      });
  };

  return (
    <>
      <Box
        background={""}
        width={"100%"}
        height="100%"
        // backgroundColor={"yellow"}
        px="5"
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDrop}
      >
        <Box>
          <Box
            // height={"180px"}
            borderRadius={"18"}
            width="100%"
            position={"relative"}
          >
            <VStack my="auto">
              <Input
                type="file"
                display="none"
                onClick={(e) => {
                  console.log(e.target.value);
                }}
                ref={fileInputRef}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <Button
                onClick={() => {
                  fileInputRef.current.click();
                }}
                colorScheme="teal"
                mt="5"
              >
                Select File
              </Button>

              <div>OR</div>

              <Center
                // color="white"
                textAlign={"center"}
                width="100%"
                height="100%"
                mb="5"
              >
                {file ? (
                  <Text>
                    {file.name} <br /> Uploading a large file might take 2-3
                    minutes.
                  </Text>
                ) : (
                  <Text fontWeight="semibold"> Drag and Drop a File</Text>
                )}
              </Center>
            </VStack>
          </Box>
          <Flex>
            <Spacer />
            <Button
              mb="7"
              colorScheme="teal"
              size="sm"
              mt="3"
              onClick={() => {
                handleUpload();
              }}
              isLoading={uploading}
            >
              Upload
            </Button>
          </Flex>
        </Box>
        <form onSubmit={formHandler}>
          <FormControl>
            <Input
              colorScheme="teal"
              type="text"
              placeholder="Course Title"
              value={course.title}
              onChange={(e) => {
                setCourse({ ...course, title: e.target.value });
              }}
            />
            <Textarea
              colorScheme="teal"
              placeholder="Course Description"
              mt="5"
              value={course.description}
              onChange={(e) => {
                setCourse({ ...course, description: e.target.value });
              }}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            size="sm"
            float="right"
            mt="5"
            type="submit"
            isLoading={creatingCourse}
          >
            Create
          </Button>
        </form>
      </Box>
    </>
  );
};

export default Create;
