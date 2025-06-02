import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import './FraudChart.css'

Chart.register(...registerables)

const FraudChart = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    
    const ctx = chartRef.current.getContext('2d')
    
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 300)
    gradientFill.addColorStop(0, 'rgba(244, 67, 54, 0.3)')
    gradientFill.addColorStop(1, 'rgba(244, 67, 54, 0.0)')
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Fraud Rate (%)',
            data: [1.8, 2.1, 1.9, 2.3, 2.5, 2.8, 3.1, 2.9, 2.7, 2.5, 2.8, 2.7],
            borderColor: '#F44336',
            backgroundColor: gradientFill,
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Transactions (thousands)',
            data: [28, 32, 27, 30, 31, 34, 36, 38, 35, 33, 36, 35],
            borderColor: '#2D3277',
            tension: 0.4,
            borderDash: [5, 5],
            fill: false,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            titleFont: {
              size: 13,
              family: "'Inter', sans-serif",
              weight: 'medium'
            },
            bodyFont: {
              size: 12,
              family: "'Inter', sans-serif"
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11,
                family: "'Inter', sans-serif"
              },
              padding: 8,
              callback: function(value) {
                return value + '%'
              }
            }
          },
          y1: {
            position: 'right',
            beginAtZero: true,
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11,
                family: "'Inter', sans-serif"
              },
              padding: 8,
              color: '#2D3277'
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11,
                family: "'Inter', sans-serif"
              },
              padding: 8
            }
          }
        }
      }
    })
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="fraud-chart">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default FraudChart