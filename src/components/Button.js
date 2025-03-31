import React from 'react'
import PropTypes from 'prop-types'

function Button({type,label,isPrimary, onClick, isDisabled, isDanger}) {
  return (
    <button 
        type={type} 
        onClick={onClick}
        disabled= {isDisabled}
        className={`w-full p-2 mt-5 rounded-sm text-sm font-semibold 
                  ${isDisabled && 'opacity-60 cursor-not-allowed'} 
                  ${isPrimary ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : isDanger ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'border border-orange-500 hover:bg-orange-500 hover:text-white'}`}
                  >
        {label}
    </button>
  )
}

Button.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    isPrimary: PropTypes.bool,
    onClick:PropTypes.bool,
    isDisabled: PropTypes.bool,
}

export default Button

