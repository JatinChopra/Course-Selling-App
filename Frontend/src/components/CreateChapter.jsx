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

const Create = ({ courseid, fetchChapters }) => {
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useLocalStorageState("token");
  const fileInputRef = useRef(null);
  const toast = useToast();
  const [chapter, setChapter] = useState({
    title: "",
    description: "",
    videourl: "",
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
      setChapter({ ...chapter, videourl: res.data.url });
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
    axios
      .post(`${BASE_URL}/api/courses/${courseid}/newchapter`, chapter, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setChapter({ title: "", imageurl: "", description: "" });
        setFile("");
        makeToast("Chapter Created", res.data.message, "success");
        fetchChapters();
      })
      .catch((err) => {
        if (err.response) {
          makeToast("Create Chapter", err.response.data.message, "error");
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
                ) : !uploading ? (
                  <Text fontWeight="semibold"> Drag and Drop a File</Text>
                ) : (
                  <>s</>
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
              placeholder="Chapter Title"
              value={chapter.title}
              onChange={(e) => {
                setChapter({ ...chapter, title: e.target.value });
              }}
            />
            <Textarea
              colorScheme="teal"
              placeholder="Chapter Description"
              mt="5"
              value={chapter.description}
              onChange={(e) => {
                setChapter({ ...chapter, description: e.target.value });
              }}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            size="sm"
            float="right"
            mt="5"
            type="submit"
          >
            Create
          </Button>
        </form>
      </Box>
    </>
  );
};

export default Create;
