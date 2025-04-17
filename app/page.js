'use client';

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, CalendarDays, DollarSign } from "lucide-react";

function getMonthName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export default function WorkTracker() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const hourlyRate = 7;

  useEffect(() => {
    const saved = localStorage.getItem("work-entries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("work-entries", JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = () => {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (isNaN(start) || isNaN(end) || end <= start) return;

    const hoursWorked = (end - start) / (1000 * 60 * 60);
    const earned = hoursWorked * hourlyRate;

    const newEntry = { date, startTime, endTime, hoursWorked, earned };
    setEntries([...entries, newEntry]);

    setDate("");
    setStartTime("");
    setEndTime("");
  };

  const entriesByMonth = entries.reduce((acc, entry) => {
    const month = getMonthName(entry.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(entry);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-gradient-to-br from-sky-100 to-blue-200 rounded-xl shadow-xl">
      <div className="flex items-center gap-3">
        <Sparkles className="text-blue-600 w-8 h-8 animate-pulse" />
        <h1 className="text-3xl font-extrabold text-blue-800">Work Hours Tracker</h1>
      </div>

      <Card className="bg-white shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-700">Add Work Entry</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded-md shadow-sm" />

            <label className="text-sm text-gray-600">Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded-md shadow-sm" />

            <label className="text-sm text-gray-600">End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded-md shadow-sm" />

            <Button onClick={handleAddEntry} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-md">
              Add Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {Object.entries(entriesByMonth).map(([month, monthEntries], index) => {
        const totalHours = monthEntries.reduce((sum, e) => sum + e.hoursWorked, 0);
        const totalEarned = monthEntries.reduce((sum, e) => sum + e.earned, 0);

        return (
          <Card key={index} className="bg-white shadow-lg border-2 border-green-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-green-700">{month}</h2>
              <div className="flex flex-col gap-1 text-green-600">
                <p className="text-lg font-medium">Total Hours: {totalHours.toFixed(2)}</p>
                <p className="text-2xl font-bold">${totalEarned.toFixed(2)}</p>
              </div>

              <div className="space-y-2 mt-4">
                {monthEntries.map((entry, i) => (
                  <Card key={i} className="bg-gray-50 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between text-blue-900">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          <span>{entry.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{entry.startTime} - {entry.endTime}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Worked: {entry.hoursWorked.toFixed(2)} hrs | Earned: ${entry.earned.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
