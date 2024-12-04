import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function Input({label, type, name, value,placeholder, options, onChange, isDisabled, hasError, error}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const [passwordVisible, setPasswordVisibility] = useState(false); 
  const [passwordType, setPasswordType] = useState ("password"); 

  const handleEyeClick = () => {
    setPasswordType(passwordType === "password" ? "text" : "password"); 
    setPasswordVisibility(!passwordVisible); 
  }
  
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      {type === 'select' ? 
      (
        <div className="flex flex-col mb-7 gap-y-1">
          <select
            name={name}
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            className={`mt-2 w-full p-2 text-sm rounded-sm ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : 'border-[1px] border-black' }`}
            >
            <option value="">Select {name}</option>
            {options.map(option => (
              <option key ={option.id} value={option.id}>
                {option.name ? 
                option.name : 
                option.category ? 
                option. category :
                option.first_name + ' ' + option.last_name}
              </option>
            ))}
          </select>
          {hasError &&  <p className="text-xs text-red-500">{error}</p>}
        </div>
      ): type === 'password' ? (
        <div className="relative mb-3">
          <input 
            type = {passwordType}
            name = {name}
            value = {value}
            placeholder={placeholder}
            onChange={handleChange}
            disabled = {isDisabled}
            className={`mt-2 w-full p-2 text-sm rounded-sm ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : 'border-[1px] border-black' }`}>
          </input>
          { passwordVisible ? (
            <FaEye 
              onClick={handleEyeClick}
              className="absolute top-1/3 mt-2.5 right-2 transform -translate-y-1/2 cursor-pointer"
            />
            ) : (
            <FaEyeSlash
              onClick={handleEyeClick}
              className="absolute top-1/3 mt-2.5 right-2 transform -translate-y-1/2 cursor-pointer"
            />
          )}
          {hasError &&  <p className="absolute my-1 text-xs text-red-500">{error}</p>}
        </div>
      ) : 
      ( 
      <div className="flex flex-col mb-7 gap-y-1">
        <input 
          type = {type}
          name = {name}
          value = {value}
          placeholder={placeholder}
          onChange={handleChange}
          disabled = {isDisabled}
          options = {options}
          className={`mt-2 w-full p-2 text-sm rounded-sm ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : 'border-[1px] border-black' }`}>
        </input>
        {hasError &&  <p className="text-xs text-red-500">{error}</p>}
      </div>
      )}
    </div>
  )
}

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    placeholder:PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
    isDisabled: PropTypes.bool, 
    hasError:PropTypes.bool, 
    error: PropTypes.string, 
}

export default Input

