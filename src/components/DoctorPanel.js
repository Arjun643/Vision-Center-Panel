import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMedicines, markPrescriptionPrinted, removePatient } from '../store/slices/patientSlice';
import { selectAllDoctors } from '../store/slices/doctorSlice';
import { selectAllMedicines } from '../store/slices/medicineSlice';

const DoctorPanel = ({ doctorId }) => {
  const dispatch = useDispatch();
  
  const doctors = useSelector((state) => {
    try {
      return state?.doctors?.doctors || [];
    } catch (error) {
      console.error('Error loading doctors:', error);
      return [];
    }
  });
  
  const medicines = useSelector((state) => {
    try {
      return state?.medicines?.medicines || [];
    } catch (error) {
      console.error('Error loading medicines:', error);
      return [];
    }
  });
  
  const allPatients = useSelector((state) => {
    try {
      // Ensure we have a valid state structure
      if (!state || typeof state !== 'object') {
        console.log('Invalid state object:', state);
        return [];
      }
      
      const patients = state?.patients?.patients;
      
      // Check if patients exists and is an array
      if (!patients || !Array.isArray(patients)) {
        console.log('No valid patients array found:', patients);
        return [];
      }
      
      // If no doctorId provided, return empty array
      if (!doctorId) {
        return [];
      }
      
      // Filter patients safely
      const filteredPatients = patients.filter(patient => {
        // Ensure patient is a valid object
        if (!patient || typeof patient !== 'object') {
          return false;
        }
        
        return patient.doctorId === parseInt(doctorId) && patient.status === 'pending';
      });
      
      return filteredPatients;
    } catch (error) {
      console.error('Error in patient selector:', error);
      return [];
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedMedicineIds, setSelectedMedicineIds] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Debounce search term with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter and sort patients - MUST be before early returns
  const filteredAndSortedPatients = useMemo(() => {
    try {
      // Handle case where doctorId is not provided
      if (!doctorId) return [];
      
      // Ensure we always have a valid array
      if (!Array.isArray(allPatients)) {
        console.log('allPatients is not an array in useMemo:', allPatients);
        return [];
      }
      
      let filtered = allPatients.filter(patient => {
        // Additional safety check for each patient
        return patient && typeof patient === 'object' && patient.name;
      });

      // Filter by search term
      if (debouncedSearchTerm && typeof debouncedSearchTerm === 'string' && debouncedSearchTerm.trim()) {
        filtered = filtered.filter(patient => {
          const name = patient?.name;
          const searchTerm = debouncedSearchTerm.toLowerCase();
          return name && typeof name === 'string' && name.toLowerCase().includes(searchTerm);
        });
      }

      // Sort by priority: High -> Medium -> Low
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      filtered.sort((a, b) => {
        const aPriority = priorityOrder[a?.priority] || 2; // Default to Medium
        const bPriority = priorityOrder[b?.priority] || 2; // Default to Medium
        return bPriority - aPriority;
      });

      return filtered;
    } catch (error) {
      console.error('Error in filteredAndSortedPatients:', error);
      return [];
    }
  }, [allPatients, debouncedSearchTerm, doctorId]);

  // Early return after ALL hooks are called
  if (!doctorId) {
    return (
      <div className="doctor-panel">
        <div className="no-selection">
          <p>Please select a doctor from the dropdown to view the patient queue.</p>
        </div>
      </div>
    );
  }

  // Find doctor safely
  const doctor = Array.isArray(doctors) ? doctors.find(d => d?.id === parseInt(doctorId)) : null;

  // Safety check - ensure we have basic data
  if (!Array.isArray(doctors) || !Array.isArray(medicines)) {
    return (
      <div className="doctor-panel">
        <div className="loading">Loading doctor panel data...</div>
      </div>
    );
  }

  // Additional safety check for doctor existence
  if (!doctor) {
    return (
      <div className="doctor-panel">
        <div className="error-message">
          <p>Doctor not found. Please select a valid doctor.</p>
        </div>
      </div>
    );
  }

  const handlePatientSelect = (patient) => {
    try {
      if (!patient || typeof patient !== 'object') {
        console.error('Invalid patient selected:', patient);
        return;
      }
      
      setSelectedPatient(patient);
      setSelectedAction('');
      
      // Safely set selected medicines
      const medicines = patient.selectedMedicines;
      setSelectedMedicineIds(Array.isArray(medicines) ? medicines : []);
    } catch (error) {
      console.error('Error selecting patient:', error);
    }
  };

  const handleActionChange = (action) => {
    setSelectedAction(action);
    if (action !== 'Medicine Prescription') {
      setSelectedMedicineIds([]);
    }
    
    // Handle Video Call and Refer to Hospital actions
    if (action === 'Video Call') {
      const notification = {
        id: Date.now(),
        type: 'success',
        message: `Video call initiated for ${selectedPatient?.name || 'patient'}`
      };
      setNotifications(prev => [...prev, notification]);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    }
    
    if (action === 'Refer to Hospital') {
      const notification = {
        id: Date.now(),
        type: 'success',
        message: `${selectedPatient?.name || 'Patient'} referred to hospital for advanced treatment`
      };
      setNotifications(prev => [...prev, notification]);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    }
  };

  const handleMedicineToggle = (medicineId) => {
    try {
      if (!medicineId || !selectedPatient) {
        return;
      }
      
      setSelectedMedicineIds(prev => {
        // Ensure prev is an array
        const currentSelection = Array.isArray(prev) ? prev : [];
        
        const newSelection = currentSelection.includes(medicineId)
          ? currentSelection.filter(id => id !== medicineId)
          : [...currentSelection, medicineId];
        
        // Update patient's selected medicines in Redux store
        dispatch(selectMedicines({ 
          patientId: selectedPatient.id, 
          medicines: newSelection 
        }));
        
        return newSelection;
      });
    } catch (error) {
      console.error('Error toggling medicine selection:', error);
    }
  };

  const handlePrintPrescription = () => {
    if (selectedPatient && selectedMedicineIds.length > 0) {
      const selectedMedicineNames = (medicines || [])
        .filter(med => med && selectedMedicineIds.includes(med.id))
        .map(med => med.name || 'Unknown Medicine');
      
      console.log('Printing Prescription for:', selectedPatient.name);
      console.log('Medicines:', selectedMedicineNames);
      
      dispatch(markPrescriptionPrinted({ patientId: selectedPatient.id }));
      
      // Add success notification
      const notification = {
        id: Date.now(),
        type: 'success',
        message: `Prescription printed for ${selectedPatient.name}`,
        medicines: selectedMedicineNames
      };
      setNotifications(prev => [...prev, notification]);
      
      // Remove notification after 4 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 4000);
    }
  };

  const handleMarkAsDone = () => {
    if (selectedPatient) {
      const patientName = selectedPatient.name;
      dispatch(removePatient({ patientId: selectedPatient.id }));
      
      // Add success notification
      const notification = {
        id: Date.now(),
        type: 'success',
        message: `Patient ${patientName} marked as done and removed from queue`
      };
      setNotifications(prev => [...prev, notification]);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
      
      setSelectedPatient(null);
      setSelectedAction('');
      setSelectedMedicineIds([]);
    }
  };

  const canMarkAsDone = selectedPatient && (
    // For Medicine Prescription: need medicines selected and prescription printed
    (selectedAction === 'Medicine Prescription' && selectedMedicineIds.length > 0 && selectedPatient.prescriptionPrinted) ||
    // For Video Call and Refer to Hospital: just need action selected
    (selectedAction === 'Video Call') ||
    (selectedAction === 'Refer to Hospital')
  );


  return (
    <div className="doctor-panel">
      <h2>Doctor Panel - {doctor?.name}</h2>
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              <div className="notification-message">{notification.message}</div>
              {notification.medicines && (
                <div className="notification-medicines">
                  Medicines: {notification.medicines.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="panel-content">
        {/* Patient Queue Section */}
        <div className="patient-queue">
          <h3>Patient Queue ({filteredAndSortedPatients.length})</h3>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="patient-list">
            {Array.isArray(filteredAndSortedPatients) && filteredAndSortedPatients.length > 0 ? (
              <div 
                className="patient-list-container virtualized-list" 
                style={{ 
                  height: '400px', 
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                  backgroundColor: '#fafafa'
                }}
              >
                <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
                  📊 Efficient Display: Showing {filteredAndSortedPatients.length} patients with optimized rendering
                </div>
                {filteredAndSortedPatients.map((patient, index) => {
                  // Safety check for each patient
                  if (!patient || typeof patient !== 'object' || !patient.id) {
                    return null;
                  }
                  
                  const isSelected = selectedPatient?.id === patient.id;
                  const priority = patient.priority && typeof patient.priority === 'string' 
                    ? patient.priority.toLowerCase() 
                    : 'medium';
                  
                  return (
                    <div
                      key={patient.id}
                      className={`patient-row ${isSelected ? 'selected' : ''} priority-${priority}`}
                      onClick={() => handlePatientSelect(patient)}
                      style={{
                        marginBottom: '10px',
                        padding: '15px',
                        border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#e3f2fd' : 'white',
                        transition: 'all 0.2s ease',
                        minHeight: '100px',
                        boxShadow: isSelected ? '0 2px 8px rgba(0,123,255,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                        transform: isSelected ? 'translateY(-1px)' : 'none'
                      }}
                    >
                      <div className="patient-info">
                        <div className="patient-name" style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', color: '#333' }}>
                          {patient.name || 'Unknown Patient'}
                        </div>
                        <div className="patient-details" style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>
                          Age: {patient.age || 'N/A'} | Priority: 
                          <span style={{ 
                            color: priority === 'high' ? '#dc3545' : priority === 'medium' ? '#fd7e14' : '#28a745',
                            fontWeight: 'bold',
                            marginLeft: '5px'
                          }}>
                            {patient.priority || 'Medium'}
                          </span>
                        </div>
                        <div className="patient-description" style={{ fontSize: '12px', color: '#888' }}>
                          {patient.details || 'No details provided'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-patients" style={{ 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                color: '#666',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {debouncedSearchTerm && debouncedSearchTerm.trim() ? 
                    'No patients found matching your search.' : 
                    'No patients in queue for this doctor.'}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  Patients will appear here when registered and assigned to this doctor.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Actions Section */}
        <div className="patient-actions">
          {selectedPatient ? (
            <>
              <h3>Patient: {selectedPatient.name}</h3>
              <div className="patient-summary">
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Priority:</strong> {selectedPatient.priority}</p>
                <p><strong>Details:</strong> {selectedPatient.details}</p>
              </div>

              <div className="action-selection">
                <label htmlFor="action-select">Select Action:</label>
                <select
                  id="action-select"
                  value={selectedAction}
                  onChange={(e) => handleActionChange(e.target.value)}
                >
                  <option value="">Choose an action</option>
                  <option value="Video Call">Video Call</option>
                  <option value="Refer to Hospital">Refer to Hospital</option>
                  <option value="Medicine Prescription">Medicine Prescription</option>
                </select>
              </div>

              {selectedAction === 'Medicine Prescription' && (
                <div className="medicine-selection">
                  <h4>Select Medicines:</h4>
                  <div className="medicine-list">
                    {Array.isArray(medicines) && medicines.length > 0 ? (
                      medicines.map(medicine => {
                        // Safety check for each medicine
                        if (!medicine || typeof medicine !== 'object' || !medicine.id) {
                          return null;
                        }
                        
                        return (
                          <label key={medicine.id} className="medicine-item">
                            <input
                              type="checkbox"
                              checked={Array.isArray(selectedMedicineIds) && selectedMedicineIds.includes(medicine.id)}
                              onChange={() => handleMedicineToggle(medicine.id)}
                            />
                            <span>{medicine.name || 'Unknown Medicine'} ({medicine.type || 'Unknown Type'})</span>
                          </label>
                        );
                      })
                    ) : (
                      <div className="no-medicines">No medicines available</div>
                    )}
                  </div>

                  {selectedMedicineIds.length > 0 && (
                    <button
                      className="print-prescription-btn"
                      onClick={handlePrintPrescription}
                      disabled={selectedPatient.prescriptionPrinted}
                    >
                      {selectedPatient.prescriptionPrinted ? 'Prescription Printed' : 'Print Prescription'}
                    </button>
                  )}
                </div>
              )}

              <button
                className="mark-done-btn"
                onClick={handleMarkAsDone}
                disabled={!canMarkAsDone}
                title={!canMarkAsDone ? 'Select medicines and print prescription first' : ''}
              >
                Mark as Done
              </button>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a patient from the queue to view details and take actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPanel;
