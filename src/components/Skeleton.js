import React from 'react'

function Skeleton() {
  return ( 
    <div className="w-full space-y-10 animate-pulse p-3 py-5">
      {Array.from({length:7}).map((_,index) => (
        <div key={index} className="space-y-8">
          <div className="h-5 bg-gray-200 rounded-full w-full"/>
        </div>
      ))} 
    </div> 
  )
}

export default Skeleton