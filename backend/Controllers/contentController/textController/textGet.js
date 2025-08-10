
import textModel from '../../../Models/textModel.js'
import requestIp from 'request-ip';

const textGetController = async (req, res) => {
  try {

    const { ownerHash } = req.query;
    const ip = requestIp.getClientIp(req) || 'unknown';
    const ipGroup = ip.split('.').slice(0, 3).join('.'); // e.g., "192.168.1"

    // console.log('getting', ownerHash);

    if (!ownerHash) {
      return res.status(400).json({ message: 'ownerHash query param is required' });
    }

    const textContent = await textModel.findOne({ ipGroup }).sort({ createdAt: -1 });
   
    if (!textContent) {
      return res.status(404).json({ message: 'No content found' });
    }

    res.status(200).json({ textContent });

  } catch (err) {
    console.error('Error in textGetController:', err);
    res.status(500).json({ status: 500, error: err.message || 'Internal server error' });
  }
};

  

export default textGetController;