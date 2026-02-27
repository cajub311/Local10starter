"use client";

import { useState } from "react";

interface Announcement {
  id: number;
  title: string;
  body: string;
  date: string;
}

const sampleAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Monthly Meeting Reminder",
    body: "Our next general membership meeting is scheduled for the first Tuesday of next month at the union hall.",
    date: "2026-03-01",
  },
  {
    id: 2,
    title: "Safety Training Update",
    body: "New safety certification training sessions are now available. Sign up through the member portal.",
    date: "2026-02-25",
  },
  {
    id: 3,
    title: "Contract Negotiations",
    body: "The bargaining committee will provide updates on contract negotiations at the upcoming meeting.",
    date: "2026-02-20",
  },
];

export default function Home() {
  const [announcements] = useState<Announcement[]>(sampleAnnouncements);
  const [memberName, setMemberName] = useState("");
  const [greeting, setGreeting] = useState("");

  const handleCheckIn = () => {
    if (memberName.trim()) {
      setGreeting(`Welcome, ${memberName.trim()}! You are checked in.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <header className="bg-blue-950 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            Local 10 Starter
          </h1>
          <p className="text-blue-200 mt-1">United we stand</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Member Check-In
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheckIn()}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              aria-label="Member name"
            />
            <button
              onClick={handleCheckIn}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Check In
            </button>
          </div>
          {greeting && (
            <p className="mt-4 text-green-700 font-medium bg-green-50 p-3 rounded-lg">
              {greeting}
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Announcements
          </h2>
          <div className="space-y-4">
            {announcements.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-blue-900">
                    {item.title}
                  </h3>
                  <time className="text-sm text-gray-500">{item.date}</time>
                </div>
                <p className="text-gray-700">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-blue-950 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-blue-300">
          <p>&copy; 2026 Local 10 Starter &mdash; For union workers</p>
        </div>
      </footer>
    </div>
  );
}
