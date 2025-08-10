
import textModel from '../../../Models/textModel.js'

const deleteFilesController = async (req, res) => {
  try {
    const { ownerHash, filenames } = req.body;

    if (!ownerHash || !filenames || !Array.isArray(filenames)) {
      return res.status(400).json({ message: 'Missing ownerHash or filenames' });
    }

    // Find the document
    const existing = await textModel.findOne({ ownerHash });

    if (!existing) {
      return res.status(404).json({ message: 'No data found for this ownerHash' });
    }

    // Filter out files to delete
    const updatedFiles = existing.files.filter(file => !filenames.includes(file.filename));

    // Update the DB
    existing.files = updatedFiles;
    await existing.save();

    res.status(200).json({ message: 'Files deleted successfully', updatedFiles });

  } catch (err) {
    console.error('Delete files error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export default deleteFilesController;
