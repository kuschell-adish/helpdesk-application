import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import Attachment from '../../components/Attachment';
import TicketLogs from '../../components/TicketLogs';

import { getUrl } from '../../utils/apiUtils';


function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState("");
    const url = getUrl(`tickets/${id}`); 

    useEffect(() => {
        document.title = 'adish HAP | Knowledge Base'
        const token = sessionStorage.getItem('token');
        const fetchTicket = async() => {
            try {
                const response = await axios.get(url, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                const ticketData = response.data.ticket;
                setTicket(ticketData);
            }
            catch(error) {
                console.error("Error fetching data", error); 
            }
        };
        fetchTicket(); 
    },[id]);

    console.log("ticket:", ticket); 
    const employeeName = ticket.employee ? `${ticket?.employee?.first_name} ${ticket?.employee?.last_name}` : 'Unassigned'; 
  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
            <Sidebar />
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
                <div className="flex flex-row justify-between gap-x-5 py-3">
                    <div className="grid grid-cols-2 gap-x-12 px-2 w-3/4">
                        <Input
                        label="Ticket Status"
                        type="text"
                        name="ticketStatus"
                        value={ticket?.status?.category}
                        isDisabled={true}
                        />
                        <Input
                        label="Last Updated on"
                        type="text"
                        name="date"
                        value={moment(ticket.updated_at).format('MMMM D, YYYY')}
                        isDisabled={true}
                        />
                        <Input
                        label="Department Assigned"
                        type="text"
                        name="departmentName"
                        value={ticket?.department?.name}
                        isDisabled={true}
                        />
                        <Input
                        label="Employee Assigned"
                        type="text"
                        name="employeeName"
                        value={employeeName}
                        isDisabled={true}
                        />
                        <Input
                        label="Title"
                        type="text"
                        name="title"
                        value={ticket.title}
                        isDisabled={true}
                        />
                        <Input
                        label="Priority Level"
                        type="text"
                        name="priorityLevel"
                        value={ticket?.priority?.category}
                        isDisabled={true}
                        />
                    </div>
                   <TicketLogs 
                    ticket={ticket}
                    />
                </div>
                <div className="flex flex-col text-sm px-2 mb-7">
                    <p className="font-medium">Description</p>
                    <div 
                        className="mt-2 w-full p-2 text-sm rounded-sm bg-gray-200 cursor-not-allowed" 
                        dangerouslySetInnerHTML={{ __html: ticket.description }} 
                    />
                </div>
                <Attachment 
                    ticket={ticket}
                />
    
            </div>
        </div>
    </div>

  )
}

export default TicketDetail