import React, { useState } from 'react';

function Filter({onFilterChange}) {
    const [isFilterVisible, setIsFilterVisible] = useState(false); 
    const handleFilterClick = () => {
        setIsFilterVisible(!isFilterVisible); 
    }; 

    const [filtersValue, setFiltersValue] = useState({
        new:false,
        inProgress:false, 
        resolved:false,
        closed:false,
        low:false,
        medium:false,
        high:false
      }); 
    
    const handleFilterChange = (e) => {
        const {id, checked} = e.target;
        let updatedFilters = {...filtersValue}; 
        if (id === 'allStatus') {
            updatedFilters = {
                allStatus: checked,
                new: checked,
                inProgress: checked,
                resolved: checked,
                closed: checked,
                allPriority: filtersValue.allPriority,
                low: filtersValue.low,
                medium: filtersValue.medium,
                high: filtersValue.high
            };
        }
        else if (id === 'allPriority') {
            updatedFilters = {
                allStatus: filtersValue.allStatus,
                new: filtersValue.new,
                inProgress: filtersValue.inProgress,
                resolved: filtersValue.resolved,
                closed: filtersValue.closed,
                allPriority: checked,
                low: checked,
                medium: checked,
                high: checked,
            };
        }
        else {
            updatedFilters[id] = checked;
            updatedFilters.allStatus = ['new', 'inProgress', 'resolved', 'closed'].every(status => updatedFilters[status]);
            updatedFilters.allPriority = ['low', 'medium', 'high'].every(priority => updatedFilters[priority]);
        }

        setFiltersValue(updatedFilters);
        onFilterChange(updatedFilters); 
    }; 

    const handleClearButton = () => {
        const updatedFilters = {
            allStatus: false,
            new: false,
            inProgress: false,
            resolved: false,
            closed: false,
            allPriority:false,
            low:false,
            medium:false,
            high:false
        };
        setFiltersValue(updatedFilters);
        onFilterChange(updatedFilters); 
    }
  return (
    <div className="text-xs mt-5 p-2">
        <div className="flex flex-row items-center space-x-3">
            <button className="flex flex-row gap-x-1 mt-1.5" onClick={handleFilterClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                <p className={`font-medium ${isFilterVisible && 'mb-2'}`}>Filter by Categories</p>
            </button>
            {isFilterVisible && <button type="button" onClick={handleClearButton} className="text-blue-500 text-xs font-medium">Clear All</button> }
        </div>
    {isFilterVisible && 
    <div className="flex flex-col gap-y-2 px-4">
        <div className="flex flex-col mt-2 gap-y-1">
            <p className="font-medium ml-1">Ticket Statuses</p>
            <div className="flex flex-row gap-x-5">
                <div className="flex items-center ps-1">
                    <input id="allStatus" type="checkbox" checked={filtersValue.allStatus} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <label htmlFor="allStatus" className="py-1.5 ms-1">Select All</label>
                </div>
                <div className="flex items-center ps-1">
                    <input id="new" type="checkbox" checked={filtersValue.new} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"/>
                    <div className="flex items-center ms-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                        <label htmlFor="new" className="py-1.5">New</label>
                    </div>
                </div>
                <div className="flex items-center ps-1">
                    <input id="inProgress" type="checkbox" checked={filtersValue.inProgress} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <div className="flex items-center ms-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <label htmlFor="inProgress" className="py-1.5">In Progress</label>
                    </div>
                </div>
                <div className="flex items-center ps-1">
                    <input id="resolved" type="checkbox" checked={filtersValue.resolved} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <div className="flex items-center ms-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <label htmlFor="resolved" className="py-1.5">Resolved</label>
                    </div>
                </div>
                <div className="flex items-center ps-1">
                    <input id="closed" type="checkbox" checked={filtersValue.closed} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <div className="flex items-center ms-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <label htmlFor="closed" className="py-1.5">Closed</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col mt-2 gap-y-1">
            <p className="font-medium ml-1">Priority Level</p>
            <div className="flex flex-row gap-x-5">
                <div className="flex items-center ps-1">
                    <input id="allPriority" type="checkbox" checked={filtersValue.allPriority} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <label htmlFor="allPriority" className="py-1.5 ms-1">Select All</label>
                </div>
                <div className="flex items-center ps-1">
                    <input id="low" type="checkbox" checked={filtersValue.low} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <div className="flex items-center ms-2">
                        <div className="w-3 h-3 rounded-full bg-orange-300 mr-1"></div>
                        <label htmlFor="low" className="py-1.5">Low</label>
                    </div>
                </div>
                <div className="flex items-center ps-1">
                    <input id="medium" type="checkbox" checked={filtersValue.medium} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <div className="flex items-center ms-2">
                        <div className="w-3 h-3 rounded-full bg-orange-400 mr-1"></div>
                        <label htmlFor="medium" className="py-1.5">Medium</label>
                    </div>
                </div>
                <div className="flex items-center ps-1">
                    <input id="high" type="checkbox" checked={filtersValue.high} onChange={handleFilterChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"></input>
                    <div className="flex items-center ms-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <label htmlFor="high" className="py-1.5">High</label>
                    </div>
                </div>
            </div>
        </div>
    </div>}
                
            
                {/* <div className="flex flex-row items-center bg-gray-300 rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 ml-3 -mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      <button id="clearButton" className="p-1.5 w-16 text-gray-800 font-medium">Reset</button>  
                </div>            */}
            </div>
  )
}

export default Filter
