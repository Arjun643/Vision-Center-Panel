import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  medicines: [
    { id: 1, name: 'Latanoprost Eye Drops', type: 'Glaucoma' },
    { id: 2, name: 'Timolol Eye Drops', type: 'Glaucoma' },
    { id: 3, name: 'Artificial Tears', type: 'Dry Eyes' },
    { id: 4, name: 'Prednisolone Eye Drops', type: 'Anti-inflammatory' },
    { id: 5, name: 'Ciprofloxacin Eye Drops', type: 'Antibiotic' },
    { id: 6, name: 'Cyclopentolate Eye Drops', type: 'Mydriatic' },
    { id: 7, name: 'Brimonidine Eye Drops', type: 'Glaucoma' },
    { id: 8, name: 'Dorzolamide Eye Drops', type: 'Glaucoma' }
  ],
};

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    // Add medicine-related actions if needed in future
    addMedicine: (state, action) => {
      state.medicines.push(action.payload);
    },
  },
});

export const { addMedicine } = medicineSlice.actions;

// Selectors
export const selectAllMedicines = (state) => state.medicines?.medicines || [];
export const selectMedicineById = (medicineId) => (state) => {
  const medicines = state.medicines?.medicines || [];
  return medicines.find(medicine => medicine.id === medicineId);
};

export default medicineSlice.reducer;
