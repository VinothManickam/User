import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CreateUserForm.css';

function CreateUserForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    companyName: '',
    type: 'vendor',
    logo: null,
    logoUrl: '',
    seal: '',
    proprietorName: '',
    phoneNo: '',
    emailId: '',
    website: '',
    address: '',
    country: 'India',
    state: 'Tamilnadu',
    pinCode: '',
    currency: 'Rupee',
    tcsTds: 'TCS',
    gstinNo: '',
    kycDetails: [{ documentName: '', documentNo: '', documentFile: null, documentFileUrl: '' }],
    bankDetails: [{ accountNo: '', bankName: '', name: '', branchName: '', ifscCode: '' }],
    _id: '',
  });

  const [activeTab, setActiveTab] = useState('kycDetails');
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = location.state?.isEdit || false;
  const initialUserData = location.state?.user || null;

  useEffect(() => {
    if (isEdit && initialUserData) {
      setFormData({
        ...initialUserData,
        logo: null,
        logoUrl: initialUserData.logo ? `http://localhost:5000/Uploads/${initialUserData.logo}` : '',
        kycDetails: initialUserData.kycDetails?.map((item) => ({
          documentName: item.documentName || '',
          documentNo: item.documentNo || '',
          documentFile: null,
          documentFileUrl: item.documentFile ? `http://localhost:5000/Uploads/${item.documentFile}` : '',
        })) || [{ documentName: '', documentNo: '', documentFile: null, documentFileUrl: '' }],
        bankDetails: initialUserData.bankDetails || [{ accountNo: '', bankName: '', name: '', branchName: '', ifscCode: '' }],
        _id: initialUserData._id,
      });
    }
  }, [isEdit, initialUserData]);

  const handleTextInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, section, index) => {
    const file = e.target.files[0];
    if (section === 'logo') {
      setFormData((prev) => ({
        ...prev,
        logo: file,
        logoUrl: file ? URL.createObjectURL(file) : prev.logoUrl,
      }));
    } else {
      const updated = [...formData[section]];
      updated[index].documentFile = file;
      updated[index].documentFileUrl = file ? URL.createObjectURL(file) : updated[index].documentFileUrl;
      setFormData((prev) => ({ ...prev, [section]: updated }));
    }
  };

  const handleNestedInput = (e, section, index, field) => {
    const value = e.target.value;
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, [section]: updated }));
  };

  const handleAddRow = (section) => {
    const newRow =
      section === 'kycDetails'
        ? { documentName: '', documentNo: '', documentFile: null, documentFileUrl: '' }
        : { accountNo: '', bankName: '', name: '', branchName: '', ifscCode: '' };
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], newRow] }));
  };

  const handleRemoveRow = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const required = ['companyName', 'proprietorName', 'phoneNo', 'emailId', 'address', 'pinCode', 'gstinNo'];
    const incomplete = required.some((key) => !formData[key]);
    if (incomplete) {
      alert('Please fill all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      alert('Invalid email format.');
      return;
    }
    if (!/^\d{10}$/.test(formData.phoneNo)) {
      alert('Phone number must be 10 digits.');
      return;
    }
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(formData.gstinNo)) {
      alert('Invalid GSTIN format.');
      return;
    }
    for (const item of formData.kycDetails) {
      if ((item.documentName || item.documentNo || item.documentFile) && (!item.documentName || !item.documentNo)) {
        alert('KYC details must include both document name and number if either is provided.');
        return;
      }
    }
    const cleanedFormData = {
      ...formData,
      kycDetails: formData.kycDetails.map((item) => ({
        documentName: item.documentName || '',
        documentNo: item.documentNo || '',
        documentFile: item.documentFile instanceof File ? item.documentFile : null,
        documentFileUrl: item.documentFileUrl || '',
      })),
    };
    onSave(cleanedFormData, isEdit);
  };

  const getFileName = (fileObj, fileUrl) => fileObj?.name || (fileUrl ? fileUrl.split('/').pop() : '');

  return (
    <div className="create-user-page">
      <div className="container mt-4">
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>{isEdit ? 'EDIT USER' : 'CREATE USER'}</h5>
            <button className="btn btn-orange" onClick={onCancel}>User List</button>
          </div>

          <div className="card-body">
            <h4>User Details</h4>
            <div className="row mb-3">
              <div className="col">
                <label>Company Name <span style={{ color: 'orange' }}>*</span></label>
                <input name="companyName" className="form-control" value={formData.companyName} onChange={handleTextInput} />
              </div>
              <div className="col">
                <label>Type <span style={{ color: 'orange' }}>*</span></label>
                <select name="type" className="form-control" value={formData.type} onChange={handleTextInput}>
                  <option value="vendor">Vendor</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label>Logo</label>
                <input type="file" accept="image/jpeg,image/png" className="form-control" onChange={(e) => handleFileChange(e, 'logo')} />
                {formData.logoUrl && (
                  <div className="mt-1 text-orange d-flex align-items-center gap-2">
                    <img src={formData.logoUrl} alt="Logo" style={{ width: '50px', height: '50px' }} />
                    <span>{getFileName(formData.logo, formData.logoUrl)}</span>
                  </div>
                )}
              </div>
              <div className="col">
                <label>Seal</label>
                <input name="seal" className="form-control" value={formData.seal} onChange={handleTextInput} />
              </div>
            </div>

            <h4>Primary Information</h4>
            <div className="row mb-3">
              <div className="col">
                <label>Proprietor Name <span style={{ color: 'orange' }}>*</span></label>
                <input name="proprietorName" className="form-control" value={formData.proprietorName} onChange={handleTextInput} />
              </div>
              <div className="col">
                <label>Phone Number <span style={{ color: 'orange' }}>*</span></label>
                <input name="phoneNo" className="form-control" value={formData.phoneNo} onChange={handleTextInput} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label>Email ID <span style={{ color: 'orange' }}>*</span></label>
                <input name="emailId" className="form-control" value={formData.emailId} onChange={handleTextInput} />
              </div>
              <div className="col">
                <label>Website</label>
                <input name="website" className="form-control" value={formData.website} onChange={handleTextInput} />
              </div>
            </div>

            <div className="mb-3">
              <label>Address <span style={{ color: 'orange' }}>*</span></label>
              <input name="address" className="form-control" value={formData.address} onChange={handleTextInput} />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label>Country</label>
                <select name="country" className="form-control" value={formData.country} onChange={handleTextInput}>
                  <option>India</option>
                </select>
              </div>
              <div className="col">
                <label>State</label>
                <select name="state" className="form-control" value={formData.state} onChange={handleTextInput}>
                  <option>Tamilnadu</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label>PIN Code <span style={{ color: 'orange' }}>*</span></label>
                <input name="pinCode" className="form-control" value={formData.pinCode} onChange={handleTextInput} />
              </div>
              <div className="col">
                <label>Currency</label>
                <input name="currency" className="form-control" value={formData.currency} onChange={handleTextInput} />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <label>TCS/TDS</label>
                <select name="tcsTds" className="form-control" value={formData.tcsTds} onChange={handleTextInput}>
                  <option>TCS</option>
                  <option>TDS</option>
                </select>
              </div>
              <div className="col">
                <label>GSTIN No <span style={{ color: 'orange' }}>*</span></label>
                <input name="gstinNo" className="form-control" value={formData.gstinNo} onChange={handleTextInput} />
              </div>
            </div>

            <h4>Other Details</h4>
            <div className="btn-group mb-3">
              <button className={`btn ${activeTab === 'kycDetails' ? 'btn-orange' : 'btn-light'}`} onClick={() => setActiveTab('kycDetails')}>
                KYC Details
              </button>
              <button className={`btn ${activeTab === 'bankDetails' ? 'btn-orange' : 'btn-light'}`} onClick={() => setActiveTab('bankDetails')}>
                Bank Details
              </button>
            </div>

            {activeTab === 'kycDetails' && (
              <table className="table table-bordered mb-3">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Document Name</th>
                    <th>Document No</th>
                    <th>Document File</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.kycDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><input className="form-control" value={item.documentName} onChange={(e) => handleNestedInput(e, 'kycDetails', index, 'documentName')} /></td>
                      <td><input className="form-control" value={item.documentNo} onChange={(e) => handleNestedInput(e, 'kycDetails', index, 'documentNo')} /></td>
                      <td>
                        <input type="file" accept=".pdf" className="form-control" onChange={(e) => handleFileChange(e, 'kycDetails', index)} />
                        {item.documentFileUrl && (
                          <div className="mt-2 bg-orange text-white rounded px-2 py-1 d-inline-flex align-items-center gap-2">
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                            <span>{getFileName(item.documentFile, item.documentFileUrl)}</span>
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        {index === formData.kycDetails.length - 1 ? (
                          <button className="btn btn-sm border-0 bg-transparent p-1" onClick={() => handleAddRow('kycDetails')}>
                            <i className="bi bi-plus" style={{ color: 'orange', fontSize: '1.5rem' }}></i>
                          </button>
                        ) : (
                          <button className="btn btn-sm border-0 bg-transparent p-1" onClick={() => handleRemoveRow('kycDetails', index)}>
                            <i className="bi bi-trash" style={{ color: 'orange', fontSize: '1.2rem' }}></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'bankDetails' && (
              <table className="table table-bordered mb-3">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Account No</th>
                    <th>Bank Name</th>
                    <th>Name</th>
                    <th>Branch</th>
                    <th>IFSC</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.bankDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><input className="form-control" value={item.accountNo} onChange={(e) => handleNestedInput(e, 'bankDetails', index, 'accountNo')} /></td>
                      <td><input className="form-control" value={item.bankName} onChange={(e) => handleNestedInput(e, 'bankDetails', index, 'bankName')} /></td>
                      <td><input className="form-control" value={item.name} onChange={(e) => handleNestedInput(e, 'bankDetails', index, 'name')} /></td>
                      <td><input className="form-control" value={item.branchName} onChange={(e) => handleNestedInput(e, 'bankDetails', index, 'branchName')} /></td>
                      <td><input className="form-control" value={item.ifscCode} onChange={(e) => handleNestedInput(e, 'bankDetails', index, 'ifscCode')} /></td>
                      <td className="text-center">
                        {index === formData.bankDetails.length - 1 ? (
                          <button className="btn btn-sm border-0 bg-transparent p-1" onClick={() => handleAddRow('bankDetails')}>
                            <i className="bi bi-plus" style={{ color: 'orange', fontSize: '1.5rem' }}></i>
                          </button>
                        ) : (
                          <button className="btn btn-sm border-0 bg-transparent p-1" onClick={() => handleRemoveRow('bankDetails', index)}>
                            <i className="bi bi-trash" style={{ color: 'orange', fontSize: '1.2rem' }}></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card-footer text-center">
            <button className="btn btn-orange me-2" onClick={handleSave}>Save</button>
            <button className="btn btn-cancel-custom" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUserForm;
