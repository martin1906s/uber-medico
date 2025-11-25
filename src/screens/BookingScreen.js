import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useAppContext } from '../context/AppContext';
import { palette } from '../theme/colors';

const appointmentTypes = [
  { key: 'Domicilio', icon: 'home' },
  { key: 'Consultorio', icon: 'medkit' },
  { key: 'Virtual', icon: 'videocam' },
];

const nextFiveDays = Array.from({ length: 5 }).map((_, index) =>
  dayjs().add(index, 'day'),
);

export const BookingScreen = () => {
  const navigation = useNavigation();
  const { selectedDoctor, appointments, setAppointments } = useAppContext();
  const [appointmentType, setAppointmentType] = useState('Domicilio');
  const [selectedDay, setSelectedDay] = useState(nextFiveDays[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = useMemo(() => {
    if (!selectedDoctor) return [];
    return selectedDoctor.availability;
  }, [selectedDoctor]);

  if (!selectedDoctor) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: palette.frost }}>Selecciona un profesional primero.</Text>
      </SafeAreaView>
    );
  }

  const handleBooking = () => {
    if (!selectedSlot) {
      Alert.alert('Selecciona un horario', 'Elige un horario disponible para continuar');
      return;
    }
    const appointment = {
      id: `appt-${Date.now()}`,
      doctor: selectedDoctor,
      type: appointmentType,
      date: selectedDay.format('YYYY-MM-DD'),
      slot: selectedSlot,
      status: 'pendiente de pago',
      price: selectedDoctor.price,
    };
    setAppointments([appointment, ...appointments]);
    navigation.navigate('Payment', { appointmentId: appointment.id });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={palette.frost} />
        </TouchableOpacity>
        <Text style={styles.title}>Agenda inteligente</Text>
      </View>
      <Text style={styles.doctor}>{selectedDoctor.name}</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Tipo de servicio</Text>
        <View style={styles.row}>
          {appointmentTypes.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                appointmentType === option.key && styles.optionActive,
              ]}
              onPress={() => setAppointmentType(option.key)}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={appointmentType === option.key ? palette.jet : palette.neon}
              />
              <Text
                style={[
                  styles.optionText,
                  appointmentType === option.key && styles.optionTextActive,
                ]}
              >
                {option.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Fecha</Text>
        <FlatList
          data={nextFiveDays}
          keyExtractor={(item) => item.format('YYYY-MM-DD')}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.datePill,
                selectedDay.isSame(item, 'day') && styles.datePillActive,
              ]}
              onPress={() => setSelectedDay(item)}
            >
              <Text
                style={[
                  styles.dateLabel,
                  selectedDay.isSame(item, 'day') && styles.dateLabelActive,
                ]}
              >
                {item.format('ddd')}
              </Text>
              <Text
                style={[
                  styles.dateValue,
                  selectedDay.isSame(item, 'day') && styles.dateValueActive,
                ]}
              >
                {item.format('DD')}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Horarios disponibles</Text>
        <View style={styles.slots}>
          {slots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.slot, selectedSlot === slot && styles.slotActive]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedSlot === slot && styles.slotTextActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <View>
          <Text style={styles.caption}>Tarifa estimada</Text>
          <Text style={styles.price}>${selectedDoctor.price} USD</Text>
        </View>
        <TouchableOpacity style={styles.cta} onPress={handleBooking}>
          <Text style={styles.ctaText}>Continuar al pago</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.jet,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: palette.frost,
    fontSize: 20,
    fontWeight: '700',
  },
  doctor: {
    color: palette.slate,
    marginTop: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: palette.slate,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionActive: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  optionText: {
    color: palette.slate,
    fontWeight: '600',
  },
  optionTextActive: {
    color: palette.jet,
  },
  datePill: {
    width: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  datePillActive: {
    backgroundColor: palette.graphite,
  },
  dateLabel: {
    color: palette.slate,
  },
  dateLabelActive: {
    color: palette.neon,
  },
  dateValue: {
    color: palette.frost,
    fontSize: 18,
    fontWeight: '600',
  },
  dateValueActive: { color: palette.frost },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  slot: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  slotActive: {
    backgroundColor: palette.neon,
  },
  slotText: {
    color: palette.frost,
    fontWeight: '600',
  },
  slotTextActive: {
    color: palette.jet,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
    paddingTop: 20,
  },
  caption: {
    color: palette.slate,
  },
  price: {
    color: palette.frost,
    fontSize: 24,
    fontWeight: '700',
  },
  cta: {
    backgroundColor: palette.neon,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  ctaText: {
    color: palette.jet,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.jet,
  },
});

