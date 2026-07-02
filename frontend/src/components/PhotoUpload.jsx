import { useState } from "react";
import api from "../services/api";

function PhotoUpload({ currentPhotoUrl, hasCustomPhoto, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a new image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", user._id); // Send User ID to backend

    try {
      setLoading(true);
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert("Photo updated successfully!");
      setFile(null); // Clear the file input
      
      if (onUploadSuccess) onUploadSuccess(); // Refresh the dashboard
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile photo?")) return;
    
    try {
      setDeleting(true);
      await api.delete(`/upload/photo/${user._id}`);
      
      alert("Photo deleted successfully!");
      if (onUploadSuccess) onUploadSuccess(); // Refresh the dashboard
    } catch (err) {
      console.error(err);
      alert("Failed to delete photo.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Show current photo and Edit/Delete options if they have one */}
      {hasCustomPhoto && (
        <div className="d-flex align-items-center mb-4 p-3 bg-light rounded border">
          <img 
            src={currentPhotoUrl} 
            alt="Current Profile" 
            className="rounded-circle border border-primary shadow-sm me-3 bg-white" 
            style={{ width: "65px", height: "65px", objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <h6 className="mb-0 fw-bold text-dark">Current Photo</h6>
            <small className="text-muted">Visible on your ID Card</small>
          </div>
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm fw-bold px-3" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : <><i className="bi bi-trash me-1"></i> Delete</>}
          </button>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleUpload}>
        <label className="form-label fw-bold small text-secondary">
          {hasCustomPhoto ? "Upload a Replacement Photo" : "Upload New Photo"}
        </label>
        <input 
          type="file" 
          className="form-control mb-3 shadow-none" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        
        <button 
          type="submit" 
          className="btn btn-primary w-100 fw-bold shadow-sm" 
          disabled={loading || !file}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span> Uploading...</>
          ) : (
             hasCustomPhoto ? "Save Replacement Photo" : "Upload Photo"
          )}
        </button>
      </form>
    </div>
  );
}

export default PhotoUpload;