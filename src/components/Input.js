import React from 'react';
import PropTypes from 'prop-types';

function Input({label, type, name, value,placeholder, options, onChange, isDisabled, hasError, error}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

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
      ):
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

