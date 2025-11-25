import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';
import { LogoutButton } from '../components/LogoutButton';

export const HealthHomeScreen = () => {
  const navigation = useNavigation();
  const { appointments, providers } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);

  // Datos quemados para demostración
  const mockAppointments = [
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
    },
  ];

  // Combinar citas reales con datos mock
  const allAppointments = [...appointments, ...mockAppointments];
  const myAppointments = allAppointments.filter((apt) => apt.status === 'confirmada');
  const pendingAppointments = allAppointments.filter((apt) => apt.status === 'pendiente' || apt.status === 'pendiente de pago');
  
  // Estadísticas con datos mock
  const confirmedCount = myAppointments.length || 8;
  const pendingCount = pendingAppointments.length || 3;
  const todayAppointments = myAppointments.filter((apt) => apt.date === '2025-11-28').length || 2;

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, dynamicStyles.content]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, dynamicStyles.greeting]}>Bienvenido, Dr. María González</Text>
              <Text style={[styles.title, dynamicStyles.title]}>Panel de personal de salud</Text>
            </View>
            <LogoutButton />
          </View>

          <View style={styles.stats}>
            <View style={[styles.statCard, dynamicStyles.statCard]}>
              <Ionicons name="calendar" size={24} color={palette.neon} />
              <Text style={[styles.statValue, dynamicStyles.statValue]}>
                {confirmedCount}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Citas confirmadas</Text>
            </View>
            <View style={[styles.statCard, dynamicStyles.statCard]}>
              <Ionicons name="time-outline" size={24} color={palette.neon} />
              <Text style={[styles.statValue, dynamicStyles.statValue]}>
                {pendingCount}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Pendientes</Text>
            </View>
            <View style={[styles.statCard, dynamicStyles.statCard]}>
              <Ionicons name="today-outline" size={24} color={palette.neon} />
              <Text style={[styles.statValue, dynamicStyles.statValue]}>
                {todayAppointments}
              </Text>
              <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Hoy</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Accesos rápidos</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionCard, dynamicStyles.actionCard]}
                onPress={() => navigation.navigate('ProviderOnboarding')}
              >
                <Ionicons name="person-outline" size={28} color={palette.neon} />
                <Text style={[styles.actionTitle, dynamicStyles.actionTitle]}>
                  Mi perfil
                </Text>
                <Text style={[styles.actionDescription, dynamicStyles.actionDescription]}>
                  Gestiona tu información profesional
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, dynamicStyles.actionCard]}
                onPress={() => navigation.navigate('HealthAppointments')}
              >
                <Ionicons name="calendar-outline" size={28} color={palette.neon} />
                <Text style={[styles.actionTitle, dynamicStyles.actionTitle]}>
                  Mis citas
                </Text>
                <Text style={[styles.actionDescription, dynamicStyles.actionDescription]}>
                  Ver y gestionar citas programadas
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Próximas citas</Text>
              <TouchableOpacity onPress={() => navigation.navigate('HealthAppointments')}>
                <Text style={[styles.seeAll, dynamicStyles.seeAll]}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {myAppointments.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={palette.slate} />
                <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                  No tienes citas programadas
                </Text>
                <Text style={[styles.emptySubtext, dynamicStyles.emptySubtext]}>
                  Las citas confirmadas aparecerán aquí
                </Text>
              </View>
            ) : (
              myAppointments.slice(0, 4).map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  style={[styles.appointmentCard, dynamicStyles.appointmentCard]}
                  onPress={() => navigation.navigate('HealthAppointments')}
                  activeOpacity={0.7}
                >
                  <View style={styles.appointmentHeader}>
                    <View style={styles.patientInfo}>
                      <View style={styles.patientAvatar}>
                        <Ionicons name="person" size={20} color={palette.neon} />
                      </View>
                      <View>
                        <Text style={[styles.appointmentPatient, dynamicStyles.appointmentPatient]}>
                          {appointment.patientName || appointment.doctor?.name || 'Paciente'}
                        </Text>
                        {appointment.notes && (
                          <Text style={[styles.appointmentNotes, dynamicStyles.appointmentNotes]}>
                            {appointment.notes}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={[
                      styles.appointmentBadge,
                      appointment.status === 'confirmada' && styles.appointmentBadgeConfirmed
                    ]}>
                      <Text style={[
                        styles.appointmentBadgeText,
                        appointment.status === 'confirmada' && styles.appointmentBadgeTextConfirmed
                      ]}>
                        {appointment.status === 'confirmada' ? 'Confirmada' : appointment.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <View style={styles.appointmentDetail}>
                      <Ionicons name="calendar-outline" size={16} color={palette.slate} />
                      <Text style={[styles.appointmentText, dynamicStyles.appointmentText]}>
                        {new Date(appointment.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                    <View style={styles.appointmentDetail}>
                      <Ionicons name="time-outline" size={16} color={palette.slate} />
                      <Text style={[styles.appointmentText, dynamicStyles.appointmentText]}>
                        {appointment.slot}
                      </Text>
                    </View>
                    <View style={styles.appointmentDetail}>
                      <Ionicons name="location-outline" size={16} color={palette.slate} />
                      <Text style={[styles.appointmentText, dynamicStyles.appointmentText]}>
                        {appointment.type}
                      </Text>
                    </View>
                    {appointment.price && (
                      <View style={styles.appointmentDetail}>
                        <Ionicons name="cash-outline" size={16} color={palette.lime} />
                        <Text style={[styles.appointmentPrice, dynamicStyles.appointmentPrice]}>
                          ${appointment.price} USD
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Resumen del día</Text>
            <View style={[styles.summaryCard, dynamicStyles.summaryCard]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, dynamicStyles.summaryLabel]}>Citas programadas hoy</Text>
                <Text style={[styles.summaryValue, dynamicStyles.summaryValue]}>{todayAppointments}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, dynamicStyles.summaryLabel]}>Ingresos estimados</Text>
                <Text style={[styles.summaryValue, dynamicStyles.summaryValue]}>
                  ${myAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0)} USD
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, dynamicStyles.summaryLabel]}>Calificación promedio</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={palette.lime} />
                  <Text style={[styles.summaryValue, dynamicStyles.summaryValue]}>4.8</Text>
                </View>
              </View>
            </View>
          </View>
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
    greeting: {
      fontSize: 14 * baseFontSize,
    },
    title: {
      fontSize: Math.min(24 * baseFontSize, width * 0.065),
    },
    statCard: {
      padding: basePadding * 0.8,
    },
    statValue: {
      fontSize: 28 * baseFontSize,
    },
    statLabel: {
      fontSize: 12 * baseFontSize,
    },
    sectionTitle: {
      fontSize: 18 * baseFontSize,
    },
    actionCard: {
      padding: basePadding,
    },
    actionTitle: {
      fontSize: 16 * baseFontSize,
    },
    actionDescription: {
      fontSize: 13 * baseFontSize,
    },
    appointmentCard: {
      padding: basePadding * 0.8,
    },
    appointmentPatient: {
      fontSize: 16 * baseFontSize,
    },
    appointmentText: {
      fontSize: 13 * baseFontSize,
    },
    emptyText: {
      fontSize: 16 * baseFontSize,
    },
    emptySubtext: {
      fontSize: 13 * baseFontSize,
    },
    seeAll: {
      fontSize: 14 * baseFontSize,
    },
    appointmentNotes: {
      fontSize: 12 * baseFontSize,
    },
    appointmentPrice: {
      fontSize: 13 * baseFontSize,
    },
    summaryCard: {
      padding: basePadding,
    },
    summaryLabel: {
      fontSize: 13 * baseFontSize,
    },
    summaryValue: {
      fontSize: 15 * baseFontSize,
    },
  };
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    color: palette.slate,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: palette.frost,
    fontWeight: '700',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    color: palette.frost,
    fontWeight: '700',
  },
  statLabel: {
    color: palette.slate,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: palette.frost,
    fontWeight: '600',
  },
  seeAll: {
    color: palette.neon,
    fontWeight: '600',
  },
  quickActions: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    color: palette.frost,
    fontWeight: '600',
  },
  actionDescription: {
    color: palette.slate,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    marginBottom: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34,211,238,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentPatient: {
    color: palette.frost,
    fontWeight: '600',
  },
  appointmentNotes: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 2,
  },
  appointmentBadge: {
    backgroundColor: 'rgba(148,163,184,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appointmentBadgeConfirmed: {
    backgroundColor: 'rgba(163,230,53,0.2)',
  },
  appointmentBadgeText: {
    color: palette.slate,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  appointmentBadgeTextConfirmed: {
    color: palette.lime,
  },
  appointmentDetails: {
    gap: 8,
  },
  appointmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appointmentText: {
    color: palette.slate,
  },
  appointmentPrice: {
    color: palette.lime,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: palette.slate,
  },
  summaryValue: {
    color: palette.frost,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
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

