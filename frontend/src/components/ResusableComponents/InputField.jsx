import React from "react";

const InputField = ({ type, name, value, onChange, label, error }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-md"
    />
    {error && <span className="text-red-600">{error}</span>}
  </div>
);

export default InputField;
