import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendUrl } from "../../constant";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../../store/slices/userSlice";
import { successToast } from "../ResusableComponents/NotifyToast";

const UpdatePost = ({ postId, post }) => {
  const [updatePostState, setUpdatePostState] = useState({
    description: post?.description || "",
    postImage: post?.postImage || null,
  });
  const [imagePreview, setImagePreview] = useState(post?.postImage || "");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = user?.user?._id;

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "postImage") {
      const file = files[0];
      setUpdatePostState((prev) => ({
        ...prev,
        [name]: file,
      }));
      setImagePreview(file ? URL.createObjectURL(file) : "");
    } else {
      setUpdatePostState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOnUpdatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!id || !token || !postId) return;

      const formData = new FormData();
      formData.append("id", id);
      formData.append("description", updatePostState.description);
      if (updatePostState.postImage) {
        formData.append("postImage", updatePostState.postImage);
      }

      const response = await axios.put(
        `${backendUrl}/api/v1/tweet/update/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      dispatch(updatePost(response.data));
      successToast(response.data.message);
      navigate("/home");
    } catch (error) {
      console.error(
        "Update failed:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setUpdatePostState((prev) => ({ ...prev, postImage: null }));
    setImagePreview("");
  };

  return (
    <div className="h-auto">
      <form onSubmit={handleOnUpdatePost} className="space-y-2 flex flex-col">
        <h1>Description</h1>
        <input
          className="bg-gray-200 ring-2 p-3 rounded-md shadow-md outline-none focus:right-2"
          type="text"
          name="description"
          value={updatePostState.description}
          onChange={handleOnChange}
        />
        <label className="bg-gray-200 rounded-md p-2 w-fit" htmlFor="postImage">
          Add image
        </label>
        <input
          className="opacity-0"
          type="file"
          accept="image/*"
          name="postImage"
          id="postImage"
          onChange={handleOnChange}
        />
        {imagePreview && (
          <div className="relative mt-4">
            <img
              src={imagePreview}
              alt="Cover Preview"
              className="w-1/2 h-20 md:h-48 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-lg border border-gray-300 text-black text-lg"
            >
              &times;
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-400 p-2 rounded-md shadow-md hover:bg-blue-600 w-fit"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
