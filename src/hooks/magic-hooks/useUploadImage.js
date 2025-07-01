import { useState, useRef } from 'react';
import { uploadImageToFirebaseStorage } from '@controllers/image-controller';

const useUploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Upload image to Firebase
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    uploadImageToFirebaseStorage(
      selectedFile,
      // Progress callback
      (progress) => {
        setUploadProgress(Math.round(progress));
      },
      // Success callback
      (result) => {
        setUploading(false);
        setUploadedImage(result);
        setImageUrl(result.downloadURL || result.url || '');
        setUploadProgress(100);
        console.log('Upload successful:', result);
        
        // Show success notification
        alert(`Image uploaded successfully!\nURL: ${result.downloadURL || result.url || 'No URL available'}`);
      },
      // Error callback
      (error) => {
        setUploading(false);
        setError(error.message);
        setUploadProgress(0);
        console.error('Upload error:', error);
      }
    );
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadedImage(null);
    setImageUrl('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return {
    // State values
    selectedFile,
    preview,
    uploading,
    uploadProgress,
    uploadedImage,
    imageUrl,
    error,
    fileInputRef,
    
    // Functions
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleUpload,
    handleReset,
    copyToClipboard
  };
};

export default useUploadImage;
