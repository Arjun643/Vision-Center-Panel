import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    addPatient: (state, action) => {
      const newPatient = {
        ...action.payload,
        id: Date.now(),
        status: 'pending',
        selectedMedicines: [],
        prescriptionPrinted: false,
        registrationTime: new Date().toISOString()
      };
      state.patients.push(newPatient);
    },
    
    updatePatientStatus: (state, action) => {
      const { patientId, status } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);
      if (patient) {
        patient.status = status;
      }
    },
    
    selectMedicines: (state, action) => {
      const { patientId, medicines } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);
      if (patient) {
        patient.selectedMedicines = medicines;
      }
    },
    
    markPrescriptionPrinted: (state, action) => {
      const { patientId } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);
      if (patient) {
        patient.prescriptionPrinted = true;
      }
    },
    
    removePatient: (state, action) => {
      const { patientId } = action.payload;
      state.patients = state.patients.filter(p => p.id !== patientId);
    },
  },
});

export const {
  addPatient,
  updatePatientStatus,
  selectMedicines,
  markPrescriptionPrinted,
  removePatient,
} = patientSlice.actions;

// Selectors
export const selectAllPatients = (state) => state.patients?.patients || [];

export const selectPatientsByDoctor = (doctorId) => (state) => {
  const patients = state.patients?.patients || [];
  return patients.filter(
    patient => patient.doctorId === doctorId && patient.status === 'pending'
  );
};

export default patientSlice.reducer;
