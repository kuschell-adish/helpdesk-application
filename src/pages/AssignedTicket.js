import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import TicketTable from '../components/TicketTable'
import Searchbar from '../components/Searchbar';
import Filter from '../components/Filter';
import Skeleton from '../components/Skeleton';

import axiosInstance from '../utils/axiosInstance';

import { IoDocumentsOutline } from "react-icons/io5";
import { Pagination } from '@mui/material';

function AssignedTicket() {
  const [loading, setLoading] = useState(true); 
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [newTickets, setNewTickets] = useState([]); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value); 
  }; 

  const handleFilterChange = (newFilters) => {
    setFiltersValue(newFilters);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    document.title = "adish HAP | Assigned Tickets"
    fetchTickets();
  }, [debouncedSearch, filtersValue, page]);

  const fetchTickets = async () => {
    try {
      const statusIds = [];
      if (filtersValue.new) statusIds.push(1);
      if (filtersValue.inProgress) statusIds.push(2);
      if (filtersValue.resolved) statusIds.push(3);
      if (filtersValue.closed) statusIds.push(4);

      const priorityIds = [];
      if (filtersValue.low) priorityIds.push(1);
      if (filtersValue.medium) priorityIds.push(2);
      if (filtersValue.high) priorityIds.push(3);

      const params = {
        search: debouncedSearch,
        status_ids: statusIds,
        priority_ids: priorityIds,
        all_status: filtersValue.allStatus,
        all_priority: filtersValue.allPriority
      }

      console.log('Filters:', filtersValue);
      console.log('Status IDs:', statusIds);
      console.log('Priority IDs:', priorityIds);
      console.log('Params being sent:', params); 
    
      const response = await axiosInstance.get(`/admin/tickets?page=${page}`, {
        params: params
      });

      const paginated = response.data.tickets;
      
      console.log('Response:', response.data); 
      setNewTickets(paginated.data || []); 
      setTotalPages(paginated.last_page)
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } 
    finally {
      setLoading(false); 
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row p-5 flex-grow">
          <div className="w-[4%]">
              <Sidebar/>
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
              <p className="text-sm font-semibold">My Assigned Tickets</p>
                  <Searchbar 
                  name="search"
                  placeholder="Type a title here"
                  value={searchValue}
                  onChange={handleSearchChange}
                  />
                  <Filter filtersValue={filtersValue} onFilterChange={handleFilterChange} />
                  {loading 
                ? <Skeleton />
                : newTickets.length > 0 
                ? (
                <>
                  <TicketTable 
                    propTickets={newTickets}
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
                ) : (
                  <div className="flex flex-col items-center justify-center mt-5 gap-2 p-10">
                    <IoDocumentsOutline className="text-3xl" />
                    <p className="text-sm"> No assigned tickets yet</p>
                  </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default AssignedTicket
