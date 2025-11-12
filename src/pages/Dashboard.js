import React from 'react';
import { useEffect, useState} from 'react';

import PriorityLevel from '../components/PriorityLevel';
import Sidebar from '../components/Sidebar';
import TicketCounts from '../components/TicketCounts';
import TicketStatus from '../components/TicketStatus';
import Loading from '../components/Loading';

import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../context/UserContext'; 

function Dashboard() {
    const { user } = useUser(); 
    const [departmentData, setDepartmentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [statusData, setStatusData] = useState([0,0,0,0]); 
    const [priorityData, setPriorityData] = useState([0,0,0]); 
    
    useEffect(() => {
        document.title = 'adish HAP | Dashboard';
        
        const fetchTickets = async() => {
        try {
            const response = await axiosInstance.get('/tickets');
            const stats = response.data; 

            const statusArray = [0,0,0,0]; 
            stats.statusCounts.forEach(item => {
              statusArray[item.status_id - 1] = item.count; 
            }); 
            setStatusData(statusArray); 

            const priorityArray = [0,0,0]; 
            stats.priorityCounts.forEach(item => {
              priorityArray[item.priority_id - 1] = item.count; 
            }); 
            setPriorityData(priorityArray); 

            const userQuarters = [0,0,0,0];
            stats.userQuarterlyData.forEach (item => {
              userQuarters[item.quarter - 1] = item.count;
            });

            const comparisonQuarters = [0,0,0,0];
            stats.comparisonQuarterlyData.forEach (item => {
              comparisonQuarters[item.quarter - 1] = item.count;
            });

            const colorPattern = ['#9CA3AF','#E88504',];

            const chartData = [
              {
                name: "My Tickets",
                data: userQuarters,
                color: colorPattern[1], 
              },
              {
                name: `${user?.role === "admin" ? `${user?.department?.category} Tickets`  : 'All Tickets'}`,
                data: comparisonQuarters,
                color: colorPattern[0], 
              }
            ];

            setDepartmentData(chartData);
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

    console.log(priorityData);
    
  return (
    <div className="w-full flex flex-row bg-gray-50 min-h-screen">
       <div className="w-[4%]">
        <Sidebar/>
       </div>
            <div className="w-full p-5">
              {loading 
              ? <Loading /> 
              : 
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <TicketStatus
                      seriesData = {statusData} />
                  </div>
                  <div className="w-full flex flex-col gap-4 flex-1">
                    <PriorityLevel
                      seriesData = {priorityData} />
                    <TicketCounts 
                      seriesData={departmentData}/>
                  </div>
              </div>
              }
            </div>
    </div>
  )
}

export default Dashboard
