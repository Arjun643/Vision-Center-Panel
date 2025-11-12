# Vision Center Panel - Interview Assignment

A comprehensive React application for managing patient registration and doctor consultations in a vision center.

## 🚀 Features Implemented

### Part 1 - Vision Center Panel (Patient Registration)
- ✅ **Patient Registration Form** with validation
  - Name, Age, Details, Priority (High/Medium/Low) fields
  - Complete form validation for required fields
  - Data saved in global state using React Context
- ✅ **Doctor Assignment**
  - Dropdown with list of available doctors
  - Patient assigned to selected doctor's queue
  - Status automatically set to "pending"

### Part 2 - Doctor Panel (Patient Queue Management)
- ✅ **Efficient Patient Display**
  - Virtualized list using React Window for performance
  - Handles large patient lists efficiently
- ✅ **Search & Sort Functionality**
  - Search by patient name with 300ms debounce
  - Sort by priority (High → Medium → Low)
- ✅ **Action Management**
  - Action dropdown with options: Video Call, Refer to Hospital, Medicine Prescription
  - Medicine selection interface with mock medicine list
  - Print Prescription functionality with simulation
- ✅ **Mark as Done Workflow**
  - Button disabled until medicine selected and prescription printed
  - Removes patient from queue when marked as done

## 🛠️ Technologies Used

- **React 19.2.0** - Latest React version
- **Redux Toolkit** - Modern Redux for state management
- **React Redux** - React bindings for Redux
- **React Window** - For virtualized list performance
- **Modern CSS** - Responsive design with gradients and animations
- **Debounced Search** - 300ms delay for optimal performance

## 📁 Project Structure

```
src/
├── components/
│   ├── PatientRegistrationForm.js  # Part 1 - Registration form
│   ├── DoctorPanel.js             # Part 2 - Doctor queue panel
│   └── Navigation.js              # Navigation between panels
├── store/
│   ├── store.js                   # Redux store configuration
│   └── slices/
│       ├── patientSlice.js        # Patient state management
│       ├── doctorSlice.js         # Doctor data management
│       └── medicineSlice.js       # Medicine data management
├── App.js                         # Main application component
└── App.css                        # Modern styling
```

## 🎯 Key Implementation Details

### State Management
- **Redux Toolkit** for modern Redux implementation
- **Three separate slices**: patients, doctors, and medicines
- **Actions**: addPatient, selectMedicines, markPrescriptionPrinted, removePatient
- **Selectors**: selectAllPatients, selectPatientsByDoctor, selectAllDoctors, selectAllMedicines

### Performance Optimization
- React Window for virtualized scrolling
- Debounced search to prevent excessive filtering
- Efficient re-renders with useMemo

### User Experience
- Modern, responsive UI design
- Color-coded priority system (Red=High, Orange=Medium, Green=Low)
- Intuitive workflow with proper validation
- Real-time updates across panels

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 How to Test the Application

### Testing Patient Registration (Part 1)
1. Fill out the patient registration form
2. Select a doctor from the dropdown
3. Submit the form
4. Patient will be added to the selected doctor's queue

### Testing Doctor Panel (Part 2)
1. Select a doctor from the navigation dropdown
2. View the patient queue with search and sort functionality
3. Click on a patient to select them
4. Choose "Medicine Prescription" from the action dropdown
5. Select medicines from the list
6. Click "Print Prescription"
7. Click "Mark as Done" to complete the workflow

## 🎨 UI Features

- **Gradient backgrounds** for modern appearance
- **Priority color coding** for easy identification
- **Hover effects** and smooth transitions
- **Responsive design** for different screen sizes
- **Form validation** with error messages
- **Loading states** and disabled button states

## 📊 Mock Data Included

- **5 Doctors** with different specializations
- **8 Medicines** with categories (Glaucoma, Dry Eyes, etc.)
- **Sample workflow** ready for testing

## 🔧 Technical Requirements Met

- ✅ React functional components with hooks
- ✅ Form validation and error handling
- ✅ Efficient list rendering with virtualization
- ✅ Debounced search implementation
- ✅ State management with Redux Toolkit
- ✅ Responsive and modern UI design
- ✅ Complete workflow implementation

---

**Assignment completed by:** Arjun  
**Submission Date:** November 12, 2025  
**Development Time:** ~2 hours  

The application is fully functional and ready for demonstration during the interview process.
