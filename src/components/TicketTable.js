import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios'; 
import moment from 'moment';
import { Link } from 'react-router-dom';

import { getUrl } from '../utils/apiUtils'; 
import { useUser } from '../context/UserContext'; 

function TicketTable({propTickets, filtersValue, searchValue}) {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState ([]); 

  const url = getUrl('tickets');   
  const { user } = useUser(); 

  const statusClasses = (category) => {
    switch(category) {
        case 'New': 
            return 'bg-yellow-500'; 
        case 'In Progress':
            return 'bg-blue-500'; 
        case 'Resolved':
            return 'bg-green-500'; 
        case 'Closed':
            return 'bg-blue-500';
        default: 
            return '';
    }
  } 

  const priorityClasses = (category) => {
    switch(category) {
        case 'Low': 
            return 'bg-orange-300'; 
        case 'Medium':
            return 'bg-orange-400'; 
        case 'High':
            return 'bg-orange-500'; 
        default: 
            return '';
    }
  } 

  useEffect(() => {
    const token = sessionStorage.getItem('token'); 
    const fetchTickets = async() => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const ticketsData = response.data.tickets;
        localStorage.setItem('tickets', JSON.stringify(ticketsData));

        const userTickets = ticketsData.filter(ticket => ticket.user_id === user?.id); 
        setTickets(userTickets);
      }
      catch (error) {
        console.error("Error fetching data", error); 
      }
    };

    if (propTickets && propTickets.length > 0) {
      const userTickets = propTickets.filter(ticket => ticket.user_id === user?.id); 
      setTickets(userTickets);  
    } else {
      const storedTickets = localStorage.getItem('tickets');
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
        fetchTickets();
      }
    }
  }, [url, user?.id, propTickets]);

  
  useEffect(() => {
    const statusMap = {
      new: 1,    
      inProgress: 2,
      resolved: 3,
      closed: 4
    };

    const priorityMap = {
      low: 1,    
      medium: 2,
      high: 3,
    };

    const statusFilterActive = Object.keys(statusMap).some(filterKey => filtersValue[filterKey]);
    const priorityFilterActive = Object.keys(priorityMap).some(filterKey => filtersValue[filterKey]); 
    const allStatusActive = filtersValue.allStatus;
    const allPriorityActive = filtersValue.allPriority; 
    let result = tickets;
  
    if (statusFilterActive || priorityFilterActive || allStatusActive || allPriorityActive) {
      result = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchValue.toLowerCase());

        const matchesStatus = allStatusActive || !statusFilterActive ||  Object.keys(statusMap).some(filterKey => {
          if (filtersValue[filterKey]) {
            return ticket.status_id === statusMap[filterKey];
          }
          return false;
        });

        const matchesPriority = allPriorityActive || !priorityFilterActive ||  Object.keys(priorityMap).some(filterKey => {
          if (filtersValue[filterKey]) {
            return ticket.priority_id === priorityMap[filterKey];
          }
          return false;
        });
  
        return matchesSearch && matchesStatus && matchesPriority;
      });
    } else {
      result = tickets.filter(ticket => ticket.title.toLowerCase().includes(searchValue.toLowerCase()));
    }
    setFilteredTickets(result);
  }, [searchValue, filtersValue, tickets]);
  
  return (
    <div>
        <div className="relative overflow-x-auto p-2">
                <table id="ticketsTable"  className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs text-gray-700 uppercase border-b border-t">
                        <tr>
                            <th scope="col" className="px-5 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-5 py-3">
                                Title
                            </th>
                            <th scope="col" className="px-5 py-3">
                                Department Assigned
                            </th>
                            <th scope="col" className="px-5 py-3">
                                Employee Assigned
                            </th>
                            <th scope="col" className="px-5 py-3">
                               Ticket Status
                            </th>
                            <th scope="col" className="px-5 py-3">
                                Priority Level
                             </th>
                             <th scope="col" className="px-5 py-3">
                                Action
                             </th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredTickets.map(ticket => (
                        <tr key={ticket.id} className="border-b">
                            <td className="px-5 py-3">{moment(ticket.created_at).format('MMMM D, YYYY')}</td>
                            <td className="px-5 py-3">{ticket.title}</td>
                            <td className="px-5 py-3">{ticket.department.name}</td>
                            <td className={`px-5 py-3 ${!ticket?.employee && 'italic'}`}>
                              {ticket?.employee ?  `${ticket.employee.first_name} ${ticket.employee.last_name}` : 'Unassigned' }
                            </td>
                            <td className="px-5 py-3">
                                <span className={`inline-block rounded-full py-1.5 w-3/4 text-white text-center ${statusClasses(ticket.status.category)}`}>
                                    {ticket.status.category}
                                </span>
                            </td>
                            <td className="px-5 py-3">
                                <span className={`inline-block rounded-full py-1.5 w-3/4 text-white text-center ${priorityClasses(ticket.priority.category)}`}>
                                    {ticket.priority.category}
                                </span>
                            </td>
                            <td className="px-5 py-3">
                                <Link to={`/tickets/${ticket.id}`} className="p-2 font-medium text-blue-500 rounded-sm hover:bg-blue-500 hover:text-white">View</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
        </div>
    </div>
  )
}


export default TicketTable


