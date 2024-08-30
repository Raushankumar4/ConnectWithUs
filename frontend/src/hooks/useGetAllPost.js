import axios from "axios";
import { backendUrl } from "../constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import {
  errorToast,
  successToast,
} from "../components/ResusableComponents/NotifyToast";

export const useGetAllPost = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchMyAllPost = async () => {
      if (!id || !token) return;

      try {
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

        dispatch(getAllTweets(res.data));
        successToast(res?.data?.message || "All Post");
      } catch (error) {
        errorToast(error.res.data.message);

        if (error.response) {
          const { status, data } = error.response;

          if (status === 401) {
            errorToast("Unauthorized. Redirecting to login...");
            navigate("/login");
          } else if (status === 403) {
            errorToast("Forbidden. Access denied.");
          } else {
            errorToast("Error response status:", status);
            errorToast("Error response data:", data);
          }
        } else {
          errorToast("Error message:", error.message);
        }
      }
    };

    fetchMyAllPost();
  }, [id, token, dispatch, navigate]);
};
