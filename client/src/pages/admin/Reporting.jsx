import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Asidebar from "../sidebar/Asidebar";
import Header from "../Header/Header";
import "./Reporting.css";

function Reporting() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");

  const [departments, setDepartments] = useState([]);
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const batches = Array.from({ length: 16 }, (_, i) => (2015 + i).toString()); // 2015 - 2030

  // Fetch students data and filter options
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/reporting/students");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched students:", data);

        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        setStudents(data);

        // Extract unique departments safely
        const deptSet = new Set();
        data.forEach((student) => {
          if (student.department) deptSet.add(student.department);
        });

        setDepartments([...deptSet].sort());
      } catch (err) {
        setError("Failed to fetch student data");
        console.error(err);
        setStudents([]); // Ensure UI doesn't crash
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Apply all filters
  const handleFilterChange = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedFilter !== "all") params.append("status", selectedFilter);
      if (selectedDepartment !== "all") params.append("department", selectedDepartment);
      if (selectedSemester !== "all") params.append("semester", selectedSemester);
      if (selectedBatch !== "all") params.append("batch", selectedBatch);

      const response = await fetch(
        `http://localhost:3001/api/reporting/students/filter?${params.toString()}`
      );
      const data = await response.json();
      console.log("Filtered data:", data); 

      setStudents(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError("Failed to apply filters");
      console.error(err);
      setStudents([]); // Prevent crashes
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const handleClearFilter = async () => {
    try {
      setLoading(true);
      setSelectedFilter("all");
      setSelectedDepartment("all");
      setSelectedSemester("all");
      setSelectedBatch("all");

      const response = await fetch("http://localhost:3001/api/reporting/students");
      const data = await response.json();

      setStudents(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError("Failed to clear filters");
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reporting-container">
      <Header />
      <Asidebar activeItem="reporting" />

      <div className="main-content">
        <h2>Student Academic Reporting</h2>

        {error && <div className="error-message">{error}</div>}

        {/* Filters Section */}
        <div className="filters">
          <div className="filter-group">
            <label>Status</label>
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} disabled={loading}>
              <option value="all">All Statuses</option>
              <option value="wob_success">WOB Success</option>
              <option value="wb_success">WB Success</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} disabled={loading}>
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} disabled={loading}>
              <option value="all">All Semesters</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Batch</label>
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} disabled={loading}>
              <option value="all">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-buttons">
            <button className="apply-filter" onClick={handleFilterChange} disabled={loading}>
              {loading ? "Loading..." : "Apply Filters"}
            </button>
            <button className="clear-filter" onClick={handleClearFilter} disabled={loading}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="student-table">
          {loading ? (
            <div className="loading">Loading student data...</div>
          ) : (
            <>
              {/* Display record count */}
              <div className="record-count">
                <strong>Total Records: {students.length}</strong>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Register No.</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <tr key={`${student.id}-${index}`}>
                        <td>{student.register_number || "N/A"}</td>
                        <td>{student.name}</td>
                        <td>{student.department}</td>
                        <td>{student.batch || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-results">
                        No students found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reporting;
