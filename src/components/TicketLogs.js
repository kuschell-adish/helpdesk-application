import React, { useEffect, useState } from 'react';
import moment from 'moment';

import axiosInstance from '../utils/axiosInstance';

function TicketLogs({ticketId}) {
  const [logs, setLogs] = useState([]); 
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axiosInstance.get(`/histories/${ticketId}`);
        setLogs(response.data.histories); 
        
      }
      catch (error) {
        console.error("Error fetching data", error); 
      }
    };
    fetchLogs();
  },[ticketId]); 

  return (
    <div className="w-1/4 h-[250px] bg-gray-50 overflow-y-scroll p-2 rounded-sm">
    <p className="text-sm font-semibold">Ticket Logs</p>
    {logs.map((log, index) => 
      <div key={index} className="text-xs py-1">
        <p className="text-gray-500">{moment(log.updated_at).format('MMMM D, YYYY  h:mm A')}</p>
        <p>{log.description}</p>
        <hr></hr>
      </div>
    )}
</div>
  )
}

export default TicketLogs