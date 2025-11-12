import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import patientSlice from './slices/patientSlice';
import doctorSlice from './slices/doctorSlice';
import medicineSlice from './slices/medicineSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['patients'] // Only persist patients data
};

const rootReducer = combineReducers({
  patients: patientSlice,
  doctors: doctorSlice,
  medicines: medicineSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER'
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
