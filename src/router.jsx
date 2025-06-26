import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import Forgotpassword from "./components/Forgotpassword";
import UpdatePassword from "./components/UpdatedPassword";

export const router = createBrowserRouter ([
    { path:"/",element:<App />},
    {path:"/signup",element:<Signup/>},
    {path:"/signin",element:<Signin/>},
    {path:"/dashboard",element:<Dashboard/>},
    { path: '/forgot-password', element: <Forgotpassword /> },
    {path:"/update-password", element:<UpdatePassword />} 
])