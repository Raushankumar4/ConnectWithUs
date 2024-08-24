import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../../../constant";
import { loginSuccess } from "../../../store/slices/authSlice";
import { setUser } from "../../../store/slices/userSlice";

const Login = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!userInput.email) newErrors.email = "Email is required";
    if (!userInput.password) newErrors.password = "Password is required";
    if (!userInput.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    } else {
      if (userInput.password !== userInput.confirmPassword)
        return toast.error("Password do not match ");
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/users/login`,
        userInput
      );
      dispatch(loginSuccess({ token: response.data.token }));
      dispatch(setUser({ user: response.data.user }));
      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
          Login
        </h1>
        <form onSubmit={handleOnSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleOnChange}
              value={userInput.email}
              className="p-2 border border-gray-300 rounded-md"
            />
            {errors.email && (
              <span className="text-red-600">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleOnChange}
              value={userInput.password}
              className="p-2 border border-gray-300 rounded-md"
            />
            {errors.password && (
              <span className="text-red-600">{errors.password}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-1 font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleOnChange}
              value={userInput.confirmPassword}
              className="p-2 border border-gray-300 rounded-md"
            />
            {errors.confirmPassword && (
              <span className="text-red-600">{errors.confirmPassword}</span>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md bg-[#18181B] text-white  hover:bg-gray-600 transition-all ease-in-out `}
            disabled={loading}
          >
            {loading ? (
              <>
                <button
                  disabled
                  type="button"
                  className="font-medium rounded-lg text-sm px-4 text-center me-2 inline-flex items-center "
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
