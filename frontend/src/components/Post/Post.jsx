import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../../constant";
import toast from "react-hot-toast";
import { getCreatedTweets } from "../../store/slices/userSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Post = () => {
  const [post, setPost] = useState({
    description: "",
    postImage: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const userId = user?.user?._id;

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "postImage") {
      const file = files[0];
      setPost((prevPost) => ({
        ...prevPost,
        [name]: file,
      }));
      setImagePreview(file ? URL.createObjectURL(file) : "");
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  const handleQuillChange = (value) => {
    setPost((prevPost) => ({
      ...prevPost,
      description: value,
    }));
  };

  const handleOnPost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !userId || !token) {
      return handleError("User not authenticated or missing parameters.");
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("description", post.description);
      if (post.postImage) {
        formData.append("postImage", post.postImage);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/v1/tweet/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      dispatch(getCreatedTweets({ tweet: data }));
      toast.success(data.message);
      navigate("/home");
    } catch (err) {
      handleError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message) => {
    setError(message);
    toast.error(message);
  };

  const handleRemoveImage = () => {
    setPost((prevPost) => ({ ...prevPost, postImage: null }));
    setImagePreview("");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center p-4 md:p-6 lg:p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl relative">
        <div className="absolute top-4 left-4 flex items-center space-x-4">
          <img
            src={user?.user?.profileImage}
            alt="Profile"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
          />
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 md:gap-8">
            <h2 className="text-base md:text-lg font-semibold">
              {user?.user?.fullName}
            </h2>
            <Link
              to="/home"
              className="bg-black text-white p-2 rounded-md shadow-md text-center"
            >
              Back
            </Link>
          </div>
        </div>
        <form
          onSubmit={handleOnPost}
          className="pt-24 pl-20 md:pt-28 md:pl-24 lg:pt-32 lg:pl-28"
        >
          <h1 className="text-xl md:text-2xl mb-4 font-semibold">
            Create a Post
          </h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm md:text-base"
            >
              Description
            </label>
            <ReactQuill
              value={post.description}
              onChange={handleQuillChange}
              theme="snow"
              className="text-sm md:text-base"
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="postImage"
              className="text-white text-xs md:text-sm bg-black p-2 md:p-3 rounded-lg flex items-center justify-center cursor-pointer    md:w-10 md:h-10 min-w-fit"
            >
              Add image
            </label>
            <input
              onChange={handleOnChange}
              type="file"
              accept="image/*"
              name="postImage"
              id="postImage"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {imagePreview && (
              <div className="relative mt-4">
                <img
                  src={imagePreview}
                  alt="Cover Preview"
                  className="w-full h-40 md:h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-lg border border-gray-300 text-black text-lg"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-blue-700"
              } text-white py-2 px-4 rounded-md text-sm md:text-base`}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
