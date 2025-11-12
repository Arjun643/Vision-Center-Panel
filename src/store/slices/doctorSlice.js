import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  doctors: [
    { id: 1, name: 'Dr. Smith', specialization: 'Ophthalmology' },
    { id: 2, name: 'Dr. Johnson', specialization: 'Retina Specialist' },
    { id: 3, name: 'Dr. Williams', specialization: 'Glaucoma Specialist' },
    { id: 4, name: 'Dr. Brown', specialization: 'Pediatric Ophthalmology' },
    { id: 5, name: 'Dr. Davis', specialization: 'Cornea Specialist' }
  ],
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    // Add doctor-related actions if needed in future
    addDoctor: (state, action) => {
      state.doctors.push(action.payload);
    },
  },
});

export const { addDoctor } = doctorSlice.actions;

// Selectors
export const selectAllDoctors = (state) => state.doctors?.doctors || [];
export const selectDoctorById = (doctorId) => (state) => {
  const doctors = state.doctors?.doctors || [];
  return doctors.find(doctor => doctor.id === doctorId);
};

export default doctorSlice.reducer;
