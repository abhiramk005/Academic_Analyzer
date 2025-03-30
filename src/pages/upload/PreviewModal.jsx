import React, { useState } from "react";
import "./PreviewModal.css";

const PreviewModal = ({ data, onClose, onConfirm, isLoading }) => {
  const [editableData, setEditableData] = useState([...data.previewData]);
  const [isEditing, setIsEditing] = useState(false);

  // Get all unique subject codes
  const allSubjectCodes = Array.from(
    new Set(
      editableData.flatMap(student => 
        student.subjects.map(subject => subject.code)
      )
    )
  ).sort();

  // Calculate record counts
  const totalRecords = editableData.length;
  const regularRecords = editableData.filter(s => s.isRegularStudent).length;
  const supplementaryRecords = totalRecords - regularRecords;

  const handleGradeChange = (studentIndex, subjectCode, newGrade) => {
    const updatedData = [...editableData];
    const student = updatedData[studentIndex];
    
    // Find or create the subject
    let subject = student.subjects.find(s => s.code === subjectCode);
    if (!subject) {
      subject = { code: subjectCode, grade: "" };
      student.subjects.push(subject);
    }
    
    subject.grade = newGrade;
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
          <h3>Results Preview</h3>
          <div className="record-stats">
            <div className="stat-item">
              <span className="stat-label">Semester:</span>
              <span className="stat-value">{data.semester}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Type:</span>
              <span className="stat-value">{data.resultType}</span>
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
                {allSubjectCodes.map((code, index) => (
                  <th key={index}>{code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editableData.map((student, studentIndex) => {
                const gradeMap = {};
                student.subjects.forEach(subject => {
                  gradeMap[subject.code] = subject.grade;
                });

                return (
                  <tr key={studentIndex}>
                    <td>{student.register_number}</td>
                    <td>{student.batch}</td>
                    <td>{student.isRegularStudent ? "Regular" : "Supplementary"}</td>
                    {allSubjectCodes.map((code, idx) => (
                      <td key={idx}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={gradeMap[code] || ""}
                            onChange={(e) => handleGradeChange(studentIndex, code, e.target.value)}
                            className="grade-input"
                            maxLength="2"
                          />
                        ) : (
                          gradeMap[code] || "-"
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
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

export default PreviewModal;