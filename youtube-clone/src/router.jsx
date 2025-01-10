import { createBrowserRouter } from "react-router-dom";
import HomePage from "./components/HomePage";
import VideoPage from "./components/VideoPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import CreateChannel from "./components/CreateChannel";
import Channel from "./components/Channel";
import App from "./App"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path:'',
        element: <HomePage></HomePage>
      },
      {
        path: "/signin",
        element: <SignIn/>,
      },
      {
        path:'/signup',
        element: <SignUp/>
      },
      {
        path: '/videos/:id',
        element: <VideoPage/>
      },
      {
        path:"/channel",
        element: <CreateChannel/>
      },
      {
        path:"channel/:username",
        element: <Channel/>
      }

    ]
  },
  
]);
