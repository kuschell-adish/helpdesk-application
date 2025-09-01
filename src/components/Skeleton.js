import React from 'react'

function Skeleton() {
  return (
    <div className="my-5 max-w-4xl animate-pulse">
        <div className="h-5 bg-gray-200 rounded-full max-w-full mb-2.5"></div>
        <div className="h-5 bg-gray-200 rounded-full mb-2.5"></div>
        <div className="h-5 bg-gray-200 rounded-full max-w-xl mb-2.5"></div>
        <div className="h-5 bg-gray-200 rounded-full max-w-md mb-2.5"></div>
        <div className="h-5 bg-gray-200 rounded-full max-w-md mb-2.5"></div>
    </div>
  )
}

export default Skeleton