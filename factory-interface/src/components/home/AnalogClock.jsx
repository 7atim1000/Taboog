import { useState, useEffect } from 'react';

const AnalogClock = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate clock hands angles
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  
  const secondStyle = {
    transform: `rotate(${seconds * 6}deg)`
  };
  const minuteStyle = {
    transform: `rotate(${minutes * 6}deg)`
  };
  const hourStyle = {
    transform: `rotate(${hours * 30 + minutes * 0.5}deg)`
  };

  return (
    <div className={`relative ${className}`}>
      {/* Clock Outer Ring */}
      <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-md border-2 border-blue-300">
        
        {/* Clock Face */}
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-b from-blue-50 to-white">
          
          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm">
            <div className="absolute inset-0 rounded-full bg-blue-400 blur-[0.5px]"></div>
          </div>

          {/* Main Hour Marks (12, 3, 6, 9) */}
          {[0, 3, 6, 9].map((i) => {
            const angle = i * 30;
            const rad = (angle * Math.PI) / 180;
            const radius = 38; // Percentage from center
            const x = 50 + radius * Math.sin(rad);
            const y = 50 - radius * Math.cos(rad);
            
            return (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full bg-blue-600"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}

          {/* Hour Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-1/4 bg-blue-800 origin-bottom transform -translate-x-1/2 -translate-y-full z-1 rounded-t-sm"
            style={hourStyle}
          />

          {/* Minute Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-px h-1/3 bg-blue-600 origin-bottom transform -translate-x-1/2 -translate-y-full z-2 rounded-t-sm"
            style={minuteStyle}
          />

          {/* Second Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-[0.5px] h-2/5 bg-blue-500 origin-bottom transform -translate-x-1/2 -translate-y-full z-3"
            style={secondStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;