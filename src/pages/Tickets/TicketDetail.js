import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Attachment from '../../components/Attachment';
import TicketLogs from '../../components/TicketLogs';
import Comment from '../../components/Comment';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

import axiosInstance from '../../utils/axiosInstance';
import { useUser } from '../../context/UserContext';

function TicketDetail() {
    const { user } = useUser(); 
    const { id } = useParams();
    const navigate = useNavigate(); 
    
    const [ticket, setTicket] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [departments, setDepartments] = useState([]); 
    const [priorities, setPriorities] = useState([]); 
    const [employees, setEmployees] = useState([]); 
    const [filteredEmployees, setFilteredEmployees] = useState([]);       
    const [statuses, setStatuses] = useState([]); 

    const changeHandler = (setter) => (value) => setter(value);
    const employeeName = ticket.admin ? `${ticket?.admin?.first_name} ${ticket?.admin?.last_name}` : 'Unassigned'; 
    const userAccess = user?.role === 'user';
    
    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return 'bg-yellow-500';
            case 2:
                return 'bg-blue-600';
            case 3:
                return 'bg-green-500';
            case 4:
                return 'bg-red-500'; 
            default: 
                return 'bg-gray-500';
        }
    };

    const isButtonDisabled = () => {
        return !selectedDepartment || !selectedEmployee || !selectedPriority || !selectedStatus; 
    };

    useEffect(() => {
        document.title = 'adish HAP | Ticket Detail'
        const fetchTicket = async() => {
            try {
                const response = await axiosInstance.get(`/tickets/${id}`);
                const ticketData = response.data.ticket;
                setTicket(ticketData);
            }
            catch(error) {
                console.error("Error fetching data", error); 
            }
            finally {
                setLoading(false); 
            }
        };
        fetchTicket(); 
    },[id]);

    useEffect(() => {
        const fetchDepartments = async () => {
          try {
            const response = await axiosInstance.get('/tickets/create');
            const departmentsData = response.data.departments;
            const employeesData = response.data.employees;
            const prioritiesData = response.data.priorities; 
            const statusesData = response.data.statuses; 
            setDepartments(departmentsData); 
            setEmployees(employeesData);
            setPriorities(prioritiesData);
            setStatuses(statusesData);
          }
          catch (error) {
            console.error("Error fetching data", error); 
          }
        };
        fetchDepartments();
    },[]); 

    useEffect(() => {
        if (ticket?.department_id) {
            setSelectedDepartment(ticket.department_id);
        }
        if (ticket?.admin_id) {
            setSelectedEmployee(ticket?.admin_id);
        }
        if (ticket?.priority_id) {
            setSelectedPriority(ticket?.priority_id);
        }
        if (ticket?.status_id) {
            setSelectedStatus(ticket?.status_id);
        }
    }, [ticket?.department_id, ticket?.admin_id, ticket?.priority_id, ticket?.status_id]);

    useEffect(() => {
        if (selectedDepartment) {
            const departmentId = parseInt(selectedDepartment,10); 
            const filtered = employees.filter(employee => employee.department_id === departmentId);
            setFilteredEmployees(filtered); 
        }
        else {
            setFilteredEmployees([]); 
        }
    },[selectedDepartment, employees]);

    const handleUpdateClick = async() => {
        try {
            const payload = {
                department_id: selectedDepartment,
                admin_id: selectedEmployee,
                priority_id: selectedPriority,
                status_id: selectedStatus,
            };
        
            const response = await axiosInstance.put(`/tickets/${ticket?.id}`, payload, {
                headers: {
                'Content-Type': 'application/json'
                }
            });

            console.log("passed data:", response.data); 
            toast.success("Your ticket has been updated successfully.");
    
          //2 seconds delay 
          setTimeout(() => {
            navigate('/assigned/tickets'); 
          }, 2000); 
    
        }
        catch(error) {
          console.error("Error posting data", error); 
        }
    };

  return (
    <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        <div className="flex flex-col md:flex-row p-5">
          <div className="w-[4%]">
            <Sidebar/>
          </div>
          {loading 
           ? <Loading />
           : 
            <div className="flex flex-col w-full mr-3 mb-5 gap-5">
            <div className="w-full bg-white p-5 rounded-lg shadow">
                    <div className="w-full">
                        <TicketLogs 
                            ticketLogs={ticket?.histories}
                        />
                    </div>

                    <div className="flex flex-col justify-between gap-x-5 py-3">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 px-2 gap-x-10">
                                <Input
                                    label="Ticket Status"
                                    type={userAccess ? "text" : "select"}
                                    name="status"
                                    value={userAccess ? ticket?.status?.category : selectedStatus}
                                    options={statuses}
                                    onChange={changeHandler(setSelectedStatus)}
                                    isDisabled={userAccess}
                                    addedStyles={userAccess ? `text-white ${getStatusColor(ticket?.status_id)}` : ''}
                                />
                                <Input
                                    label="Last Updated on"
                                    type="text"
                                    name="date"
                                    value={moment(ticket.updated_at).format('MMMM D, YYYY h:mm A')}
                                    isDisabled={true}
                                />
                                <Input
                                    label="Department Assigned"
                                    type={userAccess ? "text" : "select"}
                                    name="department"
                                    value={userAccess ? ticket?.department?.category : selectedDepartment}
                                    options={departments}
                                    onChange={changeHandler(setSelectedDepartment)}
                                    isDisabled={userAccess}
                                />
                                <Input
                                    label="Employee Assigned"
                                    type={userAccess ? "text" : "select"}
                                    name="employee"
                                    value={userAccess ? employeeName : selectedEmployee}
                                    options={filteredEmployees}
                                    onChange={changeHandler(setSelectedEmployee)}
                                    isDisabled={userAccess}
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
                                    type={userAccess ? "text" : "select"}
                                    name="priority"
                                    value={userAccess ? ticket?.priority?.category : selectedPriority}
                                    options={priorities}
                                    onChange={changeHandler(setSelectedPriority)}
                                    isDisabled={userAccess}
                                />
                        </div>
                        <div className="w-full px-2 grid grid-cols-1 gap-y-7">
                            <div className="text-sm">
                                <p className="font-medium">Description</p>
                                <div 
                                    className="mt-2 p-2 text-sm rounded-sm bg-gray-200 cursor-not-allowed" 
                                    dangerouslySetInnerHTML={{ __html: ticket.description }} 
                                />
                            </div>
                            <div>
                                <Attachment 
                                    ticket={ticket}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {!userAccess  && (
                        <div className="w-full flex justify-end">
                            <div className="w-28 gap-x-2 mr-2">
                                <Button 
                                    type="submit"
                                    label="Update"
                                    isPrimary={true}
                                    onClick={handleUpdateClick}
                                    isDisabled={isButtonDisabled()}
                                />
                            </div>
                        </div>
                    )}
            </div>
                <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
                    <Comment
                        ticketComments = {ticket?.comments}
                        ticketId= {ticket?.id}
                    />
                </div>
            </div>
            }
        </div>
    </div>

  )
}

export default TicketDetail