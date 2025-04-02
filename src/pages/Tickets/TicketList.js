import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import TicketTable from '../../components/TicketTable'
import Searchbar from '../../components/Searchbar';
import Filter from '../../components/Filter';

import axiosInstance from '../../utils/axiosInstance';

function TicketList() {
  const [searchValue, setSearchValue] = useState("");
  const [newTickets, setNewTickets] = useState([]); 
  const handleSearchChange = (value) => {
    setSearchValue(value); 
  }; 

  const [filtersValue, setFiltersValue] = useState({
    allStatus:false,
    new:false,
    inProgress:false, 
    resolved:false,
    closed:false,
    allPriority:false,
    low:false,
    medium:false,
    high:false
  }); 

  const handleFilterChange = (newFilters) => {
    console.log('Filters changed:', newFilters);
    setFiltersValue(newFilters);
  };

  useEffect(() => {
    document.title = "adish HAP | My Tickets"
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/tickets');
        setNewTickets(response.data.tickets || []); 
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } 
    };
    fetchTickets(); 
  },[]); 


  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
                <Sidebar />
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
              <p className="text-sm font-semibold">My Filed Tickets</p>
              <Searchbar 
              name="search"
              placeholder="Type a title here"
              value={searchValue}
              onChange={handleSearchChange}
              />
               <Filter onFilterChange={handleFilterChange} />
              <TicketTable 
                propTickets={newTickets}
                filtersValue={filtersValue} 
                searchValue={searchValue} 
              />
            </div>
        </div>
    </div>
  )
}

export default TicketList
