import { BarChart3 } from 'lucide-react';
import cl from './ChartContent.module.css';
import { parseCSV } from '@/shared/utils/csvParser';
import { useEffect, useState } from 'react';

type Props = {
    isReport: boolean;
    url?: string;
    chartType?: 'bar' | 'line' | 'pie';
    title?: string;
}

type ChartData = {
    headers: string[];
    data: Record<string, string>[];
}

export const ChartContent = ({ isReport, url, chartType = 'bar', title = 'Діаграма' }: Props) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setChartData(null);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const fileContent = await response.text();
        let parsedData: ChartData;
        
        if (url.endsWith('.json') || fileContent.trim().startsWith('{') || fileContent.trim().startsWith('[')) {
          try {
            const jsonData = JSON.parse(fileContent);
            parsedData = convertJSONToChartData(jsonData);
          } catch (e) {
            throw new Error('Невірний формат JSON файлу');
          }
        } else {
          parsedData = parseCSV(fileContent);
        }
        
        console.log('Parsed chart data:', parsedData);
        setChartData(parsedData);
      } catch (err) {
        console.error('Помилка завантаження даних графіка:', err);
        setError(err instanceof Error ? err.message : 'Невідома помилка');
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [url]);

  const renderBarChart = () => {
    console.log('actual');

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

    // Берем первые 5 строк
    const displayData = data.slice(0, 5);
    
    let maxValue = 0;
    numericHeaders.forEach(header => {
      displayData.forEach(row => {
        const value = parseFloat(row[header] || '0');
        if (value > maxValue) maxValue = value;
      });
    });
    
    if (maxValue === 0) maxValue = 100;

    console.log('Bar chart rendering:', {
      headers,
      numericHeaders,
      displayDataCount: displayData.length,
      maxValue,
      sampleRow: displayData[0]
    });

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
      <div className={cl.SimpleBarChart}>
        <div className={cl.ChartBars}>
          {displayData.map((row, rowIndex) => {
            const categoryName = row[headers[0]] || `Категорія ${rowIndex + 1}`;
            
            return (
              <div key={rowIndex} className={cl.ChartBarGroup}>
                <div className={cl.BarGroupLabel}>
                  {categoryName.length > 10 ? categoryName.substring(0, 10) + '...' : categoryName}
                </div>
                <div className={cl.BarGroupBars}>
                  {numericHeaders.slice(0, 3).map((header, barIndex) => {
                    const value = parseFloat(row[header] || '0');
                    const height = (value / maxValue) * 100;
                    
                    return (
                      <div
                        key={`${rowIndex}-${barIndex}`}
                        className={cl.SingleBar}
                        style={{
                          height: `${Math.max(height, 2)}%`, 
                          backgroundColor: colors[barIndex % colors.length],
                          width: `${80 / numericHeaders.length}%`
                        }}
                        title={`${header}: ${value}`}
                      >
                        {height > 10 && (
                          <span className={cl.BarValue}>
                            {value.toFixed(0)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={cl.ChartLegend}>
          {numericHeaders.slice(0, 3).map((header, index) => (
            <div key={index} className={cl.LegendItem}>
              <div 
                className={cl.LegendColor}
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className={cl.LegendText}>
                {header.length > 10 ? header.substring(0, 10) + '...' : header}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDefaultBarChart = () => {
    console.log('default');

    return (
      <div className={cl.DefaultBarChart}>
        <div className={cl.DefaultBars}>
          {['Marketing', 'Sales', 'IT', 'HR', 'Finance'].map((label, i) => (
            <div key={i} className={cl.DefaultBarGroup}>
              <div className={cl.DefaultBarLabel}>{label}</div>
              <div className={cl.DefaultBarRow}>
                <div 
                  className={cl.DefaultBar} 
                  style={{ 
                    height: `${60 + i * 10}%`,
                    backgroundColor: '#3b82f6'
                  }} 
                />
                <div 
                  className={cl.DefaultBar} 
                  style={{ 
                    height: `${40 + i * 8}%`,
                    backgroundColor: '#10b981'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
        <div className={cl.DefaultLegend}>
          <div className={cl.DefaultLegendItem}>
            <div className={cl.DefaultLegendColor} style={{ backgroundColor: '#3b82f6' }} />
            <span>Значення</span>
          </div>
          <div className={cl.DefaultLegendItem}>
            <div className={cl.DefaultLegendColor} style={{ backgroundColor: '#10b981' }} />
            <span>Ціль</span>
          </div>
        </div>
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

  if (!isReport || !url) {
    return (
      <div className={cl.PlaceholderIcon}>
        <BarChart3 size={32} />
        {isReport && <div className={cl.ChartLabel}>[Завантажте дані]</div>}
      </div>
    );
  }

  return (
    <div className={cl.ChartContainer}>      
      <div className={cl.ChartVisualization}>
        {loading ? (
          <div className={cl.LoadingMessage}>Завантаження...</div>
        ) : error ? (
          <div className={cl.ErrorMessage}>
            <div>{error}</div>
            <div className={cl.FallbackChart}>
              {renderDefaultBarChart()}
            </div>
          </div>
        ) : chartType === 'bar' ? (
          renderBarChart()
        ) : (
          <div className={cl.UnsupportedChart}>
            Тип графіка {chartType} ще не підтримується
          </div>
        )}
      </div>
    </div>
  );
};

