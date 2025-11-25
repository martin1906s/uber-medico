import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';

export const AdminDashboardScreen = () => {
  const { providers, appointments, setProviders } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  const pending = providers.filter((p) => p.verificationStatus === 'pendiente');
  const confirmedAppointments = appointments.filter((appt) => appt.status === 'confirmada');

  const handleScanBatch = () => {
    Alert.alert(
      'Escanear lote',
      `Se escanearán ${pending.length} solicitudes pendientes. Esta función procesará múltiples verificaciones en lote.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Escanear',
          onPress: () => {
            Alert.alert('Procesando', 'Escaneando documentos en lote...');
            // Simulación: después de 1 segundo, mostrar resultado
            setTimeout(() => {
              Alert.alert('Lote procesado', `${pending.length} solicitudes escaneadas correctamente.`);
            }, 1000);
          },
        },
      ],
    );
  };

  const handleVerifyProvider = (provider) => {
    Alert.alert(
      'Validar médico',
      `¿Deseas validar a ${provider.name}? Esta acción cambiará su estado a verificado.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Validar',
          onPress: () => {
            const updatedProviders = providers.map((p) =>
              p.id === provider.id ? { ...p, verificationStatus: 'verificado' } : p,
            );
            setProviders(updatedProviders);
            Alert.alert('Validado', `${provider.name} ha sido verificado exitosamente.`);
          },
        },
      ],
    );
  };

  const handleGeneratePayout = () => {
    const totalRevenue = confirmedAppointments.reduce((sum, appt) => sum + appt.price, 0);
    const doctorShare = totalRevenue * 0.8;
    const adminShare = totalRevenue * 0.2;

    Alert.alert(
      'Generar payout simulado',
      `Total recaudado: $${totalRevenue} USD\n\nDistribución:\n• Médicos: $${doctorShare.toFixed(2)} USD (80%)\n• Administrador: $${adminShare.toFixed(2)} USD (20%)`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Generar',
          onPress: () => {
            Alert.alert(
              'Payout generado',
              `Se ha generado el payout simulado:\n\n• ${confirmedAppointments.length} citas procesadas\n• Total: $${totalRevenue} USD\n• Distribución completada`,
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={[styles.content, dynamicStyles.content]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, dynamicStyles.title]}>Centro administrativo</Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
          Control en tiempo real de verificaciones y comisiones.
        </Text>
        <View style={[styles.metrics, dynamicStyles.metrics]}>
          <Metric
            icon="shield-checkmark"
            label="Pendientes de validación"
            value={pending.length}
            trend="+2 en 24h"
            isSmallDevice={isSmallDevice}
            width={width}
          />
          <Metric
            icon="cash"
            label="Recaudado hoy"
            value={`$${confirmedAppointments.reduce((sum, appt) => sum + appt.price, 0)}`}
            trend="20% app · 80% médicos"
            isSmallDevice={isSmallDevice}
            width={width}
          />
          <Metric
            icon="pulse"
            label="Citas confirmadas"
            value={confirmedAppointments.length}
            trend="97% SLA"
            isSmallDevice={isSmallDevice}
            width={width}
          />
        </View>
        <View style={[styles.card, dynamicStyles.card]}>
          <View style={[styles.cardHeader, dynamicStyles.cardHeader]}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>Verificación documental</Text>
            <TouchableOpacity 
              style={[styles.action, dynamicStyles.action]}
              onPress={handleScanBatch}
            >
              <Ionicons name="scan-outline" size={isSmallDevice ? 14 : 16} color={palette.neon} />
              <Text style={[styles.actionText, dynamicStyles.actionText]}>Escanear lote</Text>
            </TouchableOpacity>
          </View>
          {pending.length === 0 ? (
            <Text style={[styles.empty, dynamicStyles.empty]}>
              No hay médicos pendientes. Todo en orden.
            </Text>
          ) : (
            pending.map((provider) => (
              <View key={provider.id} style={[styles.row, dynamicStyles.row]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.provider, dynamicStyles.provider]}>{provider.name}</Text>
                  <Text style={[styles.providerMeta, dynamicStyles.providerMeta]}>
                    {provider.specialty} · Licencia {provider.id.split('-')[1]}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.verifyButton, dynamicStyles.verifyButton]}
                  onPress={() => handleVerifyProvider(provider)}
                >
                  <Text style={[styles.verifyText, dynamicStyles.verifyText]}>Validar</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        <View style={[styles.card, dynamicStyles.card]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>Distribución de ingresos</Text>
            <Text style={[styles.caption, dynamicStyles.caption]}>Simulación automática</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={[styles.payoutLabel, dynamicStyles.payoutLabel]}>Médicos</Text>
            <Text style={[styles.payoutValue, dynamicStyles.payoutValue]}>80%</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={[styles.payoutLabel, dynamicStyles.payoutLabel]}>Administrador</Text>
            <Text style={[styles.payoutValue, dynamicStyles.payoutValue]}>20%</Text>
          </View>
          <TouchableOpacity 
            style={[styles.primary, dynamicStyles.primary]}
            onPress={handleGeneratePayout}
          >
            <Text style={[styles.primaryText, dynamicStyles.primaryText]}>
              Generar payout simulado
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Metric = ({ icon, label, value, trend, isSmallDevice, width }) => {
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  return (
    <View style={[styles.metric, dynamicStyles.metric]}>
      <Ionicons name={icon} size={isSmallDevice ? 20 : 22} color={palette.neon} />
      <Text style={[styles.metricValue, dynamicStyles.metricValue]}>{value}</Text>
      <Text style={[styles.metricLabel, dynamicStyles.metricLabel]}>{label}</Text>
      <Text style={[styles.metricTrend, dynamicStyles.metricTrend]}>{trend}</Text>
    </View>
  );
};

const getDynamicStyles = (width, isSmallDevice) => {
  const basePadding = width < 375 ? 16 : width < 768 ? 20 : 24;
  const baseFontSize = isSmallDevice ? 0.9 : 1;
  const metricWidth = width < 375 ? '100%' : width < 768 ? '48%' : '32%';
  
  return {
    content: {
      paddingHorizontal: basePadding,
      paddingVertical: basePadding * 0.8,
      paddingBottom: basePadding * 1.5,
    },
    title: {
      fontSize: Math.min(24 * baseFontSize, width * 0.065),
    },
    subtitle: {
      fontSize: 14 * baseFontSize,
    },
    metrics: {
      gap: basePadding * 0.6,
    },
    metric: {
      width: metricWidth,
      padding: basePadding * 0.8,
    },
    metricValue: {
      fontSize: 22 * baseFontSize,
      marginTop: 8,
    },
    metricLabel: {
      fontSize: 12 * baseFontSize,
    },
    metricTrend: {
      fontSize: 11 * baseFontSize,
    },
    card: {
      padding: basePadding * 0.9,
    },
    cardHeader: {
      flexWrap: 'wrap',
      gap: basePadding * 0.5,
    },
    cardTitle: {
      fontSize: 16 * baseFontSize,
    },
    action: {
      paddingHorizontal: basePadding * 0.6,
      paddingVertical: basePadding * 0.3,
    },
    actionText: {
      fontSize: 12 * baseFontSize,
    },
    empty: {
      fontSize: 13 * baseFontSize,
    },
    row: {
      paddingVertical: basePadding * 0.6,
    },
    provider: {
      fontSize: 15 * baseFontSize,
    },
    providerMeta: {
      fontSize: 12 * baseFontSize,
    },
    verifyButton: {
      paddingHorizontal: basePadding * 0.8,
      paddingVertical: basePadding * 0.4,
    },
    verifyText: {
      fontSize: 12 * baseFontSize,
    },
    caption: {
      fontSize: 12 * baseFontSize,
    },
    payoutLabel: {
      fontSize: 13 * baseFontSize,
    },
    payoutValue: {
      fontSize: 15 * baseFontSize,
    },
    primary: {
      paddingVertical: basePadding * 0.7,
    },
    primaryText: {
      fontSize: 14 * baseFontSize,
    },
  };
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.jet,
  },
  content: {
    gap: 16,
  },
  title: {
    color: palette.frost,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.slate,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metric: {
    backgroundColor: palette.graphite,
    borderRadius: 20,
  },
  metricValue: {
    color: palette.frost,
    fontWeight: '700',
  },
  metricLabel: {
    color: palette.slate,
  },
  metricTrend: {
    color: palette.neon,
    marginTop: 4,
  },
  card: {
    backgroundColor: palette.graphite,
    borderRadius: 20,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: palette.frost,
    fontWeight: '600',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(34,211,238,0.2)',
  },
  actionText: {
    color: palette.neon,
    fontWeight: '600',
  },
  empty: {
    color: palette.slate,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
  },
  provider: {
    color: palette.frost,
    fontWeight: '600',
  },
  providerMeta: {
    color: palette.slate,
  },
  verifyButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.neon,
  },
  verifyText: {
    color: palette.neon,
    fontWeight: '600',
  },
  caption: {
    color: palette.slate,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  payoutLabel: {
    color: palette.slate,
  },
  payoutValue: {
    color: palette.frost,
    fontWeight: '600',
  },
  primary: {
    marginTop: 10,
    backgroundColor: palette.neon,
    borderRadius: 20,
    alignItems: 'center',
  },
  primaryText: {
    color: palette.jet,
    fontWeight: '700',
  },
});

