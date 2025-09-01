import React from 'react';
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';

function TicketStatus({seriesData}) {
    const chartOptions = getRadialChartOptions(seriesData);

    const StatusBox = ({ color, count, label }) => (
        <div className={`w-full ${color} bg-opacity-80 rounded-lg text-sm font-medium text-center flex flex-col justify-center items-center `}>
            <p className="text-white text-2xl font-medium">{count}</p>
            <p className="text-xs">{label}</p>
        </div>
    );

    const allTicketCount = seriesData.reduce((total, count) => total + count, 0);

    const ticketsStatuses = [
        { color: 'bg-orange-500', count: allTicketCount, label: 'All Tickets' },
        { color: 'bg-yellow-500', count: seriesData[0], label: 'New' },
        { color: 'bg-blue-500', count: seriesData[1], label: 'In Progress' },
        { color: 'bg-green-500', count: seriesData[2], label: 'Resolved' },
        { color: 'bg-red-500', count: seriesData[3], label: 'Closed' }
    ];

    function getRadialChartOptions(series) {
        return {
            series: series,
            colors: [
                "#FACC15",
                "#3B82F6",
                "#22C55E",
                "#EF4444"
            ],
            chart: {
                height: 400, 
                width: "100%",
                type: "radialBar",
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    track: {
                        background: '#E5E7EB',
                    },
                    dataLabels: {
                        show: false,
                    },
                    hollow: {
                        margin: 0,
                        size: "10%",
                    }
                },
            },
            labels: ["New", "In Progress", "Resolved", "Closed"],
            legend: {
                show: true,
                position: "bottom",
                fontFamily: "Inter, sans-serif",
                formatter: function (seriesName, opts) {
                    const value = seriesData[opts.seriesIndex] || 0;
                    const percentage = allTicketCount > 0
                      ? ((value / allTicketCount) * 100).toFixed(2)
                      : '0.00';
                  
                    return `${seriesName}: ${percentage}%`;
                  }
              },
            tooltip: {
                enabled: true,
                x: {
                    show: false,
                },
            },
            yaxis: {
                show: false,
                labels: {
                    formatter: function (value) {
                        return ((value/allTicketCount) * 100).toFixed(2) + '%';
                    }
                }
            }
        }
    }

    const handleDownload = () => {
        html2canvas(document.getElementById('status')).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            const a = document.createElement('a');
            a.href = imgData;
            a.download = 'ticket-status.png';

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
        })
    }; 

    return (
        <div className="w-full h-screen bg-white p-4 rounded-lg shadow mb-5">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center">
                    <p className="text-sm font-semibold">Tickets Statuses</p>
                </div>
                <button onClick={handleDownload} className="flex justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                {ticketsStatuses.map((status, index) => (
                    <StatusBox key={index} {...status} />
                ))}
            </div>
            <ReactApexChart id="status" 
                options={chartOptions}
                series={chartOptions.series}
                type="radialBar"
                height={chartOptions.chart.height} 
            />
        </div>
    );
}

export default TicketStatus;
