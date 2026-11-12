import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  User, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const CalendarBookingView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2026-11-16');
  const [activeTab, setActiveTab] = useState<'calendar' | 'pipeline'>('calendar');

  // Booked appointments matching Image 5
  const bookings = [
    {
      id: 'book-01',
      title: 'Villa Viewing & Architectural Review',
      property: 'Luxury Villa in F-7/2',
      client: 'Tariq Mehmood',
      time: '10:00 AM - 11:30 AM',
      date: '2026-11-16',
      status: 'Confirmed',
      agent: 'Sarah Ahmed',
      badgeColor: 'bg-emerald-500',
    },
    {
      id: 'book-02',
      title: 'Commercial Plaza Floor Walkthrough',
      property: 'Civic Boulevard Tower',
      client: 'Dr. Zainab Farooq',
      time: '02:00 PM - 03:00 PM',
      date: '2026-11-17',
      status: 'Pending Host',
      agent: 'Bilal Khan',
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'book-03',
      title: 'Penthouse Lease Agreement Signing',
      property: 'Executive Suite, Gulberg III',
      client: 'Usman Raza',
      time: '04:30 PM - 05:30 PM',
      date: '2026-11-18',
      status: 'Scheduled',
      agent: 'Ayesha Malik',
      badgeColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header matching Image 5: "Calendar Booking" */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Calendar Booking & Showing Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate agent tours, client showing requests, and deal appointments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'calendar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pipeline' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Workflow Tree
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>+ Schedule Tour</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Date Calendar on Left + Hourly Appointment Flow on Right matching Image 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Calendar Date Matrix */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">November 2026</h2>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-800 rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 text-slate-400 hover:text-slate-800 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <span key={d} className="font-bold text-slate-400 py-1">
                {d}
              </span>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isSelected = day === 16;
              const hasEvents = [16, 17, 18, 22].includes(day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(`2026-11-${day < 10 ? '0' + day : day}`)}
                  className={`py-2 rounded-xl font-semibold transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-1 left-1/2 -translate-x-1/2"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick AI Assistant Card matching Image 5 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart Showing Assistant</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              No overlapping slots found for Sarah Ahmed today. Optimal travel route between F-7/2 and Gulberg III calculated.
            </p>
          </div>
        </div>

        {/* Right Column: Scheduled Appointment Flow matching Image 5 */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Confirmed Showings & Site Inspections
              </h2>
              <p className="text-[11px] text-slate-400">Selected date: {selectedDate}</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              3 Confirmed Appointments
            </span>
          </div>

          {/* List of Scheduled Appointments */}
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${b.badgeColor}`}></span>
                    <span className="text-xs font-bold text-slate-900">{b.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {b.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      Client: {b.client}
                    </span>
                    <span className="text-blue-600 font-medium">
                      Agent: {b.agent}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer">
                    Reschedule
                  </button>
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer">
                    Start Tour
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

