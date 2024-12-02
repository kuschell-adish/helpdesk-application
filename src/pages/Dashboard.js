import React from 'react';
import { useEffect, useState} from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import PriorityLevel from '../components/PriorityLevel';
import Sidebar from '../components/Sidebar';
import TicketCounts from '../components/TicketCounts';
import TicketStatus from '../components/TicketStatus';

import { getUrl } from '../utils/apiUtils'; 
import { useUser } from '../context/UserContext'; 

function Dashboard() {
    const [newTicketCount, setNewTicketCount] = useState(0);
    const [progressTicketCount, setProgressTicketCount] = useState(0);
    const [resolvedTicketCount, setResolvedTicketCount] = useState(0);
    const [closedTicketCount, setClosedTicketCount] = useState(0);

    const [lowTicketCount, setLowTicketCount] = useState(0);
    const [mediumTicketCount, setMediumTicketCount] = useState(0);
    const [highTicketCount, setHighTicketCount] = useState(0);

    const [departmentData, setDepartmentData] = useState([]);

    const url = getUrl('tickets');   
    const { user } = useUser(); 

    useEffect(() => {
        document.title = 'adish HAP | Dashboard';
        
        const fetchTickets = async() => {
        try {
            const response = await axios.get(url);
            const ticketsData = response.data.tickets;
            const departmentsData = response.data.departments;

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

              const colorPattern = ['#E88504', '#9CA3AF'];
              const filteredData = departmentsData.map((department, index) => {
              const departmentTickets = ticketsData.filter(ticket => ticket.department_id === department.id);
      
              const quarterOne = departmentTickets.filter(ticket => {
                const month = new Date(ticket.created_at).getMonth() + 1;
                  return month >= 1 && month <= 3;
              }).length;
      
              const quarterTwo = departmentTickets.filter(ticket => {
                  const month = new Date(ticket.created_at).getMonth() + 1;
                  return month >= 4 && month <= 6;
              }).length;
      
              const quarterThree = departmentTickets.filter(ticket => {
                  const month = new Date(ticket.created_at).getMonth() + 1;
                  return month >= 7 && month <= 9;
              }).length;
      
              const quarterFour = departmentTickets.filter(ticket => {
                  const month = new Date(ticket.created_at).getMonth() + 1;
                  return month >= 10 && month <= 12;
              }).length;

              const userTickets = ticketsData.filter(ticket => ticket.user_id === user?.id);

              // const userQuarterOne = userTickets.filter(ticket => {
              //   const month = new Date(ticket.created_at).getMonth() + 1;
              //     return month >= 1 && month <= 3;
              // }).length;

              // const userQuarterTwo = userTickets.filter(ticket => {
              //   const month = new Date(ticket.created_at).getMonth() + 1;
              //   return month >= 4 && month <= 6;
              // }).length;

              // const userQuarterThree = userTickets.filter(ticket => {
              //   const month = new Date(ticket.created_at).getMonth() + 1;
              //   return month >= 7 && month <= 9;
              // }).length;
              // console.log("userthree", userQuarterThree); 

              // const userQuarterFour = userTickets.filter(ticket => {
              //   const month = new Date(ticket.created_at).getMonth() + 1;
              //   return month >= 10 && month <= 12;
              // }).length;

                return {
                  name: department.name + " Tickets",
                  data: [quarterOne,quarterTwo,quarterThree, quarterFour],
                  color: colorPattern[index % colorPattern.length],
                };
              });
      
              setDepartmentData(filteredData);
            }
        }
        catch (error) {
            console.error("Error fetching data", error); 
        }
        };
       if (user) {
        fetchTickets();
       }
    }, [user, url]);

    const statusData = [newTicketCount, progressTicketCount, resolvedTicketCount, closedTicketCount];
    const priorityData = [lowTicketCount, mediumTicketCount, highTicketCount]; 

    console.log(departmentData);

  return (
    <div className="bg-gray-50">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
            <Sidebar />
            </div>
            <div className="flex-1 flex flex-col min-h-screen ">
            <div className="flex flex-row gap-x-4">
                <div className="w-1/5">
                <TicketStatus
                    seriesData = {statusData} />
                </div>
                <div className="w-[78%] flex flex-col gap-y-4">
                <PriorityLevel
                    seriesData = {priorityData} />
                <TicketCounts 
                    seriesData={departmentData}/>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
