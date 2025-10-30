import React from 'react';
import moment from 'moment';

function TicketLogs({ticketLogs}) {

  return (
    <div className="w-full max-h-64 bg-gray-50 overflow-y-scroll shadow-sm p-3 mb-5 rounded-sm">
      <p className="text-sm font-semibold">Ticket Logs</p>
      {ticketLogs.map((log, index) => 
        <div key={index} className="text-xs py-2">
          <p className="text-gray-500">{moment(log.updated_at).format('MMMM D, YYYY  h:mm A')}</p>
          <p>{log.description}</p>
          <hr></hr>
        </div>
      )}
    </div>
  )
}

export default TicketLogs