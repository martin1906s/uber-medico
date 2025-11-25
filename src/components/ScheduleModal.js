import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme/colors';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00',
];

export const ScheduleModal = ({ visible, onClose, onSave, initialSchedule }) => {
  const [schedule, setSchedule] = useState(
    initialSchedule || daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {}),
  );
  const [selectedDay, setSelectedDay] = useState('Lunes');

  const toggleTimeSlot = (time) => {
    setSchedule((prev) => {
      const daySchedule = prev[selectedDay] || [];
      const isSelected = daySchedule.includes(time);
      return {
        ...prev,
        [selectedDay]: isSelected
          ? daySchedule.filter((t) => t !== time)
          : [...daySchedule, time].sort(),
      };
    });
  };

  const handleSave = () => {
    // Convertir a formato de string para el formulario
    const scheduleString = Object.entries(schedule)
      .filter(([_, times]) => times.length > 0)
      .map(([day, times]) => `${day}: ${times.join(', ')}`)
      .join(' | ');
    
    onSave(scheduleString, schedule);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Configurar Horarios</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={palette.frost} />
            </TouchableOpacity>
          </View>

          <View style={styles.daysContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDay === day && styles.dayButtonActive,
                    schedule[day]?.length > 0 && styles.dayButtonHasSchedule,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDay === day && styles.dayTextActive,
                    ]}
                  >
                    {day.substring(0, 3)}
                  </Text>
                  {schedule[day]?.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{schedule[day].length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.selectedDayContainer}>
            <Text style={styles.selectedDayText}>{selectedDay}</Text>
            <Text style={styles.selectedDaySubtext}>
              {schedule[selectedDay]?.length > 0
                ? `${schedule[selectedDay].length} horarios seleccionados`
                : 'Selecciona los horarios disponibles'}
            </Text>
          </View>

          <ScrollView style={styles.timeSlotsContainer}>
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((time) => {
                const isSelected = schedule[selectedDay]?.includes(time);
                return (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      isSelected && styles.timeSlotSelected,
                    ]}
                    onPress={() => toggleTimeSlot(time)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        isSelected && styles.timeSlotTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color={palette.jet} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: palette.jet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  title: {
    color: palette.frost,
    fontSize: 20,
    fontWeight: '700',
  },
  daysContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginHorizontal: 6,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    minWidth: 70,
    alignItems: 'center',
    position: 'relative',
  },
  dayButtonActive: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  dayButtonHasSchedule: {
    borderColor: palette.lime,
  },
  dayText: {
    color: palette.slate,
    fontWeight: '600',
  },
  dayTextActive: {
    color: palette.jet,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: palette.lime,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: palette.jet,
    fontSize: 10,
    fontWeight: '700',
  },
  selectedDayContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  selectedDayText: {
    color: palette.frost,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedDaySubtext: {
    color: palette.slate,
    fontSize: 14,
  },
  timeSlotsContainer: {
    maxHeight: 300,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    backgroundColor: 'rgba(15,23,42,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  timeSlotSelected: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  timeSlotText: {
    color: palette.frost,
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: palette.jet,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.2)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: palette.slate,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: palette.neon,
    alignItems: 'center',
  },
  saveButtonText: {
    color: palette.jet,
    fontWeight: '700',
  },
});

