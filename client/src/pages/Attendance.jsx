import React, { useState } from "react";

const dummyAttendance = [
  {
    student_id: "S001",
    name: "Alice Johnson",
    class: "CS101",
    date: "2025-12-14",
    status: "Present",
  },
  {
    student_id: "S002",
    name: "Bob Smith",
    class: "CS101",
    date: "2025-12-14",
    status: "Absent",
  },
  {
    student_id: "S003",
    name: "Charlie Brown",
    class: "CS102",
    date: "2025-12-14",
    status: "Present",
  },
  {
    student_id: "S004",
    name: "Diana Prince",
    class: "CS102",
    date: "2025-12-14",
    status: "Late",
  },
  {
    student_id: "S005",
    name: "Ethan Hunt",
    class: "CS101",
    date: "2025-12-14",
    status: "Present",
  },
];

const statusColor = {
  Present: "bg-success text-white",
  Absent: "bg-error text-white",
  Late: "bg-warning text-white",
};

const Attendance = () => {
  const [attendanceData] = useState(dummyAttendance);

  return (
    <div className="min-h-screen p-6 bg-light-background dark:bg-dark-background">
      <h1 className="text-3xl font-bold mb-6 text-light-textPrimary dark:text-dark-textPrimary">
        Attendance Dashboard
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-light-border dark:border-dark-border">
        <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
          <thead className="bg-light-surface dark:bg-dark-surface">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                Class
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-light-surfaceMuted dark:bg-dark-surfaceMuted divide-y divide-light-border dark:divide-dark-border">
            {attendanceData.map((att, idx) => (
              <tr
                key={idx}
                className="hover:bg-light-surface dark:hover:bg-dark-surface transition"
              >
                <td className="px-6 py-4 text-light-textPrimary dark:text-dark-textPrimary">
                  {att.student_id}
                </td>
                <td className="px-6 py-4 text-light-textPrimary dark:text-dark-textPrimary">
                  {att.name}
                </td>
                <td className="px-6 py-4 text-light-textPrimary dark:text-dark-textPrimary">
                  {att.class}
                </td>
                <td className="px-6 py-4 text-light-textPrimary dark:text-dark-textPrimary">
                  {att.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColor[att.status] ||
                      "bg-light-accent dark:bg-dark-accent"
                    }`}
                  >
                    {att.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional filter / search controls */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <label className="text-light-textSecondary dark:text-dark-textSecondary mr-2">
            Filter by Status:
          </label>
          <select className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search by name..."
            className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-textPrimary dark:text-dark-textPrimary placeholder-light-textMuted dark:placeholder-dark-textMuted focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
