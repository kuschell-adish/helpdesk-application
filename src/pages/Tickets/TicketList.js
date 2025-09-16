import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import TicketTable from '../../components/TicketTable'
import Searchbar from '../../components/Searchbar';
import Filter from '../../components/Filter';

import axiosInstance from '../../utils/axiosInstance';

import { IoDocumentsOutline } from "react-icons/io5";
import Skeleton from '../../components/Skeleton';

import Pagination from '@mui/material/Pagination';

function TicketList() {
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [newTickets, setNewTickets] = useState([]); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleSearchChange = (value) => {
    setSearchValue(value); 
  }; 
  const handlePageChange = (event, value) => {
    setPage(value);
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
        const response = await axiosInstance.get(`/user/tickets?page=${page}`);
        const paginated = response.data.tickets;
        setNewTickets(paginated.data || []); 
        setTotalPages(paginated.last_page)
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } 
      finally {
        setLoading(false); 
      }
    };
    fetchTickets();
  },[page]); 

  console.log("tickets", newTickets); 


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row p-5 flex-grow">
          <div className="w-[4%]">
              <Sidebar/>
            </div>
              <div className="w-full bg-white p-5 rounded-lg shadow">
                <p className="text-sm font-semibold">My Filed Tickets</p>
                <Searchbar 
                  name="search"
                  placeholder="Type a title here"
                  value={searchValue}
                  onChange={handleSearchChange}
                  />
                <Filter onFilterChange={handleFilterChange} />
                {loading 
                ? <Skeleton type="tickets"/>
                : 
                newTickets.length > 0 
                ? (
                  <>
                    <TicketTable 
                      propTickets={newTickets}
                      filtersValue={filtersValue} 
                      searchValue={searchValue} 
                      loading={loading}
                    />
                    <div className="flex justify-center mt-auto py-10">
                      <Pagination 
                        count={totalPages} 
                        page={page}
                        onChange={handlePageChange}
                        variant="outlined"
                      />
                    </div>
                    
                  </>
                ) 
                : (
                  <div className="flex flex-col items-center justify-center mt-5 gap-2 p-10">
                    <IoDocumentsOutline className="text-3xl" />
                    <p className="text-sm"> No filed tickets yet</p>
                  </div>
                )
                }
              </div> 
        </div>
    </div>
  )
}

export default TicketList
