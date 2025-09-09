import React from 'react';
import moment from 'moment';

function TicketLogs({ticketLogs}) {

  return (
    <div className="w-1/4 h-[250px] bg-gray-50 overflow-y-scroll p-2 rounded-sm">
      <p className="text-sm font-semibold">Ticket Logs</p>
      {ticketLogs.map((log, index) => 
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