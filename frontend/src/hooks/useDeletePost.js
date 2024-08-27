// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { backendUrl } from "../constant";
// import toast from "react-hot-toast";

// export const useDeletePost = (id) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const token = useSelector((state) => state.auth.token);

//   if (!id || !token) return;
//   const deleteUserPost = async () => {
//     try {
//       const res = await axios.delete(
//         `${backendUrl}/api/v1/tweet/delete/${id}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );
//     } catch (error) {
//       toast.error(error?.res?.data?.message || "Somthing went wrong");
//       console.error("Error while deleting:", error);

//       if (error.response) {
//         const { status, data } = error.response;

//         if (status === 401) {
//           console.log("Unauthorized. Redirecting to login...");
//           navigate("/login");
//         } else if (status === 403) {
//           console.log("Forbidden. Access denied.");
//         } else {
//           console.log("Error response status:", status);
//           console.log("Error response data:", data);
//         }
//       } else {
//         console.log("Error message:", error.message);
//       }
//     }
//   };
//   deleteUserPost();
// };
