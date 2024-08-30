import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Pages/Login/Login.jsx";
import Home from "./components/Pages/Home/Home.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./components/PageNotFound/PageNotFound.jsx";
import Profile from "./components/Profile/Profile.jsx";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile.jsx";
import RegisterUser from "./components/Pages/RegisterUser/RegisterUser.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegisterUser />,
  },
  {
    path: "/home",
    element: <Home />,
  },

  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/profile/:id/update",
    element: <UpdateProfile />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster />
  </Provider>
);
