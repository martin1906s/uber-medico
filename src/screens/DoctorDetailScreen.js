import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';

export const DoctorDetailScreen = () => {
  const navigation = useNavigation();
  const { selectedDoctor } = useAppContext();

  if (!selectedDoctor) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: palette.frost }}>Selecciona un profesional primero.</Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={palette.frost} />
          </TouchableOpacity>
          <View style={styles.hero}>
            <Text style={styles.specialty}>{selectedDoctor.specialty}</Text>
            <Text style={styles.name}>{selectedDoctor.name}</Text>
            <View style={styles.meta}>
              <Ionicons name="shield-checkmark" size={16} color={palette.lime} />
              <Text style={styles.metaText}>Verificado · {selectedDoctor.clinic}</Text>
            </View>
            <View style={styles.meta}>
              <Ionicons name="time" size={16} color={palette.neon} />
              <Text style={styles.metaText}>Disponibilidad inmediata</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tarifa dinámica</Text>
            <View style={styles.row}>
              <View>
                <Text style={styles.price}>${selectedDoctor.price} USD</Text>
                <Text style={styles.caption}>Por consulta confirmada</Text>
              </View>
              <View style={styles.pill}>
                <Ionicons name="flash" size={14} color={palette.jet} />
                <Text style={styles.pillText}>80% médico · 20% app</Text>
              </View>
            </View>
            <View style={styles.tags}>
              {selectedDoctor.type.map((type) => (
                <Text key={type} style={styles.tag}>
                  {type}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Narrativa clínica</Text>
            <Text style={styles.description}>{selectedDoctor.bio}</Text>
            <Text style={[styles.description, styles.highlight]}>
              Disponibilidad hoy: {selectedDoctor.availability.join(' · ')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cta}
            onPress={() => navigation.navigate('Booking')}
          >
            <Ionicons name="sparkles" size={20} color={palette.jet} />
            <Text style={styles.ctaText}>Reservar consulta híbrida</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.jet,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  hero: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    padding: 20,
    marginBottom: 20,
  },
  specialty: {
    color: palette.neon,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  name: {
    color: palette.frost,
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  metaText: { color: palette.slate },
  card: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    color: palette.frost,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  price: {
    color: palette.frost,
    fontSize: 32,
    fontWeight: '700',
  },
  caption: {
    color: palette.slate,
  },
  pill: {
    backgroundColor: palette.neon,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillText: {
    color: palette.jet,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    color: palette.frost,
    borderColor: 'rgba(248,250,252,0.2)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  description: {
    color: palette.slate,
    lineHeight: 20,
  },
  highlight: {
    marginTop: 12,
    color: palette.neon,
  },
  cta: {
    backgroundColor: palette.neon,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    color: palette.jet,
    fontWeight: '700',
    fontSize: 16,
  },
});

