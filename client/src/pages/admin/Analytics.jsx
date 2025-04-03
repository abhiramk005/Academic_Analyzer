import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Asidebar from "../sidebar/Asidebar";
import Header from "../Header/Header";
import "./Analytics.css";

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function Analytics() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter and sorting states
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [availableBatches, setAvailableBatches] = useState([]);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/analytics/students");
        const data =await response.json();
        setStudents(data);
        
        // Extract unique batches safely
        const batches = new Set();
        data.forEach(student => {
          if (student.id) {
            const batchMatch = student.id.match(/WYD(\d{2})/);
            if (batchMatch && batchMatch[1]) {
              batches.add(`20${batchMatch[1]}`);
            }
          }
        });
        setAvailableBatches(Array.from(batches).sort().reverse());
      } catch (err) {
        setError("Failed to fetch student data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Clear all filters
  const handleClearFilters = async () => {
    try {
      setLoading(true);
      setSelectedSemester("");
      setSelectedBatch("");
      setSearchQuery("");
      
      const response = await fetch("http://localhost:3001/api/analytics/students");
      const data =await response.json();
      setStudents(data);
      setError("");
    } catch (err) {
      setError("Failed to clear filters");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const handleFilterChange = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedSemester) params.append('semester', selectedSemester);
      if (selectedBatch) params.append('batch', selectedBatch);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(
        `http://localhost:3001/api/analytics/students/filter?${params.toString()}`
      );
      const data = await response.json();
      setStudents(data);
      
      setError("");
    } catch (err) {
      setError("Failed to apply filters");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filters
  const filteredStudents = students
    .filter((student) => {
      const batchMatch = student.id.match(/WYD(\d{2})/);
      const studentBatch = batchMatch ? `20${batchMatch[1]}` : "";
      
      return (
        (selectedSemester === "" || student.semester === selectedSemester) &&
        (selectedBatch === "" || studentBatch === selectedBatch) &&
        (searchQuery === "" || 
         (student.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
         (student.id || "").toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? (a.name || "").localeCompare(b.name || "") 
          : (b.name || "").localeCompare(a.name || "");
      } else if (sortBy === "semester") {
        const aSem = parseInt((a.semester || "S0").substring(1));
        const bSem = parseInt((b.semester || "S0").substring(1));
        return sortOrder === "asc" ? aSem - bSem : bSem - aSem;
      } else if (sortBy === "backlogs") {
        return sortOrder === "asc" ? (a.backlogs || 0) - (b.backlogs || 0) : (b.backlogs || 0) - (a.backlogs || 0);
      } else if (sortBy === "cgpa") {
        return sortOrder === "asc" ? (a.cgpa || 0) - (b.cgpa || 0) : (b.cgpa || 0) - (a.cgpa || 0);
      }
      return 0;
    });

  return (
    <div className="analytics-container">
      <Header />
      <Asidebar activeItem="analytics" />

      <div className="main-content">
        <h2>Student Academic Analytics</h2>
        
        {error && <div className="error-message">{error}</div>}

        {/* Filters Section */}
        <div className="filters">
          <div className="filter-group">
            <label>Semester</label>
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={loading}
            >
              <option value="">All Semesters</option>
              {[...Array(8)].map((_, i) => (
                <option key={i} value={`S${i + 1}`}>{`S${i + 1}`}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Batch</label>
            <select 
              value={selectedBatch} 
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={loading}
            >
              <option value="">All Batches</option>
              {availableBatches.map((batch) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </div>
          

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name or register number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="filter-buttons">
            <button 
              className="apply-filters"
              onClick={handleFilterChange}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
            <button 
              className="clear-filters"
              onClick={handleClearFilters}
              disabled={loading}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="student-table">
          {loading ? (
            <div className="loading">Loading student data...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Register No.</th>
                  <th>Student Name</th>
                  <th>Semester</th>
                  <th>Backlogs</th>
                  <th>CGPA</th>
                  <th>Batch</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => {
                    const batchMatch = student.id.match(/WYD(\d{2})/);
                    const batch = batchMatch ? batchMatch[1] : '';
                    
                    return (
                      <tr key={`${student.id}-${student.semester}-${index}`}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.semester}</td>
                        <td>{student.backlogs}</td>
                        <td>{student.cgpa}</td>
                        <td>{batch ? `20${batch}` : ''}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No students found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;