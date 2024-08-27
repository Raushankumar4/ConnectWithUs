import axios from "axios";
import { backendUrl } from "../constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyAllPost } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useGetMyPost = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchMyPost = async () => {
      if (!id || !token) return;

      try {
        console.log("Token:", token);

        const res = await axios.get(
          `${backendUrl}/api/v1/tweet/getmypost/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        
        dispatch(getMyAllPost(res.data));
      } catch (error) {
        toast.error(error?.res?.data?.message);
        console.error("Error while fetching the post:", error);

        if (error.response) {
          const { status, data } = error.response;

          if (status === 401) {
            console.log("Unauthorized. Redirecting to login...");
            navigate("/login");
          } else if (status === 403) {
            console.log("Forbidden. Access denied.");
          } else {
            console.log("Error response status:", status);
            console.log("Error response data:", data);
          }
        } else {
          console.log("Error message:", error.message);
        }
      }
    };

    fetchMyPost();
  }, [id, token, dispatch, navigate]);
};
