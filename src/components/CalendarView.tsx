"use client";
import { useState } from "react";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths 
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Wrench } from "lucide-react";

export default function CalendarView({ requests }: { requests: any[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 1. Calculate the grid
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 2. Navigation Handlers
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // 3. Filter requests for specific days
  const getRequestsForDay = (date: Date) => {
    return requests.filter(req => 
      req.scheduledDate && isSameDay(new Date(req.scheduledDate), date)
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Today</button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* The Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Days Header (Sun, Mon, Tue...) */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-sm font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((day, dayIdx) => {
            const dayRequests = getRequestsForDay(day);
            return (
              <div 
                key={day.toString()} 
                className={`border-b border-r border-slate-100 p-2 transition-colors hover:bg-slate-50
                  ${!isSameMonth(day, currentMonth) ? "bg-slate-50/50 text-slate-400" : "bg-white"}
                  ${isSameDay(day, new Date()) ? "bg-blue-50/30" : ""}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                   <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                     ${isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-slate-700"}
                   `}>
                     {format(day, "d")}
                   </span>
                </div>
                
                {/* Request Pills */}
                <div className="space-y-1 overflow-y-auto max-h-80px">
                  {dayRequests.map(req => (
                    <div 
                      key={req.id} 
                      className={`text-[10px] px-2 py-1 rounded border truncate font-medium flex items-center gap-1
                        ${req.type === 'Preventive' 
                          ? "bg-blue-50 text-blue-700 border-blue-100" 
                          : "bg-orange-50 text-orange-700 border-orange-100"}
                      `}
                      title={req.subject}
                    >
                      {req.type === 'Preventive' ? <Clock size={10} /> : <Wrench size={10} />}
                      {req.subject}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}