import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllDoctors } from '../store/slices/doctorSlice';
import { selectAllPatients } from '../store/slices/patientSlice';
import PatientRegistrationForm from './PatientRegistrationForm';
import DoctorPanel from './DoctorPanel';
import ErrorBoundary from './ErrorBoundary';

const Navigation = () => {
  const [currentView, setCurrentView] = useState('registration');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const doctors = useSelector(selectAllDoctors);
  const allPatients = useSelector((state) => state.patients?.patients || []);
  
  // Get patient count for a specific doctor
  const getPatientCount = (doctorId) => {
    try {
      if (!Array.isArray(allPatients) || !doctorId) {
        return 0;
      }
      
      return allPatients.filter(patient => {
        // Safety check for patient object
        if (!patient || typeof patient !== 'object') {
          return false;
        }
        
        return patient.doctorId === parseInt(doctorId) && patient.status === 'pending';
      }).length;
    } catch (error) {
      console.error('Error calculating patient count:', error);
      return 0;
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'registration':
        return <PatientRegistrationForm />;
      case 'doctor':
        return selectedDoctor ? (
          <ErrorBoundary>
            <DoctorPanel doctorId={selectedDoctor} />
          </ErrorBoundary>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '400px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👨‍⚕️</div>
            <h3 style={{ marginBottom: '10px' }}>Please Select a Doctor</h3>
            <p style={{ marginBottom: '20px' }}>Choose a doctor from the dropdown above to view their patient queue.</p>
            <button 
              onClick={() => {
                setCurrentView('registration');
                setSelectedDoctor(null); // Clear doctor selection
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Go to Patient Registration
            </button>
          </div>
        );
      default:
        return <PatientRegistrationForm />;
    }
  };

  return (
    <>
      {/* Navigation Bar */}
    <nav className="navigation">
      <div className="nav-brand">
        <h1>Vision Center Panel</h1>
      </div>
      
      <div className="nav-buttons">
        <button
          className={currentView === 'registration' ? 'active' : ''}
          onClick={() => {
            setCurrentView('registration');
            setSelectedDoctor(null); // Clear doctor selection when going to registration
          }}
        >
          Patient Registration
        </button>
        
        <div className="doctor-panel-nav">
          <select
            value={selectedDoctor || ''}
            onChange={(e) => {
              const doctorId = parseInt(e.target.value);
              setSelectedDoctor(doctorId);
              if (doctorId) {
                setCurrentView('doctor');
              } else {
                // If "Select Doctor Panel" is selected, go back to registration
                setCurrentView('registration');
              }
            }}
          >
            <option value="">Select Doctor Panel</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} ({getPatientCount(doctor.id)} patients)
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </>
  );
};

export default Navigation;
