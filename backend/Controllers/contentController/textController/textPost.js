import textModel from '../../../Models/textModel.js';
import requestIp from 'request-ip';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';

// cloudinary config
cloudinary.config({
  cloud_name: 'dx0qmwrrz',
  api_key: '849214223577591',
  api_secret: '_sIKa0UtNClm2FkdLztVkykr6XU'
});

const textPostController = async (req, res) => {
  try {
    const { ownerHash, textData } = req.body;
    const file = req.file;

    if (!ownerHash || (!textData && !file)) {
      return res.status(400).json({ message: 'Missing content: need text or file' });
    }

    const ip = requestIp.getClientIp(req) || 'unknown';
    const ipGroup = ip.split('.').slice(0, 3).join('.');

    let uploadedFile = null;

    // Upload to Cloudinary
    if (file) {
      const filePath = file.path;
      const cloudRes = await cloudinary.v2.uploader.upload(filePath);
      fs.removeSync(filePath);

      uploadedFile = {
        fileUrl: cloudRes.secure_url,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
      };
    }

    // 🔍 Check for existing record
    let existing = await textModel.findOne({ ipGroup, ownerHash });

    if (existing) {
      // Update fields only if provided
      if (textData) existing.text = textData;
      if (uploadedFile) {
        if (!existing.files) existing.files = [];
        existing.files.push(uploadedFile);
      }
      await existing.save(); // ✅ Important: always save!
    } else {
      // Create new document with available data
      await textModel.create({
        ipGroup,
        ownerHash,
        text: textData || '',
        files: uploadedFile ? [uploadedFile] : []
      });
    }

    return res.status(200).json({
      message: 'Content saved successfully',
      textSaved: !!textData,
      fileUploaded: !!uploadedFile,
      fileUrl: uploadedFile?.fileUrl || null
    });

  } catch (err) {
    console.error('POST error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export default textPostController;
