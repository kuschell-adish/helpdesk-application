import React, {useState, useEffect} from 'react';
import moment from 'moment';
import axios from 'axios';

import { getUrl } from '../utils/apiUtils';
import { useUser } from '../context/UserContext'; 
import { toast } from 'react-toastify';

import { HiOutlinePencil } from "react-icons/hi";
import { IoTrashBinOutline } from "react-icons/io5";

import Button from './Button';

function Comment({ticketId, value, placeholder, onChange, onSubmit}) {
    const { user } = useUser(); 
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token'); 
        const url = getUrl('comments'); 
        const fetchComments = async() => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, 
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
        onChange(e.target.value);
    };
    const [showEdit, setShowEdit] = useState(false);
    const handleEditClose = () => setShowEdit(false);
    const handleShowEdit = (commentId, commentText) => {
        setEditingComment(commentText);  
        setEditingCommentId(commentId);  
        setShowEdit(true);
    };

    const putUrl = getUrl(`comments/${editingCommentId}`); 
    const token = sessionStorage.getItem('token'); 
    const handleEditChange = (e) => {
        setEditingComment(e.target.value);
    };
    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(putUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
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
    const destroyUrl = getUrl(`comments/${deletingCommentId}`); 
    const handleDelete = async () => {
        try {
            const response = await axios.delete(destroyUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }); 
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

  return (
    <div className="w-full p-1">
        <p className="text-sm font-semibold">
            {comments.length === 0 ? 'Discussion' 
            : comments.length > 1 ?
            `Discussions (${comments.length})` : 
            'Discussion (1)'
            }</p>
        <form className="mt-5" onSubmit={onSubmit}>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="px-4 py-2 bg-white rounded-t-lg">
                    <label htmlFor="comment" className="sr-only">Your comment</label>
                    <textarea 
                        id="comment" 
                        rows="4" 
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0" 
                        placeholder={placeholder}
                        required 
                        value = {value}
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
                        <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-orange-500 hover:bg-orange-600 rounded-lg">
                            Post 
                        </button>
                    </div>
                </div>
            </div>
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
                        <p className="text-sm text-gray-600">{moment(comment.updated_at).format('MMMM D, YYYY')}</p>
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

        {showEdit && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={handleEditClose}>
                <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                        <button onClick={handleEditClose} className="text-gray-500 hover:text-gray-800">
                            &times;
                        </button>
                    </div>

                    <div className="mt-4">
                        <form>
                            <div className="mb-4">
                                <label htmlFor="textarea" className="block text-sm font-medium text-gray-700">
                                    Edit your comment
                                </label>
                                <textarea
                                    id="textarea"
                                    value={editingComment}
                                    onChange={handleEditChange}
                                    rows="3"
                                    className="text-sm mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    autoFocus
                                />
                            </div>
                        </form>
                    </div>

                    <div className="w-full flex space-x-4">
                        <Button 
                            type="button"
                            label="Cancel"
                            isPrimary={false}
                            onClick={handleEditClose}
                        />
                        <Button 
                            type="submit"
                            label="Submit"
                            isPrimary={true}
                            onClick={handleEditSubmit}
                        />
                    </div>
                </div>
            </div>
        )}

        {showDelete && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={handleDeleteClose}>
                <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                        <button onClick={handleDeleteClose} className="text-gray-500 hover:text-gray-800">
                            &times;
                        </button>
                    </div>

                    <div className="mt-4">
                        <p>Are you sure you want to permanently delete this comment?</p>
                    </div>

                    <div className="w-full flex space-x-4">
                        <Button 
                            type="button"
                            label="Cancel"
                            isPrimary={false}
                            onClick={handleDeleteClose}
                        />
                        <Button 
                            type="submit"
                            label="Delete"
                            isDanger={true}
                            onClick={handleDelete}
                        />
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Comment