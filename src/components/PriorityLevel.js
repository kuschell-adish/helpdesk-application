import React from 'react'
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';

function PriorityLevel({seriesData}) {
  const chartOptions = getDonutChartOptions(seriesData);  
  
  const allTicketCount = seriesData.reduce((total, count) => total + count, 0);

  function getDonutChartOptions(series) {
    return {
      series: series,
      colors: ["#FEBE82", "#FCA863", "#FB923C"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                 return ((value/allTicketCount) * 100).toFixed(2) + '%';
                },
              },
            },
            size: "70%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["Low Priority", "Medium Priority", "High Priority"],
      dataLabels: {
        enabled: false,
        dropShadow: {
          enabled: false,
        },
  
      },
      legend: {
        show: true,
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        formatter: function(seriesName, opts) {
          let value = seriesData[opts.seriesIndex] * 100;
          if (isNaN(value)) {
            value = 0;
          }
          return `${seriesName}: ${(value/allTicketCount).toFixed(2)}%`; 
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
           return ((value/allTicketCount) * 100).toFixed(2) + '%';
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
           return ((value/allTicketCount) * 100).toFixed(2) + '%';
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }
  }

  const handleDownload = () => {
    html2canvas(document.getElementById('priority')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const a = document.createElement('a');
        a.href = imgData;
        a.download = 'priority-level.png';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
    })
}; 
  return (
      <div className="w-full bg-white p-5 rounded-lg shadow">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center">
                    <p className="text-sm font-semibold">Priority Level</p>
                </div>
                <button onClick={handleDownload} className="flex justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </button>
            </div>
            <ReactApexChart id="priority"
                options={chartOptions}
                series={chartOptions.series}
                type="donut"
                height={chartOptions.chart.height} 
            />
        </div>
  )
}

export default PriorityLevel
