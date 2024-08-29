import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const successToast = (message) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg`}
      >
        <AiOutlineCheckCircle className="text-2xl mr-2" />
        <span>{message}</span>
      </div>
    ),
    {
      duration: 3000,
    }
  );
};

// Toast configuration for error
const errorToast = (message) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg`}
      >
        <AiOutlineCloseCircle className="text-2xl mr-2" />
        <span>{message}</span>
      </div>
    ),
    {
      duration: 3000,
    }
  );
};

export { successToast, errorToast };
