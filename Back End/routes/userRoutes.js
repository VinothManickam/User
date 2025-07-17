const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
    }
  },
});

router.post('/', upload.any(), async (req, res) => {
  try {
    console.log('POST /api/users - Request Body:', req.body);
    console.log('POST /api/users - Request Files:', req.files);

    const requiredFields = ['companyName', 'proprietorName', 'phoneNo', 'emailId', 'address', 'pinCode', 'gstinNo'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const lastUser = await User.findOne().sort({ sNo: -1 });
    const newSNo = lastUser ? lastUser.sNo + 1 : 1;

    let kycDetails = [];
    if (req.body.kycDetails) {
      const kycArray = JSON.parse(req.body.kycDetails);
      for (const item of kycArray) {
        if ((item.documentName || item.documentNo) && (!item.documentName || !item.documentNo)) {
          return res.status(400).json({ message: 'KYC details must include both document name and number if either is provided' });
        }
      }
      kycDetails = kycArray.map((item, index) => ({
        documentName: item.documentName || '',
        documentNo: item.documentNo || '',
        documentFile: req.files.find(f => f.fieldname === `kycDetails[${index}]`)?.filename || null,
      }));
    }

    let bankDetails = [];
    if (req.body.bankDetails) {
      const bankArray = JSON.parse(req.body.bankDetails);
      bankDetails = bankArray.map((item) => ({
        accountNo: item.accountNo || '',
        bankName: item.bankName || '',
        name: item.name || '',
        branchName: item.branchName || '',
        ifscCode: item.ifscCode || '',
      }));
    }

    const user = new User({
      sNo: newSNo,
      companyName: req.body.companyName,
      type: req.body.type || 'vendor',
      logo: req.files.find(f => f.fieldname === 'logo')?.filename || null,
      seal: req.body.seal || '',
      proprietorName: req.body.proprietorName,
      phoneNo: req.body.phoneNo,
      emailId: req.body.emailId,
      website: req.body.website || '',
      address: req.body.address,
      country: req.body.country || 'India',
      state: req.body.state || 'Tamilnadu',
      pinCode: req.body.pinCode,
      currency: req.body.currency || 'Rupee',
      tcsTds: req.body.tcsTds || 'TCS',
      gstinNo: req.body.gstinNo,
      kycDetails,
      bankDetails,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error saving user:', error.stack);
    res.status(500).json({ message: `Failed to save user: ${error.message}`, stack: error.stack });
  }
});

router.put('/:id', upload.any(), async (req, res) => {
  try {
    console.log('PUT /api/users/:id - Request Body:', req.body);
    console.log('PUT /api/users/:id - Request Files:', req.files);

    const requiredFields = ['companyName', 'proprietorName', 'phoneNo', 'emailId', 'address', 'pinCode', 'gstinNo'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const updates = {
      companyName: req.body.companyName,
      type: req.body.type,
      logo: req.files.find(f => f.fieldname === 'logo')?.filename || undefined,
      seal: req.body.seal,
      proprietorName: req.body.proprietorName,
      phoneNo: req.body.phoneNo,
      emailId: req.body.emailId,
      website: req.body.website,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      pinCode: req.body.pinCode,
      currency: req.body.currency,
      tcsTds: req.body.tcsTds,
      gstinNo: req.body.gstinNo,
    };

    if (req.body.kycDetails) {
      const kycArray = JSON.parse(req.body.kycDetails);
      for (const item of kycArray) {
        if ((item.documentName || item.documentNo) && (!item.documentName || !item.documentNo)) {
          return res.status(400).json({ message: 'KYC details must include both document name and number if either is provided' });
        }
      }
      updates.kycDetails = kycArray.map((item, index) => ({
        documentName: item.documentName || '',
        documentNo: item.documentNo || '',
        documentFile:
          req.files.find(f => f.fieldname === `kycDetails[${index}]`)?.filename ||
          (typeof item.documentFile === 'string' ? item.documentFile : null),
      }));
    }

    if (req.body.bankDetails) {
      const bankArray = JSON.parse(req.body.bankDetails);
      updates.bankDetails = bankArray.map((item) => ({
        accountNo: item.accountNo || '',
        bankName: item.bankName || '',
        name: item.name || '',
        branchName: item.branchName || '',
        ifscCode: item.ifscCode || '',
      }));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error.stack);
    res.status(500).json({ message: `Failed to update user: ${error.message}`, stack: error.stack });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ sNo: 1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.stack);
    res.status(500).json({ message: `Failed to fetch users: ${error.message}` });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.stack);
    res.status(500).json({ message: `Failed to fetch user: ${error.message}` });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error.stack);
    res.status(500).json({ message: `Failed to delete user: ${error.message}` });
  }
});

module.exports = router;
