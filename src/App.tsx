import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FallingHeart {
  id: number;
  x: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
}

function App() {
  // Date state
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  
  // Derived datetime state
  const [startDateTime, setStartDateTime] = useState<string>('');
  const [endDateTime, setEndDateTime] = useState<string>('');
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [showHearts, setShowHearts] = useState<boolean>(true);

  // Update combined datetime when date or time changes
  useEffect(() => {
    if (startDate && startTime) {
      setStartDateTime(`${startDate}T${startTime}`);
    }
    if (endDate && endTime) {
      setEndDateTime(`${endDate}T${endTime}`);
    }
  }, [startDate, startTime, endDate, endTime]);

  // Create falling hearts
  useEffect(() => {
    if (!showHearts) {
      setHearts([]);
      return;
    }

    const createHeart = () => {
      const newHeart: FallingHeart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100, // random horizontal position (0-100%)
        size: Math.random() * 20 + 10, // random size (10-30px)
        speed: Math.random() * 2 + 1, // random speed (1-3)
        opacity: Math.random() * 0.5 + 0.3, // random opacity (0.3-0.8)
        rotation: Math.random() * 360, // random rotation (0-360 degrees)
      };
      
      setHearts(prevHearts => [...prevHearts, newHeart]);
    };

    // Create a new heart every 300ms
    const heartInterval = setInterval(createHeart, 300);
    
    // Remove hearts that have fallen off screen - simplified to avoid DOM issues
    const cleanupInterval = setInterval(() => {
      setHearts(prevHearts => {
        // Keep only the most recent 100 hearts to prevent performance issues
        if (prevHearts.length > 100) {
          return prevHearts.slice(-100);
        }
        return prevHearts;
      });
    }, 2000);

    return () => {
      clearInterval(heartInterval);
      clearInterval(cleanupInterval);
    };
  }, [showHearts]);

  useEffect(() => {
    let timer: number;
    
    if (isCountingDown && startDateTime && endDateTime) {
      timer = window.setInterval(() => {
        const now = new Date();
        const end = new Date(endDateTime);
        
        // If we've passed the end date, stop the countdown
        if (now > end) {
          setIsCountingDown(false);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(timer);
          return;
        }
        
        const totalSeconds = Math.floor((end.getTime() - now.getTime()) / 1000);
        
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCountingDown, startDateTime, endDateTime]);

  const handleStartCountdown = () => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      
      if (start > end) {
        alert('A data de início não pode ser posterior à data final!');
        return;
      }
      
      setIsCountingDown(true);
    } else {
      alert('Por favor, selecione as datas e horários de início e fim!');
    }
  };

  const handleResetCountdown = () => {
    setIsCountingDown(false);
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setStartDateTime('');
    setEndDateTime('');
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  };

  const handleChangeBackground = () => {
    // Array of romantic background images from Unsplash
    const backgrounds = [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ];
    
    // Get a random background that's different from the current one
    let newBackground;
    do {
      newBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    } while (newBackground === backgroundImage && backgrounds.length > 1);
    
    setBackgroundImage(newBackground);
  };

  const toggleHearts = () => {
    setShowHearts(!showHearts);
  };

  // Generate time options for dropdown
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeValue = `${formattedHour}:${formattedMinute}`;
        const displayTime = `${formattedHour}:${formattedMinute}`;
        options.push(
          <option key={timeValue} value={timeValue}>
            {displayTime}
          </option>
        );
      }
    }
    return options;
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Falling Hearts */}
      {showHearts && hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            top: '-50px',
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.opacity,
            transform: `rotate(${heart.rotation}deg)`,
            animation: `fall ${5 / heart.speed}s linear forwards`,
            color: `rgba(255, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 150)}, ${heart.opacity})`,
            zIndex: 10
          }}
        >
          <Heart fill="currentColor" />
        </div>
      ))}

      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-md w-full z-20 relative">
        <div className="flex items-center justify-center mb-6">
          <Heart className="text-red-500 mr-2" style={{animation: 'pulse 1.5s infinite'}} size={28} />
          <h1 className="text-2xl font-bold text-center text-gray-800">Contagem Regressiva</h1>
          <Heart className="text-red-500 ml-2" style={{animation: 'pulse 1.5s infinite'}} size={28} />
        </div>
        
        <div className="mb-6">
          {/* Start Date and Time Selection */}
          <div className="mb-4 transition-all duration-300 hover:shadow-md p-3 rounded-lg bg-pink-50">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <Calendar className="mr-2 text-pink-500" size={18} />
              Data de Início:
            </label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center bg-white rounded-md border border-pink-200 overflow-hidden">
                <div className="bg-pink-100 p-2">
                  <Calendar className="text-pink-500" size={18} />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 py-2 px-3 text-gray-700 focus:outline-none"
                  disabled={isCountingDown}
                />
              </div>
              
              <div className="flex items-center bg-white rounded-md border border-pink-200 overflow-hidden">
                <div className="bg-pink-100 p-2">
                  <Clock className="text-pink-500" size={18} />
                </div>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 py-2 px-3 text-gray-700 focus:outline-none"
                  disabled={isCountingDown}
                >
                  <option value="">Selecione o horário</option>
                  {generateTimeOptions()}
                </select>
              </div>
            </div>
          </div>
          
          {/* End Date and Time Selection */}
          <div className="mb-4 transition-all duration-300 hover:shadow-md p-3 rounded-lg bg-purple-50">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <Calendar className="mr-2 text-purple-500" size={18} />
              Data de Encontro:
            </label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center bg-white rounded-md border border-purple-200 overflow-hidden">
                <div className="bg-purple-100 p-2">
                  <Calendar className="text-purple-500" size={18} />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 py-2 px-3 text-gray-700 focus:outline-none"
                  disabled={isCountingDown}
                />
              </div>
              
              <div className="flex items-center bg-white rounded-md border border-purple-200 overflow-hidden">
                <div className="bg-purple-100 p-2">
                  <Clock className="text-purple-500" size={18} />
                </div>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 py-2 px-3 text-gray-700 focus:outline-none"
                  disabled={isCountingDown}
                >
                  <option value="">Selecione o horário</option>
                  {generateTimeOptions()}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isCountingDown ? (
          <div className="mb-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Tempo até ver seus lindos olhos de Jade 😍:</h2>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-red-100 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-red-600">{timeLeft.days}</div>
                  <div className="text-xs text-gray-600">Dias</div>
                </div>
                <div className="bg-pink-100 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-pink-600">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-600">Horas</div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-purple-600">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-600">Minutos</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-blue-600">{timeLeft.seconds}</div>
                  <div className="text-xs text-gray-600">Segundos</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <p className="text-gray-600">Configure as datas e inicie a contagem regressiva para ver quanto tempo falta para encontrar o seu amor.</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          {!isCountingDown ? (
            <button
              onClick={handleStartCountdown}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Heart className="mr-2" style={{animation: 'pulse 1.5s infinite'}} size={18} />
              Iniciar Contagem
            </button>
          ) : (
            <button
              onClick={handleResetCountdown}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
            >
              Reiniciar
            </button>
          )}
          
          <button
            onClick={handleChangeBackground}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
          >
            Mudar Plano de Fundo
          </button>
          
          <button
            onClick={toggleHearts}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
          >
            {showHearts ? 'Parar Animação de Corações' : 'Iniciar Animação de Corações'}
          </button>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Feito com ❤️ para você meu anjo!</p>
        </div>
      </div>
    </div>
  );
}

export default App;