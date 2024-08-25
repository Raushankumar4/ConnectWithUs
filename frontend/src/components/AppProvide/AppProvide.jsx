// // src/AppProvider.jsx
// import React from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Provider } from "react-redux";
// import { store } from "../../store/store.js";
// import { Toaster } from "react-hot-toast";

// import App from "../../App.jsx";
// import Login from "../Pages/Login/Login.jsx";
// import Home from "../Pages/Home/Home.jsx";
// import Profile from "../Profile/Profile.jsx";
// import UpdateProfile from "../UpdateProfile/UpdateProfile.jsx";
// import PageNotFound from "../PageNotFound/PageNotFound.jsx";

// // Setup the router
// const router = createBrowserRouter([
//   { path: "/", element: <App /> },
//   { path: "/login", element: <Login /> },
//   { path: "/home", element: <Home /> },
//   { path: "/profile/:id", element: <Profile /> },
//   { path: "/profile/:id/update", element: <UpdateProfile /> },
//   { path: "*", element: <PageNotFound /> },
// ]);

// // Setup the query client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 10000,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// // AppProvider component that includes all providers and router
// const AppProvider = () => (
//   <QueryClientProvider client={queryClient}>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//       <Toaster />
//       {/* <ReactQueryDevtools initialIsOpen={false} /> */}
//     </Provider>
//   </QueryClientProvider>
// );

// export default AppProvider;
