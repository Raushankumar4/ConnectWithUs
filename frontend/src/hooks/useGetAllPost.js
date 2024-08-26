import axios from "axios";
import { backendUrl } from "../constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useGetAllPost = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchMyAllPost = async () => {
      if (!id || !token) return;

      try {
        console.log("Fetching all post with ID:", id);
        console.log("Token:", token);

        const res = await axios.get(
          `${backendUrl}/api/v1/tweet/getalltweets/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("Profile data:", res.data);
        toast.success(res?.data?.message || "All Post");
        dispatch(getAllTweets(res.data));
      } catch (error) {
        toast.error(error.res.data.message);
        console.error("Error fetching All Post:", error);

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

    fetchMyAllPost();
  }, [id, token, dispatch, navigate]);
};
