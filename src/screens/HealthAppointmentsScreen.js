import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';
import { LogoutButton } from '../components/LogoutButton';

export const HealthAppointmentsScreen = () => {
  const navigation = useNavigation();
  const { appointments, setAppointments } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  const [selectedFilter, setSelectedFilter] = useState('todas');
  
  // Datos quemados para demostración - inicializados como estado
  const [localAppointments, setLocalAppointments] = useState([
    {
      id: 'apt-1',
      patientName: 'María González',
      date: '2025-11-28',
      slot: '09:00',
      type: 'Consultorio',
      status: 'confirmada',
      price: 65,
      specialty: 'Cardiología',
      notes: 'Control de presión arterial',
      phone: '+593 99 123 4567',
      email: 'maria.gonzalez@email.com',
    },
    {
      id: 'apt-2',
      patientName: 'Carlos Ramírez',
      date: '2025-11-28',
      slot: '11:30',
      type: 'Domicilio',
      status: 'confirmada',
      price: 80,
      specialty: 'Cardiología',
      notes: 'Revisión post-operatoria',
      phone: '+593 99 234 5678',
      email: 'carlos.ramirez@email.com',
    },
    {
      id: 'apt-3',
      patientName: 'Ana Martínez',
      date: '2025-11-29',
      slot: '14:00',
      type: 'Virtual',
      status: 'confirmada',
      price: 50,
      specialty: 'Cardiología',
      notes: 'Consulta de seguimiento',
      phone: '+593 99 345 6789',
      email: 'ana.martinez@email.com',
    },
    {
      id: 'apt-4',
      patientName: 'Luis Fernández',
      date: '2025-11-29',
      slot: '16:15',
      type: 'Consultorio',
      status: 'pendiente',
      price: 65,
      specialty: 'Cardiología',
      notes: 'Primera consulta',
      phone: '+593 99 456 7890',
      email: 'luis.fernandez@email.com',
    },
    {
      id: 'apt-5',
      patientName: 'Sofía López',
      date: '2025-11-30',
      slot: '10:00',
      type: 'Domicilio',
      status: 'confirmada',
      price: 80,
      specialty: 'Cardiología',
      notes: 'Control rutinario',
      phone: '+593 99 567 8901',
      email: 'sofia.lopez@email.com',
    },
    {
      id: 'apt-6',
      patientName: 'Roberto Sánchez',
      date: '2025-12-01',
      slot: '15:30',
      type: 'Virtual',
      status: 'cancelada',
      price: 50,
      specialty: 'Cardiología',
      notes: 'Consulta cancelada por el paciente',
      phone: '+593 99 678 9012',
      email: 'roberto.sanchez@email.com',
    },
  ]);

  const allAppointments = [...appointments, ...localAppointments];

  const filteredAppointments = allAppointments.filter((apt) => {
    if (selectedFilter === 'todas') return true;
    if (selectedFilter === 'confirmadas') return apt.status === 'confirmada';
    if (selectedFilter === 'pendientes') return apt.status === 'pendiente' || apt.status === 'pendiente de pago';
    if (selectedFilter === 'canceladas') return apt.status === 'cancelada';
    return true;
  });

  const handleCancelAppointment = (appointment) => {
    Alert.alert(
      'Cancelar cita',
      `¿Estás seguro de que deseas cancelar la cita con ${appointment.patientName || appointment.doctor?.name || 'el paciente'}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            // Actualizar citas del contexto si existe
            const contextAppointment = appointments.find((apt) => apt.id === appointment.id);
            if (contextAppointment) {
              const updatedAppointments = appointments.map((apt) =>
                apt.id === appointment.id ? { ...apt, status: 'cancelada' } : apt,
              );
              setAppointments(updatedAppointments);
            } else {
              // Actualizar citas locales (mock)
              setLocalAppointments((prev) =>
                prev.map((apt) =>
                  apt.id === appointment.id ? { ...apt, status: 'cancelada' } : apt,
                ),
              );
            }
            Alert.alert('Cita cancelada', 'La cita ha sido cancelada y el paciente será notificado.');
          },
        },
      ],
    );
  };

  const handleRescheduleAppointment = (appointment) => {
    Alert.alert(
      'Reprogramar cita',
      `¿Deseas reprogramar la cita con ${appointment.patientName || appointment.doctor?.name || 'el paciente'}?\n\nFecha actual: ${appointment.date} a las ${appointment.slot}\n\nSe enviará una solicitud de reprogramación al paciente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar solicitud',
          onPress: () => {
            // Actualizar citas del contexto si existe
            const contextAppointment = appointments.find((apt) => apt.id === appointment.id);
            if (contextAppointment) {
              const updatedAppointments = appointments.map((apt) =>
                apt.id === appointment.id
                  ? { ...apt, status: 'pendiente', notes: `${apt.notes || ''} - Solicitud de reprogramación enviada` }
                  : apt,
              );
              setAppointments(updatedAppointments);
            } else {
              // Actualizar citas locales (mock)
              setLocalAppointments((prev) =>
                prev.map((apt) =>
                  apt.id === appointment.id
                    ? { ...apt, status: 'pendiente', notes: `${apt.notes || ''} - Solicitud de reprogramación enviada` }
                    : apt,
                ),
              );
            }
            Alert.alert(
              'Solicitud enviada',
              'La solicitud de reprogramación ha sido enviada al paciente. Espera su confirmación.',
            );
          },
        },
      ],
    );
  };

  const handleAcceptAppointment = (appointment) => {
    Alert.alert(
      'Aceptar cita',
      `¿Deseas confirmar la cita con ${appointment.patientName || appointment.doctor?.name || 'el paciente'}?\n\nFecha: ${appointment.date}\nHora: ${appointment.slot}\nTipo: ${appointment.type}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: () => {
            // Actualizar citas del contexto si existe
            const contextAppointment = appointments.find((apt) => apt.id === appointment.id);
            if (contextAppointment) {
              const updatedAppointments = appointments.map((apt) =>
                apt.id === appointment.id ? { ...apt, status: 'confirmada' } : apt,
              );
              setAppointments(updatedAppointments);
            } else {
              // Actualizar citas locales (mock)
              setLocalAppointments((prev) =>
                prev.map((apt) =>
                  apt.id === appointment.id ? { ...apt, status: 'confirmada' } : apt,
                ),
              );
            }
            Alert.alert('Cita confirmada', 'La cita ha sido confirmada exitosamente. El paciente será notificado.');
          },
        },
      ],
    );
  };

  const filters = [
    { key: 'todas', label: 'Todas' },
    { key: 'confirmadas', label: 'Confirmadas' },
    { key: 'pendientes', label: 'Pendientes' },
    { key: 'canceladas', label: 'Canceladas' },
  ];

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={palette.frost} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Mis citas</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, dynamicStyles.content]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filters}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  dynamicStyles.filterChip,
                  selectedFilter === filter.key && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    dynamicStyles.filterText,
                    selectedFilter === filter.key && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={palette.slate} />
              <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                No hay citas {selectedFilter !== 'todas' ? selectedFilter : ''}
              </Text>
              <Text style={[styles.emptySubtext, dynamicStyles.emptySubtext]}>
                Las citas aparecerán aquí cuando sean programadas
              </Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => (
              <View
                key={appointment.id}
                style={[styles.appointmentCard, dynamicStyles.appointmentCard]}
              >
                <View style={styles.appointmentHeader}>
                  <View style={styles.patientInfo}>
                    <View style={styles.patientAvatar}>
                      <Ionicons name="person" size={24} color={palette.neon} />
                    </View>
                    <View>
                      <Text style={[styles.patientName, dynamicStyles.patientName]}>
                        {appointment.patientName || 'Paciente'}
                      </Text>
                      {appointment.phone && (
                        <Text style={[styles.patientContact, dynamicStyles.patientContact]}>
                          {appointment.phone}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      appointment.status === 'confirmada' && styles.statusBadgeConfirmed,
                      appointment.status === 'cancelada' && styles.statusBadgeCanceled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        appointment.status === 'confirmada' && styles.statusTextConfirmed,
                        appointment.status === 'cancelada' && styles.statusTextCanceled,
                      ]}
                    >
                      {appointment.status === 'confirmada'
                        ? 'Confirmada'
                        : appointment.status === 'cancelada'
                        ? 'Cancelada'
                        : 'Pendiente'}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={18} color={palette.slate} />
                    <Text style={[styles.detailText, dynamicStyles.detailText]}>
                      {new Date(appointment.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={18} color={palette.slate} />
                    <Text style={[styles.detailText, dynamicStyles.detailText]}>
                      {appointment.slot}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={18} color={palette.slate} />
                    <Text style={[styles.detailText, dynamicStyles.detailText]}>
                      {appointment.type}
                    </Text>
                  </View>
                  {appointment.price && (
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={18} color={palette.lime} />
                      <Text style={[styles.detailPrice, dynamicStyles.detailPrice]}>
                        ${appointment.price} USD
                      </Text>
                    </View>
                  )}
                  {appointment.notes && (
                    <View style={styles.notesContainer}>
                      <Ionicons name="document-text-outline" size={16} color={palette.slate} />
                      <Text style={[styles.notesText, dynamicStyles.notesText]}>
                        {appointment.notes}
                      </Text>
                    </View>
                  )}
                </View>

                {appointment.status !== 'cancelada' && (
                  <View style={styles.actions}>
                    {(appointment.status === 'pendiente' || appointment.status === 'pendiente de pago') && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton, dynamicStyles.actionButton]}
                        onPress={() => handleAcceptAppointment(appointment)}
                      >
                        <Ionicons name="checkmark-circle" size={18} color={palette.jet} />
                        <Text style={[styles.actionButtonText, dynamicStyles.actionButtonText]}>
                          Aceptar
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rescheduleButton, dynamicStyles.actionButton]}
                      onPress={() => handleRescheduleAppointment(appointment)}
                    >
                      <Ionicons name="calendar-outline" size={18} color={palette.neon} />
                      <Text style={[styles.actionButtonTextReschedule, dynamicStyles.actionButtonText]}>
                        Reprogramar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton, dynamicStyles.actionButton]}
                      onPress={() => handleCancelAppointment(appointment)}
                    >
                      <Ionicons name="close-circle" size={18} color={palette.magenta} />
                      <Text style={[styles.actionButtonTextCancel, dynamicStyles.actionButtonText]}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const getDynamicStyles = (width, isSmallDevice) => {
  const basePadding = width < 375 ? 16 : width < 768 ? 20 : 24;
  const baseFontSize = isSmallDevice ? 0.9 : 1;

  return {
    content: {
      paddingHorizontal: basePadding,
      paddingVertical: basePadding * 0.8,
      paddingBottom: basePadding * 2,
    },
    headerTitle: {
      fontSize: Math.min(24 * baseFontSize, width * 0.065),
    },
    filterChip: {
      paddingHorizontal: basePadding * 0.7,
      paddingVertical: basePadding * 0.4,
    },
    filterText: {
      fontSize: 13 * baseFontSize,
    },
    appointmentCard: {
      padding: basePadding,
    },
    patientName: {
      fontSize: 16 * baseFontSize,
    },
    patientContact: {
      fontSize: 12 * baseFontSize,
    },
    detailText: {
      fontSize: 14 * baseFontSize,
    },
    detailPrice: {
      fontSize: 15 * baseFontSize,
    },
    notesText: {
      fontSize: 13 * baseFontSize,
    },
    actionButton: {
      paddingVertical: basePadding * 0.4,
      paddingHorizontal: basePadding * 0.6,
    },
    actionButtonText: {
      fontSize: 13 * baseFontSize,
    },
    emptyText: {
      fontSize: 18 * baseFontSize,
    },
    emptySubtext: {
      fontSize: 14 * baseFontSize,
    },
  };
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15,23,42,0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: palette.frost,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flexGrow: 1,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  filterChipActive: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  filterText: {
    color: palette.slate,
    fontWeight: '600',
  },
  filterTextActive: {
    color: palette.jet,
  },
  appointmentCard: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    marginBottom: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34,211,238,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName: {
    color: palette.frost,
    fontWeight: '600',
  },
  patientContact: {
    color: palette.slate,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(148,163,184,0.2)',
  },
  statusBadgeConfirmed: {
    backgroundColor: 'rgba(163,230,53,0.2)',
  },
  statusBadgeCanceled: {
    backgroundColor: 'rgba(219,39,119,0.2)',
  },
  statusText: {
    color: palette.slate,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusTextConfirmed: {
    color: palette.lime,
  },
  statusTextCanceled: {
    color: palette.magenta,
  },
  appointmentDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    color: palette.slate,
  },
  detailPrice: {
    color: palette.lime,
    fontWeight: '600',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(15,23,42,0.4)',
    borderRadius: 12,
  },
  notesText: {
    color: palette.slate,
    flex: 1,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  acceptButton: {
    backgroundColor: palette.lime,
    borderColor: palette.lime,
  },
  rescheduleButton: {
    backgroundColor: 'rgba(34,211,238,0.2)',
    borderColor: palette.neon,
  },
  cancelButton: {
    backgroundColor: 'rgba(219,39,119,0.2)',
    borderColor: palette.magenta,
  },
  actionButtonText: {
    color: palette.jet,
    fontWeight: '600',
  },
  actionButtonTextReschedule: {
    color: palette.neon,
    fontWeight: '600',
  },
  actionButtonTextCancel: {
    color: palette.magenta,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 16,
  },
  emptyText: {
    color: palette.frost,
    fontWeight: '600',
  },
  emptySubtext: {
    color: palette.slate,
    textAlign: 'center',
  },
});

