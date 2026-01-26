import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import cl from './ChartContent.module.css';
import { parseCSV } from '@/shared/utils/csvParser';
import { useEffect, useState } from 'react';

type Props = {
    isReport: boolean;
    file?: File;
    chartType?: 'bar' | 'line' | 'pie';
}

type ChartData = {
    headers: string[];
    data: Record<string, string>[];
}

export const ChartContent = ({ isReport, file, chartType = 'bar' }: Props) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setChartData(null);
      return;
    }
  
    const loadData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const text = await file.text();
        let parsedData: ChartData;
  
        if (
          file.name.endsWith('.json') ||
          text.trim().startsWith('{') ||
          text.trim().startsWith('[')
        ) {
          try {
            const json = JSON.parse(text);
            parsedData = convertJSONToChartData(json);
          } catch {
            throw new Error('Невірний формат JSON файлу');
          }
        } else {
          parsedData = parseCSV(text);
        }
  
        setChartData(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Невідома помилка');
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();

  }, [file]);

  // 1. BAR CHART
  const renderBarChart = () => {
    if (!chartData || chartData.data.length === 0) {
      return renderDefaultBarChart();
    }

    const { headers, data } = chartData;
    
    const numericHeaders = headers.filter((header, index) => {
      if (index === 0) return false;
      const sampleValue = data[0]?.[header];
      return !isNaN(parseFloat(sampleValue));
    });

    if (numericHeaders.length === 0) {
      return (
        <div className={cl.ErrorMessage}>
          Немає числових даних для графіка
        </div>
      );
    }

    const displayData = data.slice(0, 5);
    
    let maxValue = 0;
    numericHeaders.forEach(header => {
      displayData.forEach(row => {
        const value = parseFloat(row[header] || '0');
        if (value > maxValue) maxValue = value;
      });
    });
    
    if (maxValue === 0) maxValue = 100;

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
      <div className={cl.ChartWrapper}>
        <div className={cl.ChartContentArea}>
          <div className={cl.BarChartContainer}>
            {displayData.map((row, rowIndex) => {
              const categoryName = row[headers[0]] || `Кат. ${rowIndex + 1}`;
              
              return (
                <div key={rowIndex} className={cl.BarChartGroup}>
                  <div className={cl.BarChartCategory}>
                    {categoryName.length > 6 ? categoryName.substring(0, 6) + '...' : categoryName}
                  </div>
                  <div className={cl.BarChartBars}>
                    {numericHeaders.slice(0, 3).map((header, barIndex) => {
                      const value = parseFloat(row[header] || '0');
                      const height = maxValue > 0 ? (value / maxValue) * 80 : 0;
                      
                      return (
                        <div
                          key={`${rowIndex}-${barIndex}`}
                          className={cl.BarChartBar}
                          style={{
                            height: `${Math.max(height, 2)}%`,
                            backgroundColor: colors[barIndex % colors.length]
                          }}
                          title={`${header}: ${value}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className={cl.ChartLegend}>
          {numericHeaders.slice(0, 3).map((header, index) => (
            <div key={index} className={cl.LegendItem}>
              <div 
                className={cl.LegendColor}
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className={cl.LegendText}>
                {header.length > 8 ? header.substring(0, 8) + '...' : header}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 2. LINE CHART
  const renderLineChart = () => {
    if (!chartData || chartData.data.length === 0) {
      return renderDefaultLineChart();
    }

    const { headers, data } = chartData;
    
    const numericHeaders = headers.filter((header, index) => {
      if (index === 0) return false;
      const sampleValue = data[0]?.[header];
      return !isNaN(parseFloat(sampleValue));
    });

    if (numericHeaders.length === 0) {
      return (
        <div className={cl.ErrorMessage}>
          Немає числових даних для графіка
        </div>
      );
    }

    const displayData = data.slice(0, 5);
    const categories = displayData.map(row => row[headers[0]] || '');
    
    let maxValue = 0;
    numericHeaders.forEach(header => {
      displayData.forEach(row => {
        const value = parseFloat(row[header] || '0');
        if (value > maxValue) maxValue = value;
      });
    });
    
    if (maxValue === 0) maxValue = 100;

    const colors = ['#3b82f6', '#10b981', '#f59e0b'];

    return (
      <div className={cl.ChartWrapper}>
        <div className={cl.ChartContentArea}>
          <div className={cl.LineChartContainer}>
            <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
              {/* Горизонтальные линии сетки */}
              {[0, 20, 40, 60, 80, 100].map((percent, i) => (
                <line
                  key={`grid-h-${i}`}
                  x1="10"
                  y1={percent * 0.6}
                  x2="90"
                  y2={percent * 0.6}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Линии данных */}
              {numericHeaders.slice(0, 3).map((header, lineIndex) => {
                const points = displayData.map((row, i) => {
                  const value = parseFloat(row[header] || '0');
                  const x = 10 + (i * 20);
                  const y = 60 - (value / maxValue) * 60;
                  return { x, y };
                });

                const pathData = points.map((point, i) => 
                  `${i === 0 ? 'M' : 'L'}${point.x},${point.y}`
                ).join(' ');

                return (
                  <g key={lineIndex}>
                    <path
                      d={pathData}
                      stroke={colors[lineIndex]}
                      strokeWidth="1.5"
                      fill="none"
                      className={cl.LineChartPath}
                    />
                    {points.map((point, pointIndex) => (
                      <circle
                        key={pointIndex}
                        cx={point.x}
                        cy={point.y}
                        r="1.5"
                        fill={colors[lineIndex]}
                        stroke="white"
                        strokeWidth="1"
                        className={cl.LineChartPoint}
                      />
                    ))}
                  </g>
                );
              })}

              {/* Подписи категорий */}
              {categories.map((category, i) => (
                <text
                  key={i}
                  x={10 + (i * 20)}
                  y="58"
                  textAnchor="middle"
                  fontSize="3"
                  fill="#6b7280"
                  className={cl.LineChartLabel}
                >
                  {category.length > 4 ? category.substring(0, 4) + '...' : category}
                </text>
              ))}
            </svg>
          </div>
        </div>
        
        <div className={cl.ChartLegend}>
          {numericHeaders.slice(0, 3).map((header, index) => (
            <div key={index} className={cl.LegendItem}>
              <div 
                className={cl.LineLegendMarker}
                style={{ backgroundColor: colors[index] }}
              />
              <span className={cl.LegendText}>
                {header.length > 8 ? header.substring(0, 8) + '...' : header}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. PIE CHART
  const renderPieChart = () => {
    if (!chartData || chartData.data.length === 0) {
      return renderDefaultPieChart();
    }

    const { headers, data } = chartData;
    
    // Для pie chart обычно нужна одна числовая колонка
    const numericHeaders = headers.filter((header, index) => {
      if (index === 0) return false;
      const sampleValue = data[0]?.[header];
      return !isNaN(parseFloat(sampleValue));
    });

    if (numericHeaders.length === 0) {
      return (
        <div className={cl.ErrorMessage}>
          Немає числових даних для графіка
        </div>
      );
    }

    const valueHeader = numericHeaders[0];
    const displayData = data.slice(0, 5);
    
    const pieData = displayData.map((row, i) => ({
      label: row[headers[0]] || `Елемент ${i + 1}`,
      value: parseFloat(row[valueHeader] || '0'),
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]
    }));

    const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
    
    if (totalValue === 0) {
      return (
        <div className={cl.ErrorMessage}>
          Всі значення дорівнюють нулю
        </div>
      );
    }

    let currentAngle = 0;
    const pieSegments = pieData.map(item => {
      const percentage = (item.value / totalValue) * 100;
      const angle = (percentage / 100) * 360;
      const endAngle = currentAngle + angle;
      
      const startRad = (currentAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = 30 + 25 * Math.cos(startRad);
      const y1 = 30 + 25 * Math.sin(startRad);
      const x2 = 30 + 25 * Math.cos(endRad);
      const y2 = 30 + 25 * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M 30 30`,
        `L ${x1} ${y1}`,
        `A 25 25 0 ${largeArc} 1 ${x2} ${y2}`,
        `Z`
      ].join(' ');
      
      const segment = {
        path: pathData,
        color: item.color,
        label: item.label,
        percentage: percentage.toFixed(1),
        startAngle: currentAngle,
        endAngle
      };
      
      currentAngle = endAngle;
      return segment;
    });

    return (
      <div className={cl.ChartWrapper}>
        <div className={cl.PieChartContainer}>
          <div className={cl.PieChartSvg}>
            <svg className={cl.PieChartSvgItem} viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
              {pieSegments.map((segment, i) => (
                <path
                  key={i}
                  d={segment.path}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="1"
                  className={cl.PieSegment}
                />
              ))}
            </svg>
          </div>
          
          <div className={cl.PieChartLegend}>
            {pieSegments.map((segment, i) => (
              <div key={i} className={cl.PieLegendItem}>
                <div 
                  className={cl.PieLegendColor}
                  style={{ backgroundColor: segment.color }}
                />
                <div className={cl.PieLegendText}>
                  <span className={cl.PieLegendLabel}>
                    {segment.label.length > 8 ? segment.label.substring(0, 8) + '...' : segment.label}
                  </span>
                  <span className={cl.PieLegendValue}>
                    {segment.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Графики по умолчанию
  const renderDefaultBarChart = () => {
    return (
      <div className={cl.DefaultChart}>
        <div className={cl.DefaultBarChart}>
          {[60, 80, 40, 70, 90].map((height, i) => (
            <div key={i} className={cl.DefaultBarGroup}>
              <div className={cl.DefaultBar} style={{ height: `${height}%` }} />
              <div className={cl.DefaultBarLabel}>Cat {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDefaultLineChart = () => {
    return (
      <div className={cl.DefaultChart}>
        <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
          <path
            d="M10,50 L25,30 L40,40 L55,20 L70,35 L85,10"
            stroke="#3b82f6"
            strokeWidth="1.5"
            fill="none"
          />
          {[10, 25, 40, 55, 70, 85].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={i % 2 === 0 ? 50 - i * 8 : 30 + i * 5}
              r="1.5"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>
    );
  };

  const renderDefaultPieChart = () => {
    return (
      <div className={cl.DefaultChart}>
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
          <path d="M30,30 L30,5 A25,25 0 0,1 55,30 Z" fill="#3b82f6" />
          <path d="M30,30 L55,30 A25,25 0 0,1 15,45 Z" fill="#10b981" />
          <path d="M30,30 L15,45 A25,25 0 0,1 5,30 Z" fill="#f59e0b" />
          <path d="M30,30 L5,30 A25,25 0 0,1 30,5 Z" fill="#ef4444" />
        </svg>
      </div>
    );
  };

  const convertJSONToChartData = (jsonData: any): ChartData => {
    if (Array.isArray(jsonData)) {
      const headers = Object.keys(jsonData[0] || {});
      const data = jsonData.map(item => {
        const row: Record<string, string> = {};
        headers.forEach(header => {
          row[header] = String(item[header] || '');
        });
        return row;
      });
      return { headers, data };
    }
    
    return { headers: [], data: [] };
  };

  if (!isReport || !file) {
    const Icon = chartType === 'bar' ? BarChart3 : 
                 chartType === 'line' ? TrendingUp : PieChart;
    
    return (
      <div className={cl.PlaceholderIcon}>
        <Icon size={32} />
        {isReport && <div className={cl.ChartLabel}>[Завантажте дані]</div>}
        <div className={cl.ChartTypeLabel}>
          {chartType === 'bar' ? 'Стовпчаста' : 
           chartType === 'line' ? 'Лінійна' : 'Кругова'}
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return <div className={cl.UnsupportedChart}>Непідтримуваний тип графіка</div>;
    }
  };

  return (
    <div className={cl.ChartContainer}>      
      <div className={cl.ChartVisualization}>
        {loading ? (
          <div className={cl.LoadingMessage}>Завантаження...</div>
        ) : error ? (
          <div className={cl.ErrorMessage}>
            <div>{error}</div>
            <div className={cl.FallbackChart}>
              {chartType === 'bar' && renderDefaultBarChart()}
              {chartType === 'line' && renderDefaultLineChart()}
              {chartType === 'pie' && renderDefaultPieChart()}
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
};