import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { backendUrl } from '../../../constant';
import { loginSuccess } from '../../../store/slices/authSlice';
import { setUser } from '../../../store/slices/userSlice';
import InputField from '../../ResusableComponents/InputField'; 
import Spinner from '../../ResusableComponents/Spinner';

const Login = () => {
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!userInput.email) newErrors.email = 'Email is required';
    if (!userInput.password) newErrors.password = 'Password is required';
    if (!userInput.confirmPassword)
      newErrors.confirmPassword = 'Confirm Password is required';
    if (userInput.password !== userInput.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/users/login`,
        userInput,
        {
          headers: {
            'Content-Type': 'application/json', // Ensure proper content type
          },
        }
      );
      dispatch(loginSuccess({ token: response.data.token }));
      dispatch(setUser({ user: response.data.user }));
      toast.success(response.data.message);
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
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
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Login</h1>
        <form onSubmit={handleOnSubmit} className="space-y-4">
          <InputField
            type="email"
            name="email"
            value={userInput.email}
            onChange={handleOnChange}
            label="Email"
            error={errors.email}
          />
          <InputField
            type="password"
            name="password"
            value={userInput.password}
            onChange={handleOnChange}
            label="Password"
            error={errors.password}
          />
          <InputField
            type="password"
            name="confirmPassword"
            value={userInput.confirmPassword}
            onChange={handleOnChange}
            label="Confirm Password"
            error={errors.confirmPassword}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-[#18181B] text-white hover:bg-gray-600 transition-all ease-in-out"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
