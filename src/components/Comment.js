import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';

import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../context/UserContext'; 
import { toast } from 'react-toastify';

import { HiOutlinePencil } from "react-icons/hi";
import { IoTrashBinOutline } from "react-icons/io5";

import Modal from './Modal'; 
import ModalImage from "react-modal-image";

function Comment({ticketId}) {
    const { user } = useUser(); 
    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    const fetchComments = async() => {
        try {
            const response = await axiosInstance.get('/comments', {
                params: {ticketId}
            })
            const commentsData = response.data.comments;
            setComments(commentsData); 
        }   
        catch(error){
            console.error("Error fetching data", error); 
        }
    }; 

    useEffect(() => {
        fetchComments(); 
    },[ticketId]);

    const handleChange = (e) => {
        setComment(e.target.value); 
    };

    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click(); 
    }; 

    const [fileInput, setFileInput] = useState(null); 
    const [preview, setPreview] = useState(null); 
    const [hasFileError,setHasFileError] = useState(false); 
    const [fileErrorMessage, setFileErrorMessage] = useState("");
    const fileTypes = new Set([
        'image/jpeg', 
        'image/png',  
        'image/bmp',
        'video/mp4',
        'video/quicktime',
      ]);

    const handleFileChange = (event) => {
        const file = event.target.files[0]; 
        const maxSize = 50 * 1024 * 1024; //50MB
        let errorMessage = ""; 
        let allowedFiles = true; 
    
        if (!fileTypes.has(file.type)) {
            allowedFiles = false; 
            errorMessage = "Only .jpg, .jpeg, .png, .bmp, .mp4, .mov files are allowed."; 
        }

        if (file.size > maxSize) {
            allowedFiles = false; 
            errorMessage = "The maximum file size allowed is 50MB per file."; 
        }

        if (!allowedFiles) {
          setHasFileError(true);
          setFileErrorMessage(errorMessage);
          event.target.value = '';
        }
        else {
          setHasFileError(false); 
          setFileErrorMessage(""); 
          setFileInput(file);
        
          if (file.type.startsWith('image/')) {
            const objectURL = URL.createObjectURL(file);
            setPreview({ file, preview: objectURL, type: 'image' });
          }
          else {
            const objectURL = URL.createObjectURL(file);
            setPreview({ file, preview: objectURL, type: 'video' });
          }

        }
      };

      const removePreview = () => {
        setPreview(null);
        setFileInput(null); 
      } 

    const handleCommentSubmit = async(e) => {
        e.preventDefault(); 
        try {
            const formData = new FormData();

            formData.append("userId", user?.id); 
            formData.append("ticketId", ticketId);
            formData.append("commentText", comment); 

            if (fileInput) {
                formData.append("fileInput", fileInput); 
            }

            const response = await axiosInstance.post('comments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }
            });
              console.log("passed data:", response.data); 
              toast.success("Your comment has been submitted successfully.");
              setComment(""); 
              setFileInput(null);
              setPreview(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }
              fetchComments(); 
        }
        catch(error) {
            console.error("Error posting data", error); 
        }
    }; 

    const [showEdit, setShowEdit] = useState(false);
    const handleEditClose = () => setShowEdit(false);
    const handleShowEdit = (commentId, commentText) => {
        setEditingComment(commentText);  
        setEditingCommentId(commentId);  
        setShowEdit(true);
    };

    const handleEditChange = (e) => {
        setEditingComment(e.target.value);
    };
    
    const handleEditSubmit = async () => {
        try {
            const response = await axiosInstance.put(`/comments/${editingCommentId}`, {
                commentText: editingComment 
            }); 
            console.log("Successful putting data", response);
            toast.success("Your comment has been updated successfully.");

            setComments(comments => {
                return comments.map(comment => 
                    comment.id === editingCommentId ? { ...comment, comment: editingComment } : comment
                );
            });
    
            handleEditClose(); 
        }
        catch(error) {
            console.error("Error putting data", error); 
        }
    }

    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleShowDelete = (commentId) => {
        setDeletingCommentId(commentId); 
        setShowDelete(true);
    };

    const handleDelete = async () => {
        try {
            const response = await axiosInstance.delete(`/comments/${deletingCommentId}`); 
            console.log("Successful deleting data", response);
            toast.success("Your comment has been deleted successfully.");

            setComments(comments => 
                comments.filter(comment => comment.id !== deletingCommentId)
            );
    
            handleDeleteClose(); 
        }
        catch(error) {
            console.error("Error putting data", error); 
        }
    }

    const isSubmitDisabled = () => {
        return !comment || comment.length < 3;
    };

    const isCommentValid = comment && typeof comment === 'string' && comment.trim().length < 3;

    const isEditDisabled = () => {
        return !editingComment || editingComment.length < 3;
    };

    const isEditingComentValid = editingComment && typeof editingComment === 'string' && editingComment.trim().length < 3;

  return (
    <div className="w-full p-1">
        <p className="text-sm font-semibold">
            {comments.length === 0 ? 'Discussion' 
            : comments.length > 1 ?
            `Discussions (${comments.length})` : 
            'Discussion (1)'
            }</p>
        <form className="mt-5" onSubmit={handleCommentSubmit}>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="px-4 py-2 bg-white rounded-t-lg">
                    <label htmlFor="comment" className="sr-only">Your comment</label>
                    {preview && (
                        <div className="w-40 relative rounded-lg py-4 px-6" title={preview.file.name}>
                            <button title="Remove attachment" className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800" onClick={() => removePreview()}>
                                &times;
                            </button>
                            {preview.type === 'image' ? (
                                <img 
                                    src={preview.preview} 
                                    alt={preview.file.name} 
                                    className="w-full h-32 object-cover rounded-sm" 
                                />
                            ) : (
                                <video 
                                    src={preview.preview} 
                                    controls
                                    className="w-full h-32 object-cover rounded-sm"
                                />
                            )}
                    </div>
                    )}
                    <textarea 
                        id="comment" 
                        rows="3"
                        className="w-full px-2 text-sm text-gray-900 bg-white border-0" 
                        placeholder={`Comment as ${user?.first_name}`}
                        required 
                        value = {comment}
                        onChange={handleChange}>
                    </textarea>
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
                    <div className="flex flex-row items-center">
                        <button type="button" className="inline-flex justify-center items-center p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100" onClick={handleButtonClick}> 
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                            </svg>
                        </button>
                        {fileInput ? <p className="text-xs">{fileInput.name}</p> : <p className="text-xs">No file chosen</p>}
                        <input ref={fileInputRef} id="attachment" name="attachment" type="file" className="hidden" accept=".jpg, .jpeg, .png, .bmp, .mp4, .mov" onChange={handleFileChange}/>
                    </div>
                    <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                        <button 
                            type="submit" 
                            disabled= {isSubmitDisabled()}
                            className={`inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-orange-500 hover:bg-orange-600 rounded-lg ${isSubmitDisabled() && 'opacity-60 cursor-not-allowed'}`}>
                            Post 
                        </button>
                    </div>
                </div>
            </div>
            {isCommentValid && (<p className="text-xs text-red-500 -mt-2">The comment field must contain at least three characters.</p>)}
            {hasFileError && <p className="text-xs text-red-500">{fileErrorMessage}</p>}
        </form>
        
        {comments.length > 0 && 
        <div className="max-h-80 overflow-y-scroll mt-5">
        {comments.map((comment) =>
            <article className="p-6 text-base bg-white border-t border-gray-200">
                <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                            <img
                                className="mr-2 w-6 h-6 rounded-full"
                                src="/default.png"
                                alt="Profile Picture"
                            />
                            {comment?.user?.first_name} {comment?.user?.last_name}
                        </p>
                        <p className="text-xs text-gray-600">{moment(comment.updated_at).format('MMMM D, YYYY  h:mm:ss A')}</p>
                    </div>
                    {user.id === comment?.user?.id &&
                    <div className="flex space-x-2 text-orange-500 justify-end">
                        <HiOutlinePencil className="w-5 h-5 cursor-pointer"  onClick={() => handleShowEdit(comment.id, comment.comment)} />
                        <IoTrashBinOutline className="w-5 h-5 cursor-pointer"onClick={() => handleShowDelete(comment.id)} />
                    </div>
                    }
                </footer>
                <p className="text-sm text-gray-500">{comment.comment}</p>
                {comment?.attachments && comment?.attachments[0] && (
                    <div className="mt-2">
                        {comment?.attachments[0]?.file_name.endsWith('.mp4') || comment?.attachments[0]?.file_name.endsWith('.mov') ? 
                        (
                            <video
                            src={`http://127.0.0.1:8000${comment?.attachments[0]?.file_path}`}
                            width="200px"
                            controls
                            type="video/mp4"
                            />
                        ) : (
                            <ModalImage
                            small={`http://127.0.0.1:8000${comment?.attachments[0]?.file_path}`}
                            large={`http://127.0.0.1:8000${comment?.attachments[0]?.file_path}`}
                            className="w-32 h-20 rounded-sm"
                            alt={comment?.attachments[0]?.file_name}
                            />
                        )
                        }
                    </div>
                    )}
            </article>
        )}
        </div>
        }
        <Modal 
            isVisible={showEdit} 
            onClose={handleEditClose} 
            onSubmit={handleEditSubmit}
            title="Edit your comment"
            error="The comment field must contain at least three characters."
            submitText="Submit"
            cancelText="Cancel"
            isDanger={false}
            hasError={isEditingComentValid}
            disableValue={isEditDisabled()}
            maxSize="max-w-lg"
        >
            <textarea
                id="textarea"
                value={editingComment}
                onChange={handleEditChange}
                rows="3"
                className="text-sm mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
            />
        </Modal>
        <Modal 
            isVisible={showDelete} 
            onClose={handleDeleteClose} 
            onSubmit={handleDelete}
            title="Are you sure you want to delete this comment?"
            submitText="Delete"
            cancelText="Cancel"
            isDanger={true}
            maxSize="max-w-lg"
        />
    </div>
  )
}

export default Comment