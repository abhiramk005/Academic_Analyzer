import React, { useEffect, useState } from "react";
import "./UploadHistory.css"; // Create a separate CSS file for styling

const UploadHistoryModal = ({ onClose }) => {
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/history"); // Adjust API route if needed
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setUploadHistory(data);
      } catch (error) {
        console.error("Error fetching upload history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload History</h2>
        <button className="close-btn" onClick={onClose}>✖</button>

        {loading ? (
          <p>Loading history...</p>
        ) : uploadHistory.length === 0 ? (
          <p>No upload history available</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Batch</th>
                <th>Semester</th>
                <th>Result Type</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.filename}</td>
                  <td>{entry.batch}</td>
                  <td>{entry.semester}</td>
                  <td>{entry.resultType}</td>
                  <td>{new Date(entry.uploadDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UploadHistoryModal;
