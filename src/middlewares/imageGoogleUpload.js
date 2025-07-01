
import multer from 'multer';
import { firebaseApp } from '@config/firebaseConfig.js';

import { config } from '@config/firebaseConfig.js';
import { getStorage } from 'firebase/storage';

const storage = getStorage(firebaseApp);

// function: this function is used to filter the files that are uploaded
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory so that we can upload them to Firebase

  // storage: multer.diskStorage({ // Alternatively, you can store files on disk

  fileFilter: fileFilter, // Filter files
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
  }
});

/*
  Upload single:   upload.single('image')
  Upload multiple: upload.array('images', 10)
*/

export default upload;