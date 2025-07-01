
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@config/firebase-config';

// Upload image to Firebase Storage
export const uploadImageToFirebaseStorage = (file, onProgress, onComplete, onError) => {
  console.log('🔄 Starting upload process...');
  console.log('File details:', {
    name: file.name,
    size: file.size,
    type: file.type
  });
  console.log('Storage configuration:', {
    bucket: storage.app.options.storageBucket,
    projectId: storage.app.options.projectId
  });

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    const error = new Error('Invalid file type. Please upload an image file (JPEG, PNG, GIF, WebP)');
    console.error('❌ Validation error:', error.message);
    onError(error);
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    const error = new Error('File size too large. Please upload an image smaller than 5MB');
    console.error('❌ Size error:', error.message);
    onError(error);
    return;
  }

  // Create unique filename with timestamp
  const timestamp = Date.now();
  const fileName = `images/${timestamp}-${file.name}`;
  
  console.log('📁 Upload path:', fileName);

  // Create storage reference
  const storageRef = ref(storage, fileName);
  console.log('📍 Storage reference created:', {
    fullPath: storageRef.fullPath,
    bucket: storageRef.bucket,
    name: storageRef.name
  });
  
  // Upload file with progress tracking
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  console.log('🚀 Starting upload task...');

  // Monitor upload progress
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Calculate progress percentage
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('📊 Upload progress:', {
        progress: Math.round(progress),
        bytesTransferred: snapshot.bytesTransferred,
        totalBytes: snapshot.totalBytes,
        state: snapshot.state
      });
      onProgress(progress);
    },
    (error) => {
      // Handle upload errors
      console.error('❌ Upload error:', {
        code: error.code,
        message: error.message,
        serverResponse: error.serverResponse,
        customData: error.customData
      });
      
      // Provide more specific error messages
      let userMessage = error.message;
      if (error.code === 'storage/unauthorized') {
        userMessage = 'Upload failed: Storage access denied. Please check Firebase Storage rules.';
      } else if (error.code === 'storage/network-error') {
        userMessage = 'Upload failed: Network error. Please check your internet connection.';
      } else if (error.code === 'storage/unknown') {
        userMessage = 'Upload failed: Unknown error. Please try again or check Firebase configuration.';
      }
      
      onError(new Error(userMessage));
    },
    () => {
      // Upload completed successfully, get download URL
      console.log('✅ Upload completed! Getting download URL...');
      
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          console.log('🔗 Download URL obtained:', downloadURL);
          
          const result = {
            downloadURL,
            fileName,
            originalName: file.name,
            size: file.size,
            type: file.type
          };
          
          console.log('📋 Upload result:', result);
          onComplete(result);
        })
        .catch((urlError) => {
          console.error('❌ Error getting download URL:', urlError);
          onError(new Error('Upload completed but failed to get download URL: ' + urlError.message));
        });
    }
  );
  
  return uploadTask; // Return the upload task for potential cancellation
};