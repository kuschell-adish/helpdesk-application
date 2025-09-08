import React from 'react'

function Skeleton() {
  return (
    <div className="w-full space-y-10 animate-pulse p-3 py-5">
      <div className="grid grid-cols-7 gap-4 px-4">
        <div className="h-5 bg-gray-300 rounded-full w-40"></div>
        <div className="h-5 bg-gray-300 rounded-full w-40"></div>
        <div className="h-5 bg-gray-300 rounded-full w-40"></div>
        <div className="h-5 bg-gray-300 rounded-full w-40"></div>
        <div className="h-5 bg-gray-300 rounded-full w-32"></div>
        <div className="h-5 bg-gray-300 rounded-full w-32"></div>
        <div className="h-5 bg-gray-300 rounded-full w-24"></div>
      </div>
      <div className="space-y-10">
        {Array.from({length:5}).map((_,index) => (
      <div key={index} className="grid grid-cols-7 gap-4 px-4">
        <div className="h-5 bg-gray-200 rounded-full w-40"></div>
        <div className="h-5 bg-gray-200 rounded-full w-40"></div>
        <div className="h-5 bg-gray-200 rounded-full w-40"></div>
        <div className="h-5 bg-gray-200 rounded-full w-40"></div>
        <div className="h-5 bg-gray-200 rounded-full w-32"></div>
        <div className="h-5 bg-gray-200 rounded-full w-32"></div>
        <div className="h-5 bg-gray-200 rounded-full w-24"></div>
      </div>
      ))}
      </div>
    </div> 
  )
}

export default Skeleton