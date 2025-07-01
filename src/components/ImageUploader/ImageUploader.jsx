import React from 'react';
import useUploadImage from '@hooks/magic-hooks/useUploadImage';
import './ImageUploader.css';

const ImageUploader = () => {
  const {
    selectedFile,
    preview,
    uploading,
    uploadProgress,
    uploadedImage,
    imageUrl,
    error,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleUpload,
    handleReset,
    copyToClipboard
  } = useUploadImage();

  return (
    <div className="image-uploader">
      {/* Drop Zone */}
      <div 
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <p>Click to change image</p>
            </div>
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <p>Click to select an image or drag and drop</p>
            <p className="file-types">Supported: JPEG, PNG, GIF, WebP (max 5MB)</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
      />

      {/* File info */}
      {selectedFile && (
        <div className="file-info">
          <h3>Selected File:</h3>
          <p><strong>Name:</strong> {selectedFile.name}</p>
          <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Type:</strong> {selectedFile.type}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p>Uploading... {uploadProgress}%</p>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploading && (
        <div className="upload-button-container">
          <button 
            className="upload-button"
            onClick={handleUpload}
            disabled={uploading}
          >
            📤 Upload Image
          </button>
          <button 
            className="reset-button"
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        </div>
      )}

      {/* Upload Success */}
      {uploadedImage && (
        <div className="success-message">
          <p>✅ Image uploaded successfully!</p>
          {imageUrl && (
            <div className="url-container">
              <p><strong>Image URL:</strong></p>
              <div className="url-display">
                <input 
                  type="text" 
                  value={imageUrl} 
                  readOnly 
                  className="url-input"
                />
                <button 
                  className="copy-button"
                  onClick={() => copyToClipboard(imageUrl)}
                >
                  📋 Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ImageUploader;
