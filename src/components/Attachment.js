import React from 'react';
import moment from 'moment';
import { FaRegImages } from "react-icons/fa6";
import ModalImage from "react-modal-image";

function Attachment({ticket}) {
  return (
    <div className="flex flex-col text-sm px-2 mb-7">
        <p className="font-medium">Attachments</p>
        {ticket.attachments && ticket.attachments.length > 0 ? (
             <div className="grid grid-cols-2 gap-x-24 py-3">
                {ticket.attachments.map((attachment) => (
                    <div className="flex flex-row gap-x-2 px-2 pb-3" key={attachment.file_name}>
                       <ModalImage
                                small={`http://127.0.0.1:8000${attachment.file_path}`}
                                large={`http://127.0.0.1:8000${attachment.file_path}`}
                                className="w-32 h-20 rounded-sm"
                                alt={attachment.file_name}
                        />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium underline text-in-progress">{attachment.file_name}</p>
                            <p className="text-xs">Uploaded on {moment(attachment.created_at).format('MMMM D, YYYY h:mm:ss a')}</p>
                        </div>
                    </div>
                ))}
            </div>
            ) : (
                <div className="flex flex-col items-center justify-center ">
                    <FaRegImages className="w-32 h-32 text-gray-300"/>
                    <p className="text-sm italic">No attached files</p>
                </div>
            )}
    </div>
  )
}

export default Attachment