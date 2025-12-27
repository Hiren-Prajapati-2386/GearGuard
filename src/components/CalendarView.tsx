"use client";
import { useState } from "react";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths 
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Wrench, Calendar } from "lucide-react";

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
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Calendar className="text-blue-600" size={28} />
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth} 
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())} 
            className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            Today
          </button>
          <button 
            onClick={nextMonth} 
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* The Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Days Header (Sun, Mon, Tue...) */}
        <div className="grid grid-cols-7 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 auto-rows-[140px]">
          {calendarDays.map((day, dayIdx) => {
            const dayRequests = getRequestsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);
            return (
              <div 
                key={day.toString()} 
                className={`border-b border-r border-slate-100 p-3 transition-all hover:bg-slate-50/50
                  ${!isCurrentMonth ? "bg-slate-50/30 text-slate-400" : "bg-white"}
                  ${isToday ? "bg-blue-50/50 border-blue-200" : ""}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors
                     ${isToday ? "bg-blue-600 text-white shadow-lg" : "text-slate-700 hover:bg-slate-200"}
                   `}>
                     {format(day, "d")}
                   </span>
                   {dayRequests.length > 0 && (
                     <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                       {dayRequests.length}
                     </span>
                   )}
                </div>
                
                {/* Request Pills */}
                <div className="space-y-1.5 overflow-y-auto max-h-[100px]">
                  {dayRequests.slice(0, 3).map(req => (
                    <div 
                      key={req.id} 
                      className={`text-[11px] px-2 py-1.5 rounded-lg border truncate font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer
                        ${req.type === 'Preventive' 
                          ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-blue-200" 
                          : "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-800 border-orange-200 hover:from-orange-100 hover:to-orange-200"}
                      `}
                      title={req.subject}
                    >
                      {req.type === 'Preventive' ? <Clock size={12} /> : <Wrench size={12} />}
                      <span className="truncate">{req.subject}</span>
                    </div>
                  ))}
                  {dayRequests.length > 3 && (
                    <div className="text-[10px] text-slate-500 font-semibold text-center pt-1">
                      +{dayRequests.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}