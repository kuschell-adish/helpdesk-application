import React from 'react';
import moment from 'moment';

function TicketLogs({ticket}) {
  return (
    <div className="w-1/4 h-60 overflow-y-scroll p-1">
    <p className="text-sm font-semibold">Ticket Logs</p>
    <div className="text-xs py-1">
        <p className="text-gray-500">{moment(ticket.updated_at).format('MMMM D, YYYY  h:mm:ss A')}</p>
        <p>Ticket has set its status to "New" by {ticket?.user?.first_name} {ticket?.user?.last_name}. </p>
        <hr></hr>
    </div>
    <div className="text-xs py-1">
        <p className="text-gray-500">{moment(ticket.updated_at).format('MMMM D, YYYY  h:mm:ss A')}</p>
        <p>Ticket has been created by {ticket?.user?.first_name} {ticket?.user?.last_name}. </p>
        <hr></hr>
    </div>
</div>
  )
}

export default TicketLogs