import React from 'react';
import { useEffect, useState} from 'react';

import PriorityLevel from '../components/PriorityLevel';
import Sidebar from '../components/Sidebar';
import TicketCounts from '../components/TicketCounts';
import TicketStatus from '../components/TicketStatus';

import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../context/UserContext'; 

import Skeleton from '../components/Skeleton'; 

function Dashboard() {
    const [newTicketCount, setNewTicketCount] = useState(0);
    const [progressTicketCount, setProgressTicketCount] = useState(0);
    const [resolvedTicketCount, setResolvedTicketCount] = useState(0);
    const [closedTicketCount, setClosedTicketCount] = useState(0);

    const [lowTicketCount, setLowTicketCount] = useState(0);
    const [mediumTicketCount, setMediumTicketCount] = useState(0);
    const [highTicketCount, setHighTicketCount] = useState(0);

    const [departmentData, setDepartmentData] = useState([]);
    const { user } = useUser(); 

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'adish HAP | Dashboard';
        
        const fetchTickets = async() => {
        try {
            const response = await axiosInstance.get('/tickets');
            const ticketsData = response.data.tickets;
           
            if (user) {
              const newTickets = ticketsData.filter(ticket => ticket.status_id === 1 && ticket.user_id === user.id); 
              setNewTicketCount(newTickets.length); 

              const progressTickets = ticketsData.filter(ticket => ticket.status_id === 2 && ticket.user_id === user.id);
              setProgressTicketCount(progressTickets.length);

              const resolvedTickets = ticketsData.filter(ticket => ticket.status_id === 3 && ticket.user_id === user.id);
              setResolvedTicketCount(resolvedTickets.length);

              const closedTickets = ticketsData.filter(ticket => ticket.status_id === 4 && ticket.user_id === user.id);
              setClosedTicketCount(closedTickets.length); 

              const lowTickets = ticketsData.filter(ticket => ticket.priority_id === 1 && ticket.user_id === user.id);
              setLowTicketCount(lowTickets.length);

              const mediumTickets = ticketsData.filter(ticket => ticket.priority_id === 2 && ticket.user_id === user.id);
              setMediumTicketCount(mediumTickets.length);

              const highTickets = ticketsData.filter(ticket => ticket.priority_id === 3 && ticket.user_id === user.id); 
              setHighTicketCount(highTickets.length); 

              const colorPattern = ['#9CA3AF','#E88504',];
              const userTickets = ticketsData.filter(ticket => ticket.user_id === user?.id);

              const getQuarterCount = (tickets, quarterStartMonth, quarterEndMonth) => {
                return tickets.filter(ticket => {
                  const month = new Date(ticket.created_at).getMonth() + 1;
                  return month >= quarterStartMonth && month <= quarterEndMonth;
                }).length;
              };

              const totalQuarterOne = getQuarterCount(ticketsData, 1, 3); 
              const totalQuarterTwo = getQuarterCount(ticketsData, 4, 6); 
              const totalQuarterThree = getQuarterCount(ticketsData, 7, 9); 
              const totalQuarterFour = getQuarterCount(ticketsData, 10, 12);

              const userQuarterOne = getQuarterCount(userTickets, 1, 3);
              const userQuarterTwo = getQuarterCount(userTickets, 4, 6);
              const userQuarterThree = getQuarterCount(userTickets, 7, 9);
              const userQuarterFour = getQuarterCount(userTickets, 10, 12);

              const getQuarterDeptCount = (tickets, quarterStartMonth, quarterEndMonth, departmentId) => {
                return tickets.filter(ticket => {
                  const month = new Date(ticket.created_at).getMonth() + 1;
                  return month >= quarterStartMonth && month <= quarterEndMonth && ticket.department_id === departmentId;
                }).length;
              };

              const totalQuarterOneDept = getQuarterDeptCount(ticketsData, 1, 3, user.department_id); 
              const totalQuarterTwoDept = getQuarterDeptCount(ticketsData, 4, 6, user.department_id); 
              const totalQuarterThreeDept = getQuarterDeptCount(ticketsData, 7, 9, user.department_id); 
              const totalQuarterFourDept = getQuarterDeptCount(ticketsData, 10, 12, user.department_id);

              const filteredData = [
                {
                  name: "My Tickets",
                  data: [userQuarterOne, userQuarterTwo, userQuarterThree, userQuarterFour],
                  color: colorPattern[1], 
                },
                {
                  name: "All Tickets",
                  data: [totalQuarterOne, totalQuarterTwo, totalQuarterThree, totalQuarterFour],
                  color: colorPattern[0], 
                }
              ];

              const deptData = [
                {
                  name: "My Tickets",
                  data: [userQuarterOne, userQuarterTwo, userQuarterThree, userQuarterFour],
                  color: colorPattern[1], 
                },
                {
                  name: `${user?.department?.name} Tickets`,
                  data: [totalQuarterOneDept, totalQuarterTwoDept, totalQuarterThreeDept, totalQuarterFourDept],
                  color: colorPattern[0], 
                }
              ];

              if (user.role_id === 2) {
                setDepartmentData(deptData);
              }
              else {
                setDepartmentData(filteredData);
              }

            }
            setLoading(false);
        }
        catch (error) {
            console.error("Error fetching data", error); 
            setLoading(false);
        }
        };
       if (user) {
        fetchTickets();
       }
    }, [user]);

    const statusData = [newTicketCount, progressTicketCount, resolvedTicketCount, closedTicketCount];
    const priorityData = [lowTicketCount, mediumTicketCount, highTicketCount]; 


  return (
    <div className="w-full bg-gray-50 flex min-h-screen">
       <div className="w-[4%]">
        <Sidebar/>
       </div>
            <div className="flex-1 flex flex-col py-5 md:px-5 ">
              <div className="flex flex-col md:flex-row gap-x-4">
                  <div className="w-full md:w-1/3">
                  {loading 
                  ? <Skeleton />
                  : <TicketStatus
                      seriesData = {statusData} />
                  }
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col gap-y-4">
                  {loading 
                  ? <Skeleton />
                  : <>
                  <PriorityLevel
                      seriesData = {priorityData} />
                    <TicketCounts 
                      seriesData={departmentData}/>
                  </>}
                  </div>
              </div>
            </div>
    </div>
  )
}

export default Dashboard
