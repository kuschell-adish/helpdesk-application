import React from 'react';
import moment from 'moment';

import ModalImage from "react-modal-image";
import { FaRegImages } from "react-icons/fa6";

import { IoDocumentTextOutline } from "react-icons/io5";

function Attachment({ticket}) {

  return (
    <div className="flex flex-col text-sm mb-7">
        <p className="font-medium">Attachments</p>
        {ticket.attachments && ticket.attachments.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2">
                {ticket.attachments.map((attachment) => (
                    <div className="flex flex-col md:flex-row gap-x-2 p-2" key={attachment.id}>
                        {attachment.file_name.endsWith('.mp4') || attachment.file_name.endsWith('.mov') ? 
                        (
                           <video
                                src={attachment.file_path}
                                controls
                                className="w-24 h-24 object-cover rounded-sm"
                            />
                        ) : attachment.file_name.endsWith('.doc') || attachment.file_name.endsWith('.docx') || attachment.file_name.endsWith('.pdf') ? (
                            <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                                <IoDocumentTextOutline className="text-7xl"/>
                            </a>
                        ) : (
                            <ModalImage
                                small={attachment.file_path}
                                large={attachment.file_path}
                                className="w-24 h-24 object-cover rounded-sm"
                                alt={attachment.file_name}
                            />
                        )}
                        <div className="flex flex-col">
                            <p className="text-xs text-orange-500 font-medium text-in-progress">{attachment.file_name}</p>
                            <p className="text-xs">Uploaded on {moment(attachment.created_at).format('MMMM D, YYYY h:mm:ss A')}</p>
                        </div>
                    </div>
                ))}
            </div>
            ) : (
                <div className="flex flex-col items-center justify-center ">
                    <FaRegImages className="w-24 h-24 text-gray-300"/>
                    <p className="text-sm">No attached files</p>
                </div>
            )}
    </div>
  )
}

export default Attachment