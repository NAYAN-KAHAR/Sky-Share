import textModel from '../../../Models/textModel.js';
import requestIp from 'request-ip';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';
import isPrivateIp from 'private-ip'; // <- NEW: for filtering local IPs

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const textPostController = async (req, res) => {
  try {
    const { ownerHash, textData } = req.body;
    const file = req.file;

    // 🔍 Check required fields
    if (!ownerHash || (!textData && !file)) {
      return res.status(400).json({ message: 'Missing content: need text or file' });
    }

    let ip = requestIp.getClientIp(req) || '';

    console.log('Raw IP:', ip);

    // Normalize IPv6-mapped IPv4
    if (ip.includes('::ffff:')) {
      ip = ip.split('::ffff:')[1];
    }

    // Remove port if any
    if (ip.includes(':')) {
      ip = ip.split(':')[0];
    }

    // Filter private/local IPs
    if (isPrivateIp(ip)) {
      ip = 'unknown';
    }

    let ipGroup = 'unknown';

    if (ip !== 'unknown' && ip && ip.split('.').length >= 3) {
      ipGroup = ip.split('.').slice(0, 3).join('.');
    }

    console.log('Final IP:', ip);
    console.log('IP Group:', ipGroup);



    let uploadedFile = null;

    // ✅ Upload file to Cloudinary
    if (file) {
      const filePath = file.path;
      const cloudRes = await cloudinary.v2.uploader.upload(filePath);
      fs.removeSync(filePath); // cleanup temp file

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
      await existing.save(); // Save updated document
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



