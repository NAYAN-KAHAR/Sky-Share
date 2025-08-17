import textModel from '../../../Models/textModel.js';
import requestIp from 'request-ip';
import isPrivateIp from 'private-ip'; // ✅ Install via: npm i private-ip

const textGetController = async (req, res) => {
  try {
    const { ownerHash } = req.query;

   // ✅ Extract and normalize IP address
    let ip = requestIp.getClientIp(req) || '';

    // Log raw value
    console.log('Raw IP:', ip);

    // Normalize IPv6-mapped IPv4
    if (ip.includes('::ffff:')) {
      ip = ip.split('::ffff:')[1];
    }

    // Remove port or extra tokens
    if (ip.includes(':')) {
      ip = ip.split(':')[0];
    }

    // Filter private IPs (optional)
    const isPrivate = isPrivateIp(ip);
    if (isPrivate || !ip) {
      ip = 'unknown';
    }

    // ✅ Only split if IP is valid
    let ipGroup = 'unknown';
    if (ip !== 'unknown' && ip.split('.').length >= 3) {
      ipGroup = ip.split('.').slice(0, 3).join('.');
    }

    console.log('Final IP:', ip);
    console.log('IP Group:', ipGroup);


    // ✅ Check for required query parameter
    if (!ownerHash) {
      return res.status(400).json({ message: 'ownerHash query param is required' });
    }

    // ✅ Find latest content for this ipGroup and ownerHash
    // const textContent = await textModel.findOne({ ipGroup, ownerHash }).sort({ createdAt: -1 });
    const textContent = await textModel.findOne({ ipGroup }).sort({ createdAt: -1 });

    if (!textContent) {
      return res.status(404).json({ message: 'No content found' });
    }

    // ✅ Return found content
    return res.status(200).json({ textContent });

  } catch (err) {
    console.error('Error in textGetController:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export default textGetController;


