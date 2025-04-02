import React, {useState, useEffect} from 'react';
import moment from 'moment';

import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../context/UserContext'; 
import { toast } from 'react-toastify';

import { HiOutlinePencil } from "react-icons/hi";
import { IoTrashBinOutline } from "react-icons/io5";

import Modal from './Modal'; 

function Comment({ticketId}) {
    const { user } = useUser(); 
    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    useEffect(() => {
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
        }
        fetchComments(); 
    },[ticketId]);

    const handleChange = (e) => {
        setComment(e.target.value); 
    };

    const handleCommentSubmit = async(e) => {
        e.preventDefault(); 
        try {
            const formData = new FormData();

            formData.append("userId", user?.id); 
            formData.append("ticketId", ticketId);
            formData.append("commentText", comment); 

            const response = await axiosInstance.post('comments', formData);
              console.log("passed data:", response.data); 
              toast.success("Your comment has been submitted successfully.");
              setComment(""); 
              setComments((comments) => [response.data.data, ...comments]);
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
                    <textarea 
                        id="comment" 
                        rows="4" 
                        className="w-full px-2 text-sm text-gray-900 bg-white border-0" 
                        placeholder={`Comment as ${user?.first_name}`}
                        required 
                        value = {comment}
                        onChange={handleChange}>
                    </textarea>
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
                    <div>
                        <button type="button" className="inline-flex justify-center items-center p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
                            </svg>
                        </button>
                        <button type="button" className="inline-flex justify-center items-center p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                            </svg>
                        </button>
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
            </article>
        )}
        </div>
        }
        <Modal 
            isVisible={showEdit} 
            onClose={handleEditClose} 
            onSubmit={handleEditSubmit}
            title="Edit your comment"
            submitText="Submit"
            cancelText="Cancel"
            isDanger={false}
            hasError={isEditingComentValid}
            disableValue={isEditDisabled()}
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
        />
    </div>
  )
}

export default Comment