import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Asidebar from "../sidebar/Asidebar";
import "./Upload.css";
import Header from "../Header/Header";
import PreviewModal from "./PreviewModal";
import { useNavigate } from "react-router-dom";
import UploadHistory from "./UploadHistory"; // Corrected import

function Upload() {
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [resultType, setResultType] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // State for modal
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
     },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setError("Invalid file type. Please upload a PDF.");
        return;
      }
      setFile(acceptedFiles[0]);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!semester || !batch || !resultType || !file) {
      setError("Please fill all fields and select a file.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("semester", semester);
      formData.append("batch", batch);
      formData.append("resultType", resultType);
      formData.append("file", file);

      let previewResponse;      
      if(resultType==="credit"){
        previewResponse = await fetch("http://localhost:3001/api/credit-preview",{
          method: "POST",
          body: formData,
        });
      }else{
      // Fetch Preview Data
        previewResponse = await fetch("http://localhost:3001/api/preview", {
          method: "POST",
          body: formData,
        });
     }

      if (!previewResponse.ok) throw new Error("Preview failed");
      
      const result = await previewResponse.json();
      setPreviewData(result);
      setShowPreview(true);
    } catch (error) {
      setError(error.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmUpload = async () => {
    try {
      let response;
      if(resultType==="credit"){
        setIsLoading(true);
      response = await fetch("http://localhost:3001/api/credit-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentsData: previewData.previewData,
          semester: previewData.semester,
          batch,
          resultType: previewData.resultType
        })
      });
      }
      else{
      setIsLoading(true);
      response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentsData: previewData.previewData,
          semester: previewData.semester,
          batch,
          resultType: previewData.resultType
        })
      });
    }

      if (!response.ok) throw new Error("Upload failed");
      
      const result = await response.json();
      console.log(result.message);
      setShowPreview(false);
      // Reset form
      setSemester("");
      setBatch("");
      setResultType("");
      setFile(null);
    } catch (error) {
      setError(error.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <Header />
      <Asidebar activeItem="upload" />

      <div className="upload-page">
        <h2>Upload Results</h2>
        <form onSubmit={handleSubmit}>
          {/* Semester Dropdown */}
          <div className="form-group">
            <label>Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              <option value="Semester 1">S1</option>
              <option value="Semester 2">S2</option>
              <option value="Semester 3">S3</option>
              <option value="Semester 4">S4</option>
              <option value="Semester 5">S5</option>
              <option value="Semester 6">S6</option>
              <option value="Semester 7">S7</option>
              <option value="Semester 8">S8</option>
            </select>
          </div>

          {/* Batch Dropdown */}
          <div className="form-group">
            <label>Batch</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
            >
              <option value="">Select Batch</option>
              <option value="2016">2016</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          {/* Result Type Dropdown */}
          <div className="form-group">
            <label>Result Type</label>
            <select
              value={resultType}
              onChange={(e) => setResultType(e.target.value)}
              required
            >
              <option value="">Select Result Type</option>
              <option value="regular">Regular</option>
              <option value="revaluation">Revaluation</option>
              <option value="credit">Credit Result</option>
            </select>
          </div>

          {/* Drag-and-Drop File Upload */}
          <div className="form-group">
            <label>
            Upload {resultType === "credit" ? "Excel File" : "PDF"}
            </label>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
             {file ? (
              <p>File selected: {file.name}</p>
              ) : (
                <p>
                Drag & drop a {resultType === "credit" ? "Excel (.xlsx/.xls)" : "PDF"} file here, or click to select one
                </p>
             )}
            </div>
          </div>


          {/* Error Message */}
          {error && <p className="error">{error}</p>}

          {/* Upload Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Upload"}
          </button>

          {/* Button to Open Upload History */}
           {/* ✅ Manual Entry Button */}
           
       
        </form>
        {/* <div className="manual-btn-div">
             <button 
          className="manual-entry-btn"
          onClick={() => navigate("/admin/manual-entry")}
        >
          Manual Entry
        </button>
           </div> */}

        {/* Upload History Modal */}
        {/* {showHistory && <UploadHistory onClose={() => setShowHistory(false)} />} */}

        {/* Preview Modal */}
        {showPreview && previewData && (
          <PreviewModal 
            data={previewData}
            onClose={() => setShowPreview(false)}
            onConfirm={handleConfirmUpload}
            isLoading={isLoading}
          />
        )}
        {/* <button 
          className="history-btn" 
          onClick={() => setShowHistory(true)}
        >
          View Upload History
        </button> */}
        
       
      </div>
      
    </div>
  );
}

export default Upload;
