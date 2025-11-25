import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useCachedState } from '../hooks/useCachedState';

const AppContext = createContext(null);

export const ROLE_TYPES = {
  USER: 'user',
  HEALTH: 'health',
  ADMIN: 'admin',
};

const defaultAppointments = [];
const defaultProviders = [
  {
    id: 'md-cortes',
    name: 'Dra. Aitana Cortés',
    specialty: 'Cardióloga intervencionista',
    price: 65,
    rating: 4.9,
    distance: 1.2,
    tags: ['Cardiología', 'Alta complejidad', 'Telemedicina'],
    availability: ['09:00', '09:45', '11:30', '16:15'],
    type: ['Domicilio', 'Consultorio'],
    bio: '11 años optimizando respuestas cardiovasculares con soporte remoto asistido.',
    clinic: 'Clínica Horizonte',
    verificationStatus: 'verificado',
  },
  {
    id: 'md-jurado',
    name: 'Dr. Thiago Jurado',
    specialty: 'Dermatólogo clínico y estético',
    price: 42,
    rating: 4.7,
    distance: 3.8,
    tags: ['Dermatología', 'Láser', 'Niños'],
    availability: ['10:00', '12:30', '15:00', '18:40'],
    type: ['Consultorio'],
    bio: 'Protocolos de regeneración avanzada para piel sensible y fototipos altos.',
    clinic: 'DermHub Eclipse',
    verificationStatus: 'verificado',
  },
  {
    id: 'md-salvatierra',
    name: 'Lic. Zoe Salvatierra',
    specialty: 'Enfermera intensivista',
    price: 30,
    rating: 4.8,
    distance: 0.8,
    tags: ['Cuidados críticos', 'Pediatría', 'Seguimiento 24/7'],
    availability: ['08:15', '13:30', '20:15'],
    type: ['Domicilio'],
    bio: 'Estabiliza pacientes pediátricos post-UCI con monitoreo híbrido.',
    clinic: 'Red NeonCare',
    verificationStatus: 'verificado',
  },
];

export const AppProvider = ({ children }) => {
  const [appointments, setAppointments] = useCachedState(
    '@medicConnect/appointments',
    defaultAppointments,
  );
  const [providers, setProviders] = useCachedState(
    '@medicConnect/providers',
    defaultProviders,
  );
  const [subscriptionStatus, setSubscriptionStatus] = useCachedState(
    '@medicConnect/subscription',
    { doctorId: null, plan: 'Pro', renewsAt: '30 días', status: 'pendiente' },
  );
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [role, setRole] = useCachedState('@medicConnect/role', null);

  const login = useCallback((nextRole) => setRole(nextRole), [setRole]);
  const logout = useCallback(() => {
    setRole(null);
    setSelectedDoctor(null);
  }, [setRole, setSelectedDoctor]);

  const value = useMemo(
    () => ({
      appointments,
      setAppointments,
      providers,
      setProviders,
      subscriptionStatus,
      setSubscriptionStatus,
      selectedDoctor,
      setSelectedDoctor,
      role,
      login,
      logout,
    }),
    [
      appointments,
      providers,
      selectedDoctor,
      role,
      setAppointments,
      setProviders,
      setSelectedDoctor,
      setSubscriptionStatus,
      subscriptionStatus,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext debe utilizarse dentro de AppProvider');
  }
  return ctx;
};

