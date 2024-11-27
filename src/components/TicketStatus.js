import React from 'react';
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';

function TicketStatus({seriesData}) {
    const chartOptions = getRadialChartOptions(seriesData);

    const StatusBox = ({ color, count, label, width }) => (
        <div className={`w-${width} h-24 ${color} bg-opacity-80 rounded-lg text-sm font-medium text-center flex flex-col justify-center items-center`}>
            <p className="text-white text-4xl">{count}</p>
            <p>{label}</p>
        </div>
    );

    const allTicketCount = seriesData.reduce((total, count) => total + count, 0);

    const ticketsStatuses = [
        { color: 'bg-orange-500', count: allTicketCount, label: 'All Tickets', width: 'full' },
        { color: 'bg-yellow-500', count: seriesData[0], label: 'New', width: '24' },
        { color: 'bg-blue-500', count: seriesData[1], label: 'In Progress', width: '24' },
        { color: 'bg-green-500', count: seriesData[2], label: 'Resolved', width: '24' },
        { color: 'bg-red-500', count: seriesData[3], label: 'Closed', width: '24' }
    ];

    const [firstRow, secondRow, thirdRow] = [
        ticketsStatuses.slice(0,1),
        ticketsStatuses.slice(1,3),
        ticketsStatuses.slice(3)
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
                height: 380, 
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
                formatter: function(seriesName, opts) {
                  let value = seriesData[opts.seriesIndex];
                  if (isNaN(value)) {
                    value = 0;
                  }
                return `${seriesName}: ${((value/allTicketCount) * 100).toFixed(2)}%`;
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
        <div className="w-full h-[838px] bg-white p-5 rounded-lg shadow mb-5">
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
            <div className="flex flex-col gap-y-3 mt-5">
                <div className="flex flex-wrap gap-x-4">
                    {firstRow.map((status, index) => (
                        <StatusBox key={index} {...status} />
                    ))}
                </div>
                <div className="flex flex-wrap gap-x-4 ml-2">
                    {secondRow.map((status, index) => (
                            <StatusBox key={index} {...status} />
                    ))}
                </div>
                <div className="flex flex-wrap gap-x-4 ml-2">
                    {thirdRow.map((status, index) => (
                        <StatusBox key={index} {...status} />
                    ))}
                </div>
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
