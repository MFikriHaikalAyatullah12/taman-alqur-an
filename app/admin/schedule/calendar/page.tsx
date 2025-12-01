'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function ScheduleCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events] = useState([
    { date: '2024-12-15', title: 'Ujian Kenaikan Iqra 2', type: 'exam' },
    { date: '2024-12-20', title: 'Peringatan Maulid Nabi', type: 'event' },
    { date: '2024-12-25', title: 'Wisuda Santri', type: 'graduation' },
    { date: '2024-12-30', title: 'Ujian Hafalan', type: 'exam' }
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <AdminLayout currentPage="/admin/schedule/calendar">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Kalender Akademik</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              ← Bulan Lalu
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              Bulan Depan →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-700 bg-gray-100">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                return (
                  <div key={index} className="min-h-[100px] p-2 border border-gray-200">
                    {day && (
                      <>
                        <div className="font-medium text-gray-900 mb-1">{day}</div>
                        <div className="space-y-1">
                          {dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex} className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate" title={event.title}>
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Legenda</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm text-gray-600">Kegiatan Umum</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm text-gray-600">Ujian</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                <span className="text-sm text-gray-600">Wisuda</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}