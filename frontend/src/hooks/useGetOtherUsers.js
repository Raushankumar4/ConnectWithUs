import axios from "axios";
import { backendUrl } from "../constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useGetOtherUsers = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (!id || !token) return;

      try {
        const res = await axios.get(
          `${backendUrl}/api/v1/users/getOtherUsers/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        dispatch(setOtherUsers(res.data));
        toast.success(res?.data?.message || "All Other User");
      } catch (error) {
        toast.error(error?.res?.data?.message);

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

    fetchOtherUsers();
  }, [id, token, dispatch, navigate]);
};
