import axios from "axios";
import { backendUrl } from "../constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

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

        console.log("userdata", res);
        dispatch(setProfile(res.data.user));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized. Redirecting to login...");
          navigate("/login"); 
        } else {
          console.log("Error fetching profile:", error.message);
        }
      }
    };

    fetchMyProfile();
  }, [id, token, dispatch, navigate]); 
};
