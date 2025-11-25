import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme/colors';

// Lista completa de especialidades médicas organizadas por área
const medicalSpecialties = {
  'Medicina General': [
    'Medicina General',
    'Medicina Familiar',
    'Medicina Interna',
    'Medicina de Urgencias',
  ],
  'Cardiología': [
    'Cardiología',
    'Cardiología Intervencionista',
    'Electrofisiología Cardíaca',
    'Cardiología Pediátrica',
  ],
  'Neurología': [
    'Neurología',
    'Neurocirugía',
    'Neurología Pediátrica',
    'Neurofisiología Clínica',
  ],
  'Pediatría': [
    'Pediatría',
    'Neonatología',
    'Pediatría Intensiva',
    'Cardiología Pediátrica',
  ],
  'Ginecología y Obstetricia': [
    'Ginecología',
    'Obstetricia',
    'Ginecología Oncológica',
    'Medicina Reproductiva',
  ],
  'Cirugía': [
    'Cirugía General',
    'Cirugía Plástica',
    'Cirugía Cardiovascular',
    'Neurocirugía',
    'Cirugía Pediátrica',
    'Cirugía Oncológica',
  ],
  'Dermatología': [
    'Dermatología',
    'Dermatología Estética',
    'Dermatología Pediátrica',
  ],
  'Oftalmología': [
    'Oftalmología',
    'Retina y Vítreo',
    'Córnea y Segmento Anterior',
  ],
  'Otorrinolaringología': [
    'Otorrinolaringología',
    'Cirugía de Cabeza y Cuello',
  ],
  'Traumatología': [
    'Traumatología y Ortopedia',
    'Cirugía de Mano',
    'Medicina Deportiva',
  ],
  'Psiquiatría': [
    'Psiquiatría',
    'Psiquiatría Infantil',
    'Psiquiatría Geriátrica',
  ],
  'Oncología': [
    'Oncología Médica',
    'Oncología Pediátrica',
    'Radioterapia',
  ],
  'Anestesiología': [
    'Anestesiología',
    'Medicina del Dolor',
  ],
  'Radiología': [
    'Radiología',
    'Radiología Intervencionista',
    'Medicina Nuclear',
  ],
  'Medicina del Trabajo': [
    'Medicina del Trabajo',
    'Medicina Aeroespacial',
  ],
  'Medicina Deportiva': [
    'Medicina Deportiva',
    'Fisiología del Ejercicio',
  ],
  'Enfermería': [
    'Enfermería General',
    'Enfermería Intensivista',
    'Enfermería Pediátrica',
    'Enfermería Obstétrica',
  ],
};

// Convertir a lista plana para búsqueda
const allSpecialties = Object.values(medicalSpecialties).flat();

export const SpecialtySelector = ({ value, onSelect, dynamicStyles }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpecialties = useMemo(() => {
    if (!searchQuery) {
      return Object.entries(medicalSpecialties);
    }
    const query = searchQuery.toLowerCase();
    const filtered = {};
    Object.entries(medicalSpecialties).forEach(([area, specialties]) => {
      const matching = specialties.filter((spec) =>
        spec.toLowerCase().includes(query) || area.toLowerCase().includes(query),
      );
      if (matching.length > 0) {
        filtered[area] = matching;
      }
    });
    return Object.entries(filtered);
  }, [searchQuery]);

  const handleSelect = (specialty) => {
    onSelect(specialty);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.selector, dynamicStyles?.selector]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectorText, dynamicStyles?.selectorText, !value && styles.placeholder]}>
          {value || 'Selecciona una especialidad'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={palette.slate} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Especialidad</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={palette.frost} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={palette.slate} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar especialidad..."
                placeholderTextColor={palette.slate}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
            </View>

            <FlatList
              data={filteredSpecialties}
              keyExtractor={(item) => item[0]}
              renderItem={({ item: [area, specialties] }) => (
                <View style={styles.areaSection}>
                  <Text style={styles.areaTitle}>{area}</Text>
                  {specialties.map((specialty) => (
                    <TouchableOpacity
                      key={specialty}
                      style={[
                        styles.specialtyItem,
                        value === specialty && styles.specialtyItemSelected,
                      ]}
                      onPress={() => handleSelect(specialty)}
                    >
                      <Text
                        style={[
                          styles.specialtyText,
                          value === specialty && styles.specialtyTextSelected,
                        ]}
                      >
                        {specialty}
                      </Text>
                      {value === specialty && (
                        <Ionicons name="checkmark" size={20} color={palette.neon} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No se encontraron especialidades</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorText: {
    color: palette.frost,
    flex: 1,
  },
  placeholder: {
    color: 'rgba(248,250,252,0.4)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: palette.jet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  modalTitle: {
    color: palette.frost,
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.8)',
    margin: 16,
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: palette.frost,
    paddingVertical: 12,
  },
  areaSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  areaTitle: {
    color: palette.neon,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  specialtyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  specialtyItemSelected: {
    backgroundColor: 'rgba(34,211,238,0.2)',
    borderWidth: 1,
    borderColor: palette.neon,
  },
  specialtyText: {
    color: palette.frost,
    fontSize: 15,
  },
  specialtyTextSelected: {
    color: palette.neon,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: palette.slate,
  },
});

