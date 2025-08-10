
const mongoose = require('mongoose');

const mediaFileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  fileType: {
    type: String, // 'image', 'pdf', 'docx', etc.
    required: true
  },
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MediaFile', mediaFileSchema);




const mongoose = require('mongoose');

const sharePostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  textRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TextContent'
  },
  mediaFiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaFile'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SharePost', sharePostSchema);




const TextContent = require('./models/TextContent');
const MediaFile = require('./models/MediaFile');
const SharePost = require('./models/SharePost');

async function createSharePost(req, res) {
  const { userId, text } = req.body;
  const files = req.files; // Assume you've handled file uploads via multer or cloud upload

  // Save text
  const textDoc = await TextContent.create({ content: text });

  // Save files
  const mediaDocs = await Promise.all(files.map(file => {
    return MediaFile.create({
      url: file.path, // or S3/cloud URL
      fileType: file.mimetype,
      filename: file.originalname
    });
  }));

  // Save post linking them together
  const post = await SharePost.create({
    userId,
    textRef: textDoc._id,
    mediaFiles: mediaDocs.map(doc => doc._id)
  });

  res.status(201).json({ post });
}





const post = await SharePost.findById(postId)
  .populate('textRef')
  .populate('mediaFiles')
  .exec();

res.json(post);


/*
💡 What You Can Do in Your Project
If you want the same behavior, here’s what to do:

✅ Generate a sharable URL:
When you generate the ownerHash, display a QR or URL:

const link = `http://localhost:3000/share/${ownerHash}`;
✅ When a user visits that URL:
Extract ownerHash from URL

Store it in a cookie

Redirect them to your app page

Now they share the same text/file space

http://yourapp.com/share/CIZI2mBaf2
You can:

Read that CIZI2mBaf2 from req.params

Store it in a cookie: ownerHash

Redirect to /
// Express route
router.get('/share/:ownerHash', (req, res) => {
  res.cookie('ownerHash', req.params.ownerHash, { maxAge: 86400000 });
  res.redirect('/');
});
Then your frontend grabs ownerHash from cookies like normal, and shares the same data 🎯



*/