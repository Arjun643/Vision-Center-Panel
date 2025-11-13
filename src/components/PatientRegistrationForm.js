import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllDoctors } from '../store/slices/doctorSlice';
import { addPatient } from '../store/slices/patientSlice';

const PatientRegistrationForm = () => {
  const dispatch = useDispatch();
  const doctors = useSelector(selectAllDoctors);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    details: '',
    priority: 'Medium',
    doctorId: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Details are required';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Convert age to number and add timestamp
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        doctorId: parseInt(formData.doctorId),
        registrationTime: new Date().toISOString()
      };
      
      dispatch(addPatient(patientData));
      
      // Reset form
      setFormData({
        name: '',
        age: '',
        details: '',
        priority: 'Medium',
        doctorId: ''
      });
      
      // Show success message
      const assignedDoctor = doctors.find(d => d.id === patientData.doctorId);
      setSuccessMessage(`Patient ${patientData.name} registered successfully and assigned to ${assignedDoctor?.name || 'Doctor'}!`);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      setErrors({ submit: 'Error registering patient. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="patient-registration-form">
      <h2>Patient Registration</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Patient Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter patient name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={errors.age ? 'error' : ''}
            placeholder="Enter age"
            min="1"
            max="120"
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="details">Details *</label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            className={errors.details ? 'error' : ''}
            placeholder="Enter patient details, symptoms, or concerns"
            rows="4"
          />
          {errors.details && <span className="error-message">{errors.details}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority *</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="doctorId">Assign to Doctor *</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className={errors.doctorId ? 'error' : ''}
          >
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
          {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
        </div>

        {errors.submit && (
          <div className="error-message" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {errors.submit}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting && (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          )}
          {isSubmitting ? 'Registering Patient...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
