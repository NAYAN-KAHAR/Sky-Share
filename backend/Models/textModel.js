
import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({

  ipGroup: String, // optional grouping by IP
  ownerHash: {
    type: String,
    required: true,
  },
  // Store text if available
  text: String,
  files: [{
      fileUrl: String,       // Cloudinary URL
      filename: String,      // Original name of the file
      mimetype: String,      // e.g. 'image/png', 'application/pdf'
      size: Number,          // Size in bytes   
     }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const textModel = mongoose.model('Contents', contentSchema);

export default textModel;
