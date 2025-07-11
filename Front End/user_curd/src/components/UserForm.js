import React, { useState, useEffect } from 'react';

function UserForm({ show, handleClose, onSave, userData, isEdit }) {
  const [formData, setFormData] = useState({
    username: '',
    type: '',
    phoneNo: '',
    contactPerson: '',
    panNo: '',
    gstinNo: '',
    _id: ''
  });

  useEffect(() => {
    if (isEdit && userData) {
      setFormData({
        username: userData.username || '',
        type: userData.type || '',
        phoneNo: userData.phoneNo || '',
        contactPerson: userData.contactPerson || '',
        panNo: userData.panNo || '',
        gstinNo: userData.gstinNo || '',
        _id: userData._id || ''
      });
    } else {
      setFormData({
        username: '',
        type: '',
        phoneNo: '',
        contactPerson: '',
        panNo: '',
        gstinNo: '',
        _id: ''
      });
    }
  }, [userData, isEdit]);

  const handleSave = () => {
    // Basic validation
    if (!formData.username || !formData.type || !formData.phoneNo || !formData.contactPerson || !formData.panNo || !formData.gstinNo) {
      alert('All fields are required!');
      return;
    }

    onSave({ ...formData, sNo: undefined }); // Exclude sNo from client data
    setFormData({
      username: '',
      type: '',
      phoneNo: '',
      contactPerson: '',
      panNo: '',
      gstinNo: '',
      _id: ''
    });
  };

  if (!show) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{isEdit ? 'Edit User' : 'Create User'}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control mb-2"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <select
              className="form-control mb-2"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="vendor">Vendor</option>
              <option value="customer">Customer</option>
            </select>
            <input
              className="form-control mb-2"
              placeholder="Phone No"
              value={formData.phoneNo}
              onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="PAN No"
              value={formData.panNo}
              onChange={(e) => setFormData({ ...formData, panNo: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="GSTIN No"
              value={formData.gstinNo}
              onChange={(e) => setFormData({ ...formData, gstinNo: e.target.value })}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;