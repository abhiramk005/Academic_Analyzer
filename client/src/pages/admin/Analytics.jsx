import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Asidebar from "../sidebar/Asidebar"; // Sidebar component
import Header from "../Header/Header"; // Header component
import "./Analytics.css"; // CSS styles

function Analytics() {
  const navigate = useNavigate();

  // Dummy student data
  const [students] = useState([
    { id: 1, name: "John Doe", semester: "S1", backlogs: 2, cgpa: 8.5, subjects: ["Math", "Physics"] },
    { id: 2, name: "Jane Smith", semester: "S2", backlogs: 1, cgpa: 9.0, subjects: ["Chemistry", "Biology"] },
    { id: 3, name: "Alice Johnson", semester: "S3", backlogs: 0, cgpa: 9.5, subjects: ["Math", "Chemistry"] },
    { id: 4, name: "Bob Brown", semester: "S4", backlogs: 3, cgpa: 7.5, subjects: ["Physics", "Biology"] },
  ]);

  // Filter and sorting states
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // Default sorting by name
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order

  // Filtered and sorted student list
  const filteredStudents = students
    .filter((student) => (
      (selectedSemester === "" || student.semester === selectedSemester) &&
      (selectedSubject === "" || student.subjects.includes(selectedSubject)) &&
      (searchQuery === "" || student.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )) // ✅ Corrected `.filter()` closing bracket
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "semester") {
        return sortOrder === "asc"
          ? parseInt(a.semester.substring(1)) - parseInt(b.semester.substring(1))
          : parseInt(b.semester.substring(1)) - parseInt(a.semester.substring(1));
      } else if (sortBy === "backlogs") {
        return sortOrder === "asc" ? a.backlogs - b.backlogs : b.backlogs - a.backlogs;
      } else if (sortBy === "cgpa") {
        return sortOrder === "asc" ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
      }
      return 0;
    });

  return (
    <div className="analytics-container">
      <Header />
      <Asidebar activeItem="analytics" />

      <div className="main-content">
        <h2>Student Academic Analytics</h2>

        {/* Filters Section */}
        <div className="filters">
          <div className="filter-group">
            <label>Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value="">All Semesters</option>
              {[...Array(8)].map((_, i) => (
                <option key={i} value={`S${i + 1}`}>{`S${i + 1}`}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {["Math", "Physics", "Chemistry", "Biology"].map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Search Student</label>
            <input
              type="text"
              placeholder="Search by Register No."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sorting Section */}
        <div className="sorting">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="semester">Semester</option>
            <option value="backlogs">Backlogs</option>
            <option value="cgpa">CGPA</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "▲ Ascending" : "▼ Descending"}
          </button>
        </div>

        {/* Student Table */}
        <div className="student-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Semester</th>
                <th>Backlogs</th>
                <th>CGPA</th>
                <th>Subjects</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.semester}</td>
                    <td>{student.backlogs}</td>
                    <td>{student.cgpa}</td>
                    <td>{student.subjects.join(", ")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
