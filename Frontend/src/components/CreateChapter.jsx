import React, { useState, useRef, useEffect } from "react";

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
  Progress,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import axios from "axios";
import useLocalStorageState from "use-local-storage-state";

const BASE_URL = import.meta.env.VITE_API_URL;

const Create = ({ courseid, fetchChapters }) => {
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [token, setToken] = useLocalStorageState("token");
  const [showProgress, setShowProgress] = useState(false);

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
    // console.log()
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    console.log(droppedFile);
    setShowProgress(true);
    handleUpload(droppedFile);
  };

  const handleUpload = async (droppedFile) => {
    setUploading(true);
    const formData = new FormData();
    let file = droppedFile;
    formData.append("file", file);

    let fileSize = Math.ceil(file.size / 1000000);
    console.log(fileSize); // 50mb
    let estimatedtimeRemaining = fileSize * 1.4; //70seconds
    let segmentsize = Math.ceil(100 / estimatedtimeRemaining); // 1.428 (add)
    let timer = 0;

    try {
      const progressHandler = () => {
        setProgress((prog) => {
          return prog + segmentsize;
        });
        timer += 1;
        if (timer >= estimatedtimeRemaining) {
          clearInterval(progressInterval);
        }
      };

      const progressInterval = setInterval(progressHandler, 1000);

      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { Authorization: "Bearer " + token },
      });

      setVideoURL(res.data.url);
      console.log("uploaded : ", res.data.url);

      makeToast("Upload Operation", res.data.message, "success");
      clearInterval(progressInterval);
      console.log(progress);
      if (progress < 95) {
        console.log("i'm here in less 96");
        console.log(res.data.url);
        setProgress((value) => {
          return 97;
        });
        setTimeout(() => {
          setProgress(99);
          setTimeout(() => {
            setUploaded(true);
            setUploading(false);

            setProgress(0);
          }, 800);
        }, 800);
      } else {
        console.log("im here in more 95");
        setUploaded(true);
        setUploading(false);
      }

      // setUploading(false);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
        makeToast("Upload Error", err.response.data.message, "error");
      }
      console.log(err.message);
      setUploading(false);
      setProgress(0);
    }
  };

  const formHandler = (e) => {
    e.preventDefault();
    setChapter({
      ...chapter,
      videourl: videoURL,
    });
    let newChapter = {
      ...chapter,
      videourl: videoURL,
    };
    axios
      .post(`${BASE_URL}/api/courses/${courseid}/newchapter`, newChapter, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setChapter({ title: "", imageurl: "", description: "" });
        setFile("");
        setShowProgress(false);
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
            {showProgress ? (
              <>
                {uploaded ? (
                  <Box py="10">
                    <Text fontWeight={"semibold"}>
                      Uploaded Successfully : {file.name}{" "}
                    </Text>
                  </Box>
                ) : (
                  <Box py="20">
                    <Text fontWeight={"semibold"}>Uploading : {file.name}</Text>
                    <Progress
                      hasStripe
                      value={progress}
                      size="lg"
                      mt="4"
                      colorScheme="buttons"
                      isIndeterminate={uploading && progress === 0}
                    />
                  </Box>
                )}
              </>
            ) : (
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
                    setFile(e.target.files[0]);
                    setShowProgress(true);
                    handleUpload(e.target.files[0]);
                  }}
                />
                <Button
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                  colorScheme="buttons"
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
                  <Text fontWeight="semibold"> Drag and Drop a File</Text>
                </Center>
              </VStack>
            )}
          </Box>

          <Flex>
            <Spacer />
            {/* <Button
              mb="7"
              colorScheme="buttons"
              size="sm"
              mt="3"
              onClick={() => {
                handleUpload();
              }}
              isLoading={uploading}
            >
              Upload
            </Button> */}
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
                setChapter({
                  ...chapter,
                  title: e.target.value,
                });
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
            colorScheme="buttons"
            size="sm"
            float="right"
            mt="5"
            type="submit"
            isDisabled={!uploaded}
          >
            Create
          </Button>
        </form>
      </Box>
    </>
  );
};

export default Create;
