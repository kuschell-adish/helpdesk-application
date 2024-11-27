import React from 'react'
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';

function TicketCounts({seriesData}) {
    const chartOptions = getBarChartOptions(seriesData);

    function getBarChartOptions(series) {
        return {
            series: series,
        chart: {
          sparkline: {
            enabled: false,
          },
          type: "bar",
          width: "100%",
          height: 400,
          toolbar: {
            show: false,
          }
        },
        fill: {
          opacity: 1,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: "100%",
            borderRadiusApplication: "end",
            borderRadius: 6,
            dataLabels: {
              position: "top",
            },
          },
        },
        legend: {
          show: true,
          position: "bottom",
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          shared: true,
          intersect: false,
          formatter: function (value) {
            return value
          }
        },
        xaxis: {
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: 'text-xs font-normal fill-gray-500'
            },
            formatter: function(value) {
              return value
            }
          },
          categories: ["Q1", "Q2", "Q3","Q4"],
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: 'text-xs font-normal fill-gray-500'
            }
          }
        },
        grid: {
          show: true,
          strokeDashArray: 4,
          padding: {
            left: 2,
            right: 2,
            top: -20
          },
        },
        fill: {
          opacity: 1,
        }
      }
    }

    const handleDownload = () => {
      html2canvas(document.getElementById('count')).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
  
          const a = document.createElement('a');
          a.href = imgData;
          a.download = 'ticket-count.png';
  
          document.body.appendChild(a);
          a.click();
  
          document.body.removeChild(a);
      })
  }; 

  return (
      <div className="w-full bg-white p-5 rounded-lg shadow mb-5">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center">
                    <p className="text-sm font-semibold">Filed Tickets</p>
                </div>
                <button onClick={handleDownload} className="flex justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </button>
            </div>
            <ReactApexChart id="count"
                options={chartOptions}
                series={chartOptions.series}
                type="bar"
                height={chartOptions.chart.height} 
            />
        </div>
  )
}

export default TicketCounts
