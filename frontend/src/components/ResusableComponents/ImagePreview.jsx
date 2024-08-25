import React from "react";
import { CiCamera } from "react-icons/ci";

const ImagePreview = ({
  image,
  onChange,
  name,
  label,
  isProfileImage = false,
}) => (
  <div className={`relative ${isProfileImage ? "flex justify-center" : ""}`}>
    <input
      type="file"
      name={name}
      accept="image/*"
      onChange={onChange}
      className="absolute inset-0 opacity-0 cursor-pointer"
      id={`${name}Input`}
    />
    <div
      className={`bg-gray-200 overflow-hidden relative ${
        isProfileImage
          ? "w-24 h-24 border-4 border-white rounded-full"
          : "h-32 rounded-t-lg"
      }`}
    >
      {image && (
        <img
          src={image}
          alt={`${label} Preview`}
          className={`w-full h-full object-cover ${
            isProfileImage ? "rounded-full" : ""
          }`}
        />
      )}
      <label
        htmlFor={`${name}Input`}
        className={`absolute bottom-0 right-0 bg-black text-white px-2 py-1 rounded-tl-xl cursor-pointer ${
          isProfileImage ? "rounded-full" : ""
        }`}
      >
        <CiCamera />
      </label>
    </div>
  </div>
);

export default ImagePreview;
