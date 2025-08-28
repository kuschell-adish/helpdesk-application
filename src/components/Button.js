import React from 'react';

function Button({type,label,isPrimary, onClick, isDisabled, isDanger}) {
  return (
    <button 
        type={type} 
        onClick={onClick}
        disabled= {isDisabled}
        className={`w-full p-2 mt-4 rounded text-sm font-semibold 
                  ${isDisabled && 'opacity-60 cursor-not-allowed'} 
                  ${isPrimary ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : isDanger ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'border border-orange-500 hover:bg-orange-500 hover:text-white'}`}
                  >
        {label}
    </button>
  )
}

export default Button

