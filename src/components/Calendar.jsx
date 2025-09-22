import React, { useState } from "react";
import dropdownIcon from "../assets/Calendar-icon/chevron-down.svg";

const formatDate = (date, format) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (format === "YYYY-MM-DD") {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (format === "MMMM YYYY") {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  if (format === "MMM") {
    return shortMonths[date.getMonth()];
  }
  return date.toString();
};

const startOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const daysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const subtractDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

const Calendar = ({ bookingDates = [], compact = true, onMonthChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    if (onMonthChange) onMonthChange(currentMonth);
  }, [currentMonth, onMonthChange]);

  const today = formatDate(new Date(), "YYYY-MM-DD");

  const startOfMonth = currentMonth.startOf("month");
  const startDay = (startOfMonth.day() + 6) % 7;
  const daysInMonth = currentMonth.daysInMonth();
  const days = [];

  // Add previous month's trailing days
  for (let i = 0; i < startDay; i++) {
    days.push({
      date: startOfMonth.subtract(startDay - i, "day"),
      isCurrentMonth: false,
    });
  }

  // Add current month's days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i
    );
    days.push({ date, isCurrentMonth: true });
  }

  // Add next month's leading days to fill the grid
  while (days.length < 42) {
    const lastDate = days[days.length - 1].date;
    days.push({
      date: addDays(lastDate, 1),
      isCurrentMonth: false,
    });
  }

  const handleDayClick = (day) => {
    setSelectedDate(formatDate(day, "YYYY-MM-DD"));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handlePreviousYear = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() - 1);
      return newDate;
    });
  };

  const handleNextYear = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    });
  };

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
    setCurrentMonth(newDate);
    setShowDropdown(false);
  };

  // compact sizing
  const daySizeClass = compact ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";
  const headerPadding = compact ? "mb-2" : "mb-3";

  return (
    <div className="p-2 sm:p-0 w-full">
      {/* Header */}
      <div className={`relative w-full ${headerPadding}`}>
        <div className="grid grid-cols-3 items-center">
          {/* Left: Previous */}
          <button
            type="button"
            onClick={handlePreviousMonth}
            aria-label="Previous month"
            className="px-2 py-1 text-sm hover:text-blue-600 justify-self-start"
          >
            ◀
          </button>

          {/* Middle: Month + Dropdown */}
          <div className="relative flex justify-center">
            <button
              type="button"
              onClick={() => setShowDropdown((s) => !s)}
              className="flex items-center space-x-2 font-semibold hover:text-blue-600"
            >
              <span className={compact ? "text-sm" : ""}>
                {formatDate(currentMonth, "MMMM YYYY")}
              </span>
              <img
                src={dropdownIcon}
                alt="toggle months"
                className={`w-4 h-4 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg w-48 z-50 p-2">
                {/* Year controls */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() =>
                      setCurrentMonth((m) => m.subtract(1, "year"))
                    }
                    className="px-2"
                  >
                    ◀
                  </button>
                  <span className="font-semibold">{currentMonth.year()}</span>
                  <button
                    onClick={() => setCurrentMonth((m) => m.add(1, "year"))}
                    className="px-2"
                  >
                    ▶
                  </button>
                </div>

                {/* Months */}
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const monthDate = new Date(
                      currentMonth.getFullYear(),
                      i,
                      1
                    );
                    const isThisMonth = i === currentMonth.getMonth();
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setCurrentMonth(month);
                          setShowDropdown(false);
                        }}
                        className={`px-2 py-1 rounded text-sm hover:bg-gray-100 ${
                          isThisMonth ? "bg-gray-100" : ""
                        }`}
                      >
                        {formatDate(monthDate, "MMM")}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Next */}
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="px-2 py-1 text-sm hover:text-blue-600 justify-self-end"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-xs gap-y-1 text-gray-500 mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {days.map((dayObj, i) => {
          const formatted = formatDate(dayObj.date, "YYYY-MM-DD");
          const isToday = formatted === today;
          const isSelected = formatted === selectedDate;
          const isBooked = bookingDates.includes(formatted);

          let cls = `mx-auto flex ${daySizeClass} items-center justify-center rounded-full cursor-pointer transition `;
          if (!dayObj.isCurrentMonth) cls += "text-gray-300 ";
          else if (isSelected) cls += "bg-blue-500 text-white ";
          else if (isToday) cls += "border border-blue-500 text-blue-500 ";
          else if (isBooked) cls += "bg-green-100 text-green-700 ";
          else cls += "text-gray-700 hover:bg-gray-100 ";

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleDayClick(dayObj.date)}
              className={cls}
              aria-pressed={isSelected}
            >
              {dayObj.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
