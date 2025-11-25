import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { PaymentSteps } from '../components/PaymentSteps';
import { palette } from '../theme/colors';

export const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointments, setAppointments } = useAppContext();
  const { appointmentId } = route.params || {};
  const targetAppointment = appointments.find((appt) => appt.id === appointmentId);
  const [processing, setProcessing] = useState(false);
  const [steps, setSteps] = useState([
    {
      label: 'Tokenización de tarjeta',
      description: 'Encriptando información para Stripe-sandbox',
      status: 'pending',
    },
    {
      label: 'Autorización 3DS',
      description: 'Validando identidad biométrica simulada',
      status: 'pending',
    },
    {
      label: 'Distribución de comisión',
      description: '80% médico · 20% administrator',
      status: 'pending',
    },
  ]);

  useEffect(() => {
    if (!targetAppointment) return;
    navigation.setOptions?.({ title: 'Simulación de pago' });
  }, [navigation, targetAppointment]);

  const handlePayment = () => {
    if (!targetAppointment) {
      Alert.alert('Sin reserva activa', 'Genera una reserva antes de pagar.');
      return;
    }
    if (processing) return;

    setProcessing(true);
    const updatedSteps = [...steps];
    const runStep = (index) => {
      if (index >= updatedSteps.length) {
        finalizeAppointment();
        return;
      }
      updatedSteps[index] = { ...updatedSteps[index], status: 'in-progress' };
      setSteps([...updatedSteps]);
      setTimeout(() => {
        updatedSteps[index] = { ...updatedSteps[index], status: 'done' };
        setSteps([...updatedSteps]);
        runStep(index + 1);
      }, 900);
    };
    runStep(0);
  };

  const finalizeAppointment = () => {
    const updatedAppointments = appointments.map((appt) =>
      appt.id === appointmentId ? { ...appt, status: 'confirmada' } : appt,
    );
    setAppointments(updatedAppointments);
    setProcessing(false);
    
    // Mostrar mensaje de éxito y redirigir
    Alert.alert(
      '✅ Pago exitoso',
      `La cita con ${targetAppointment?.doctor?.name || 'el profesional'} ha sido confirmada y enrutada.\n\nFecha: ${targetAppointment?.date}\nHora: ${targetAppointment?.slot}\nTotal: $${targetAppointment?.price} USD`,
      [
        {
          text: 'Ver mis citas',
          onPress: () => {
            // Navegar a UserTabs y luego al tab Bookings
            navigation.navigate('UserTabs', { screen: 'Bookings' });
          },
        },
      ],
    );
    
    // Redirigir automáticamente después de 2.5 segundos
    setTimeout(() => {
      navigation.navigate('UserTabs', { screen: 'Bookings' });
    }, 2500);
  };

  const summary = useMemo(() => {
    if (!targetAppointment) return null;
    return [
      { label: 'Profesional', value: targetAppointment.doctor.name },
      {
        label: 'Modalidad',
        value: `${targetAppointment.type} · ${targetAppointment.slot}`,
      },
      { label: 'Fecha', value: targetAppointment.date },
      { label: 'Total', value: `$${targetAppointment.price} USD` },
    ];
  }, [targetAppointment]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={palette.frost} />
        </TouchableOpacity>
        <Text style={styles.title}>Pasarela simulada</Text>
      </View>
      {summary && (
        <View style={styles.summary}>
          {summary.map((item) => (
            <View key={item.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
      <PaymentSteps steps={steps} />
      <TouchableOpacity
        style={[styles.primary, processing && styles.disabled]}
        onPress={handlePayment}
        disabled={processing}
      >
        <Text style={styles.primaryText}>
          {processing ? 'Procesando...' : 'Simular cobro seguro'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.secondary} 
        onPress={() => {
          Alert.alert(
            'Liquidación administrativa',
            'Para ver la liquidación administrativa, debes iniciar sesión como administrador.',
            [{ text: 'Entendido' }],
          );
        }}
      >
        <Text style={styles.secondaryText}>Ver liquidación administrativa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.jet,
    padding: 20,
    gap: 16,
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
  summary: {
    backgroundColor: palette.graphite,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: { color: palette.slate },
  summaryValue: { color: palette.frost, fontWeight: '600' },
  primary: {
    marginTop: 'auto',
    backgroundColor: palette.neon,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  primaryText: {
    color: palette.jet,
    fontWeight: '700',
  },
  secondary: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
  },
  secondaryText: { color: palette.slate },
  disabled: { opacity: 0.6 },
});

