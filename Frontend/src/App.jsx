import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/Root";
import Courses from "./routes/Courses";
import ManageCourses from "./routes/ManageCourses";
import MyLearning from "./routes/MyLearning";
import CourseDetail from "./routes/CourseDetail";
import ViewCourse from "./routes/ViewCourse";
// import CreateCourse from "./routes/CreateCourse";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Courses />,
      },
      {
        path: "manage",
        children: [
          {
            path: "",
            element: <ManageCourses />,
          },
          {
            path: ":courseid",
            element: <CourseDetail />,
          },
        ],
      },
      {
        path: "mylearning",
        children: [
          {
            path: "",
            element: <MyLearning />,
          },
          {
            path: ":courseid",
            element: <ViewCourse />,
          },
        ],
      },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
