import React from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';

function TicketTable({propTickets}) {

  const statusClasses = (category) => {
    switch(category) {
        case 'New': 
            return 'bg-yellow-500'; 
        case 'In Progress':
            return 'bg-blue-500'; 
        case 'Resolved':
            return 'bg-green-500'; 
        case 'Closed':
            return 'bg-red-500';
        default: 
            return '';
    }
  }; 

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
  }; 

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
                    {propTickets.map(ticket => (
                        <tr key={ticket.id} className="border-b">
                            <td className="px-5 py-3">{moment(ticket.updated_at).format('MMMM D, YYYY')}</td>
                            <td className="px-5 py-3">{ticket.title}</td>
                            <td className="px-5 py-3">{ticket.department.category}</td>
                            <td className={`px-5 py-3 ${!ticket?.admin && 'italic'}`}>
                              {ticket?.admin ?  `${ticket.admin.first_name} ${ticket.admin.last_name}` : 'Unassigned' }
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


