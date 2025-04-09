import React, { useState } from "react";
import "./PreviewModal.css"; // Using the same CSS file

const CreditPreview = ({ data, onClose, onConfirm, isLoading }) => {
  const [editableData, setEditableData] = useState([...data.previewData]);
  const [isEditing, setIsEditing] = useState(false);

  // Calculate record counts
  const totalRecords = editableData.length;
  const regularRecords = editableData.filter(s => s.isRegularStudent).length;
  const supplementaryRecords = totalRecords - regularRecords;

  const handleCreditChange = (studentIndex, newCredits) => {
    const updatedData = [...editableData];
    updatedData[studentIndex].cumulativeCredits = parseFloat(newCredits) || 0;
    setEditableData(updatedData);
  };

  const handleConfirm = () => {
    onConfirm({
      ...data,
      previewData: editableData
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Credit Results Preview</h3>
          <div className="record-stats">
            <div className="stat-item">
              <span className="stat-label">Semester:</span>
              <span className="stat-value">{data.semester}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Type:</span>
              <span className="stat-value">Credit</span>
            </div>
            <div className="stat-item highlight">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{totalRecords}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Regular:</span>
              <span className="stat-value">{regularRecords}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Supplementary:</span>
              <span className="stat-value">{supplementaryRecords}</span>
            </div>
          </div>
          <button 
            className="edit-toggle-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Lock Editing" : "Enable Editing"}
          </button>
        </div>
        
        <div className="preview-table-container">
          <table className="preview-table">
            <thead>
              <tr>
                <th>Register No.</th>
                <th>Batch</th>
                <th>Type</th>
                <th>Cumulative Credits</th>
              </tr>
            </thead>
            <tbody>
              {editableData.map((student, studentIndex) => (
                <tr key={studentIndex}>
                  <td>{student.register_number}</td>
                  <td>{student.batch}</td>
                  <td>{student.isRegularStudent ? "Regular" : "Supplementary"}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={student.cumulativeCredits}
                        onChange={(e) => handleCreditChange(studentIndex, e.target.value)}
                        className="grade-input credit-input"
                        style={{ width: '80px' }}
                      />
                    ) : (
                      student.cumulativeCredits
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button 
            className="confirm-btn" 
            onClick={handleConfirm} 
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Confirm & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditPreview;