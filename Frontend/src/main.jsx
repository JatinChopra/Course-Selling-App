import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";

import { extendTheme } from "@chakra-ui/react";
const theme = extendTheme({
  colors: {
    customOne: {
      50: "#E5E5FF", // Lighter shade
      100: "#CCCCCC", // Lighter shade
      200: "#B2B2FF", // Lighter shade
      300: "#9999FF", // Lighter shade
      400: "#7F7FFF", // Lighter shade
      500: "#1C1CFF", // Base color
      600: "#1313CC", // Darker shade
      700: "#0B0B99", // Darker shade
      800: "#070766", // Darker shade
      900: "#040433", // Darker shade
    },
    customTwo: {
      50: "#677688", // Lighter shade
      100: "#5C6B7F", // Lighter shade
      200: "#505D74", // Lighter shade
      300: "#455068", // Lighter shade
      400: "#39445D", // Lighter shade
      500: "#2E3752", // Lighter shade
      600: "#232B46", // Lighter shade
      700: "#181F3B", // Lighter shade
      800: "#1A202C", // Base color
      900: "#0E131E", // Darker shade
    },

    customMain: {
      50: "#E6E6FF",
      100: "#CFCFFF",
      200: "#B8B8FF",
      300: "#A1A1FF",
      400: "#7A7AFF",
      500: "#6363FF",
      600: "#4C4CFF",
      700: "#3535FF",
      800: "#1E1EFF",
      900: "#0707FF",
    },

    buttons: {
      50: "#E1F5FE",
      100: "#B3E0FC",
      200: "#81C9FB",
      300: "#4FAEF7",
      400: "#2196F3",
      500: "#03A9F4",
      600: "#039BE5",
      700: "#0288D1",
      800: "#0277BD",
      900: "#01579B",
    },
    links: "#FF9800",
    outlineButtons: {
      border: "#FFCC80",
      text: "#FF9800",
    },
    drawer: {
      background: "#4CAF50",
      buttons: "#388E3C",
    },
  },
});

// #1C1CFF
// #5151FF

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </>
);
