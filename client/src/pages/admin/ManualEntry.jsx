// src/components/upload/ManualEntry.jsx
import React, { useState } from "react";
import Header from "../Header/Header";
import Asidebar from "../sidebar/Asidebar";
import "./ManualEntry.css";

const ManualEntry = () => {
  const [studentData, setStudentData] = useState({
    registerNumber: "",
    name: "",
    department: "",
    batch: "",
    semester: "",
    subjects: [{ subjectCode: "", subjectName: "", grade: "" }],
  });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (index, e) => {
    const updatedSubjects = [...studentData.subjects];
    updatedSubjects[index][e.target.name] = e.target.value;
    setStudentData({ ...studentData, subjects: updatedSubjects });
  };

  const addSubject = () => {
    setStudentData({
      ...studentData,
      subjects: [...studentData.subjects, { subjectCode: "", subjectName: "", grade: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/admin/manual-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      const result = await res.json();
      alert(result.message);
    } catch (err) {
      alert("Upload failed!");
      console.error(err);
    }
  };

  return (
    <div className="manual-entry-container">
      <Header />
      <Asidebar activeItem="upload" />
      <div className="manual-entry-page">
        <h2>Manual Entry</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="registerNumber" placeholder="Register Number" onChange={handleChange} required />
          <input type="text" name="name" placeholder="Student Name" onChange={handleChange} required />
          <input type="text" name="department" placeholder="Department Code" onChange={handleChange} required />
          <input type="text" name="batch" placeholder="Batch Year" onChange={handleChange} required />
          <input type="text" name="semester" placeholder="Semester (e.g., Semester 5)" onChange={handleChange} required />

          <h4>Subjects</h4>
          {studentData.subjects.map((subject, idx) => (
            <div key={idx} className="subject-entry">
              <input
                type="text"
                name="subjectCode"
                placeholder="Subject Code"
                value={subject.subjectCode}
                onChange={(e) => handleSubjectChange(idx, e)}
                required
              />
              <input
                type="text"
                name="subjectName"
                placeholder="Subject Name"
                value={subject.subjectName}
                onChange={(e) => handleSubjectChange(idx, e)}
                required
              />
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => handleSubjectChange(idx, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addSubject}>Add Subject</button>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ManualEntry;
