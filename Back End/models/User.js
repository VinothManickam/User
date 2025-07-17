const mongoose = require('mongoose');

const kycDetailSchema = new mongoose.Schema({
  documentName: { 
    type: String, 
    default: '',
    required: function () { return this.documentNo || this.documentFile; }
  },
  documentNo: { 
    type: String, 
    default: '',
    required: function () { return this.documentName || this.documentFile; }
  },
  documentFile: { type: String, default: null },
});

const bankDetailSchema = new mongoose.Schema({
  accountNo: { type: String, default: '' },
  bankName: { type: String, default: '' },
  name: { type: String, default: '' },
  branchName: { type: String, default: '' },
  ifscCode: { type: String, default: '' },
});

const userSchema = new mongoose.Schema({
  sNo: { type: Number, unique: true },
  companyName: { type: String, required: true },
  type: { type: String, default: 'vendor' },
  logo: { type: String, default: null },
  seal: { type: String, default: '' },
  proprietorName: { type: String, required: true },
  phoneNo: { type: String, required: true },
  emailId: { type: String, required: true },
  website: { type: String, default: '' },
  address: { type: String, required: true },
  country: { type: String, default: 'India' },
  state: { type: String, default: 'Tamilnadu' },
  pinCode: { type: String, required: true },
  currency: { type: String, default: 'Rupee' },
  tcsTds: { type: String, default: 'TCS' },
  gstinNo: { type: String, required: true },
  kycDetails: [kycDetailSchema],
  bankDetails: [bankDetailSchema],
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const lastUser = await mongoose.model('User').findOne().sort({ sNo: -1 });
      this.sNo = lastUser ? lastUser.sNo + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
