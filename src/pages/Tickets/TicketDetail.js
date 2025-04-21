import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import Attachment from '../../components/Attachment';
import TicketLogs from '../../components/TicketLogs';
import Comment from '../../components/Comment';
import Button from '../../components/Button';

import axiosInstance from '../../utils/axiosInstance';
import { useUser } from '../../context/UserContext';

function TicketDetail() {
    const { user } = useUser(); 
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [ticket, setTicket] = useState("");
    const employeeName = ticket.employee ? `${ticket?.employee?.first_name} ${ticket?.employee?.last_name}` : 'Unassigned'; 

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
        };
        fetchTicket(); 
    },[id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return 'bg-yellow-500';
            case 2:
                return 'bg-blue-500';
            case 3:
                return 'bg-green-500';
            case 4:
                return 'bg-red-500';
          default:
            return ''; 
        }
    };

    //user access
    const userAccess = user?.role_id === 3; 

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const [departments, setDepartments] = useState([]); 
    const [priorities, setPriorities] = useState([]); 
    const [employees, setEmployees] = useState([]); 
    const [filteredEmployees, setFilteredEmployees] = useState([]);       
    const [statuses, setStatuses] = useState([]);       

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
        if (ticket?.employee_id) {
            setSelectedEmployee(ticket?.employee_id);
        }
        if (ticket?.priority_id) {
            setSelectedPriority(ticket?.priority_id);
        }
        if (ticket?.status_id) {
            setSelectedStatus(ticket?.status_id);
        }
      }, [ticket?.department_id, ticket?.employee_id, ticket?.priority_id, ticket?.status_id]);


    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value); 
    }
    
    const handleEmployeeChange = (value) => {
        setSelectedEmployee(value); 
    }

    const handleStatusChange = (value) => {
        setSelectedStatus(value); 
    }
    
    const handlePriorityChange = (value) => {
        setSelectedPriority(value); 
    }

    const handleUpdateClick = async() => {

        try {
            const payload = {
                selectedDepartment,
                selectedEmployee,
                selectedPriority,
                selectedStatus,
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
      }

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

    console.log(selectedPriority); 

  return (
    <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
            <Sidebar />
            </div>
            <div className="flex flex-col w-full mr-3 mb-5 gap-5">
            <div className="w-full bg-white p-5 rounded-lg shadow">
                <div className="flex flex-row justify-between gap-x-5 py-3">
                    <div className="grid grid-cols-2 gap-x-12 px-2 w-3/4">
                        <Input
                            label="Ticket Status"
                            type={userAccess ? "text" : "select"}
                            name="status"
                            value={userAccess ? ticket?.status?.category : selectedStatus}
                            options={statuses}
                            onChange={handleStatusChange}
                            isDisabled={userAccess}
                            addedStyles={userAccess ? `text-white ${getStatusColor(ticket?.status_id)}` : ''}
                        />
                        <Input
                            label="Last Updated on"
                            type="text"
                            name="date"
                            value={moment(ticket.updated_at).format('MMMM D, YYYY')}
                            isDisabled={true}
                        />
                        <Input
                            label="Department Assigned"
                            type={userAccess ? "text" : "select"}
                            name="department"
                            value={userAccess ? ticket?.department?.name : selectedDepartment}
                            options={departments}
                            onChange={handleDepartmentChange}
                            isDisabled={userAccess}
                        />
                        <Input
                            label="Employee Assigned"
                            type={userAccess ? "text" : "select"}
                            name="employee"
                            value={userAccess ? employeeName : selectedEmployee}
                            options={filteredEmployees}
                            onChange={handleEmployeeChange}
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
                            onChange={handlePriorityChange}
                            isDisabled={userAccess}
                        />
                    </div>
                   <TicketLogs 
                    ticketId={ticket?.id}
                    />
                </div>
                <div className="flex flex-col text-sm px-2 mb-7 -mt-2">
                    <p className="font-medium">Description</p>
                    <div 
                        className="mt-2 w-full p-2 text-sm rounded-sm bg-gray-200 cursor-not-allowed" 
                        dangerouslySetInnerHTML={{ __html: ticket.description }} 
                    />
                </div>
                <Attachment 
                    ticket={ticket}
                />
                <div className="w-full flex justify-end">
                    <div className="w-28 gap-x-2 mr-2">
                    <Button 
                        type="submit"
                        label="Update"
                        isPrimary={true}
                        onClick={handleUpdateClick}
                    />
                    </div>
              </div>
    
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
                <Comment
                    ticketId = {ticket?.id}
                />
            </div>
            </div>
        </div>
    </div>

  )
}

export default TicketDetail