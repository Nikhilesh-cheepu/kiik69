import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const Calendar = ({ isOpen, onClose, onDateSelect, selectedDate, minDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateState, setSelectedDateState] = useState(selectedDate ? new Date(selectedDate) : null);

  useEffect(() => {
    if (selectedDate) {
      setSelectedDateState(new Date(selectedDate));
    }
  }, [selectedDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date) => {
    if (!minDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!selectedDateState) return false;
    return date.toDateString() === selectedDateState.toDateString();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;
    setSelectedDateState(date);
    onDateSelect(date.toISOString().split('T')[0]);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty" />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isDisabled = isDateDisabled(date);
      const isSelected = isDateSelected(date);
      const isTodayDate = isToday(date);

      days.push(
        <motion.div
          key={day}
          className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isTodayDate ? 'today' : ''}`}
          onClick={() => handleDateClick(date)}
          whileHover={!isDisabled ? { scale: 1.1 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          style={{
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.3 : 1
          }}
        >
          {day}
        </motion.div>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="calendar-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="calendar-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Calendar Header */}
          <div className="calendar-header">
            <div className="calendar-title">
              <h3>Select Date</h3>
              <button className="close-button" onClick={onClose}>
                <FaTimes />
              </button>
            </div>
            
            {/* Month Navigation */}
            <div className="calendar-navigation">
              <button 
                className="nav-button"
                onClick={() => navigateMonth('prev')}
              >
                <FaChevronLeft />
              </button>
              
              <h2 className="month-year">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button 
                className="nav-button"
                onClick={() => navigateMonth('next')}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Calendar Body */}
          <div className="calendar-body">
            {/* Day Headers */}
            <div className="calendar-days-header">
              {dayNames.map(day => (
                <div key={day} className="day-header">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Calendar Footer */}
          <div className="calendar-footer">
            <div className="selected-date-info">
              {selectedDateState && (
                <p>
                  Selected: {selectedDateState.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
            <div className="calendar-actions">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={() => {
                  if (selectedDateState) {
                    onDateSelect(selectedDateState.toISOString().split('T')[0]);
                    onClose();
                  }
                }}
                disabled={!selectedDateState}
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Calendar;
