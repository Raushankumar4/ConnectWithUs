import axios from "axios";
import { backendUrl } from "../constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import {
  successToast,
  errorToast,
} from "../components/ResusableComponents/NotifyToast";

export const useGetProfile = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchMyProfile = async () => {
      if (!id || !token) return;

      try {
        const res = await axios.get(
          `${backendUrl}/api/v1/users/getProfile/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        successToast(res.data.message);
        dispatch(setProfile(res.data.user));
      } catch (error) {
        errorToast(error?.res?.data?.message);
        console.error("Error fetching profile:", error);

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

    fetchMyProfile();
  }, [id, token, dispatch, navigate]);
};
