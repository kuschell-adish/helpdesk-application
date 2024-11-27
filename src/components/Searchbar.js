import React from 'react'
import PropTypes from 'prop-types'

function Searchbar({name, placeholder, value, onChange}) {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

  return (
    <div className="p-2 mt-5">
        <div className="flex items-center bg-gray-50 rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-500 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
                type="text" 
                name={name} 
                placeholder={placeholder} 
                value={value} 
                onChange={handleChange} 
                className="p-2 text-sm flex-1 bg-gray-50 border-none outline-none"/>
        </div>
    </div>
  )
}

Searchbar.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func, 
}

export default Searchbar

