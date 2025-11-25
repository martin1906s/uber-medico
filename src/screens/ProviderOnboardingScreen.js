import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { useDimensions } from '../hooks/useDimensions';

const steps = [
  { key: 'profile', title: 'Perfil profesional' },
  { key: 'coverage', title: 'Cobertura y modalidad' },
  { key: 'compliance', title: 'Credenciales' },
];

export const ProviderOnboardingScreen = () => {
  const { providers, setProviders, subscriptionStatus, setSubscriptionStatus } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    license: '',
    coverage: '',
    price: '',
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.specialty || !form.license) {
      Alert.alert('Información incompleta', 'Completa los campos obligatorios.');
      return;
    }
    const newProvider = {
      id: `pending-${Date.now()}`,
      name: form.name,
      specialty: form.specialty,
      price: Number(form.price) || 40,
      rating: 0,
      distance: 0,
      tags: [form.coverage || 'General'],
      availability: ['09:00', '11:00', '16:00'],
      type: ['Consultorio', 'Virtual'],
      bio: 'Profesional en proceso de verificación documental.',
      clinic: 'A determinar',
      verificationStatus: 'pendiente',
    };
    setProviders([newProvider, ...providers]);
    setSubscriptionStatus({
      doctorId: newProvider.id,
      plan: 'Pro',
      renewsAt: '30 días',
      status: 'pendiente',
    });
    Alert.alert('Registro enviado', 'El equipo legal revisará tus documentos en menos de 24h.');
    setForm({ name: '', specialty: '', license: '', coverage: '', price: '' });
    setCurrentStep(0);
  };

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.heading, dynamicStyles.heading]}>Únete como profesional</Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            Validamos tu licencia, suscripción y cobertura para conectar pacientes en tiempo real.
          </Text>
          <View style={[styles.stepper, dynamicStyles.stepper]}>
            {steps.map((step, index) => (
              <View key={step.key} style={[styles.step, dynamicStyles.step]}>
                <View
                  style={[
                    styles.bullet,
                    dynamicStyles.bullet,
                    index === currentStep && styles.bulletActive,
                    index < currentStep && styles.bulletDone,
                  ]}
                >
                  <Text style={[styles.bulletText, dynamicStyles.bulletText]}>{index + 1}</Text>
                </View>
                <Text style={[styles.stepLabel, dynamicStyles.stepLabel]}>{step.title}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.formCard, dynamicStyles.formCard]}>
          {currentStep === 0 && (
            <>
              <Label text="Nombre completo" />
              <Input value={form.name} onChangeText={(v) => updateField('name', v)} />
              <Label text="Especialidad" />
              <Input value={form.specialty} onChangeText={(v) => updateField('specialty', v)} />
            </>
          )}
          {currentStep === 1 && (
            <>
              <Label text="Cobertura preferida" />
              <Input
                value={form.coverage}
                onChangeText={(v) => updateField('coverage', v)}
                placeholder="Ej. Cardiología a domicilio"
              />
              <Label text="Tarifa base (USD)" />
              <Input
                keyboardType="numeric"
                value={form.price}
                onChangeText={(v) => updateField('price', v)}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <Label text="Número de licencia / SENESCYT" />
              <Input value={form.license} onChangeText={(v) => updateField('license', v)} />
              <View style={styles.compliance}>
                <Ionicons name="cloud-upload" size={20} color={palette.neon} />
                <Text style={styles.complianceText}>
                  Adjunta cédula, título y certificado bancario. (Simulación en caché)
                </Text>
              </View>
            </>
          )}
        </View>
        <SubscriptionCard
          status={subscriptionStatus}
          onRenew={() =>
            setSubscriptionStatus({ ...subscriptionStatus, status: 'renovado', renewsAt: '29 días' })
          }
        />
          <View style={[styles.actions, dynamicStyles.actions]}>
            {currentStep > 0 && (
              <TouchableOpacity 
                style={[styles.secondary, dynamicStyles.secondary]} 
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={[styles.secondaryText, dynamicStyles.secondaryText]}>Atrás</Text>
              </TouchableOpacity>
            )}
            {currentStep < steps.length - 1 ? (
              <TouchableOpacity 
                style={[styles.primary, dynamicStyles.primary]} 
                onPress={() => setCurrentStep(currentStep + 1)}
              >
                <Text style={[styles.primaryText, dynamicStyles.primaryText]}>Continuar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.primary, dynamicStyles.primary]} 
                onPress={handleSubmit}
              >
                <Text style={[styles.primaryText, dynamicStyles.primaryText]}>
                  Enviar a verificación
                </Text>
              </TouchableOpacity>
            )}
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
    scrollContent: {
      paddingHorizontal: basePadding,
      paddingVertical: basePadding * 0.8,
      paddingBottom: basePadding * 2,
    },
    heading: {
      fontSize: Math.min(24 * baseFontSize, width * 0.065),
    },
    subtitle: {
      fontSize: 14 * baseFontSize,
    },
    stepper: {
      marginVertical: basePadding,
    },
    step: {
      width: width < 375 ? '30%' : '32%',
    },
    bullet: {
      width: isSmallDevice ? 38 : 42,
      height: isSmallDevice ? 38 : 42,
      borderRadius: isSmallDevice ? 19 : 21,
    },
    bulletText: {
      fontSize: 14 * baseFontSize,
    },
    stepLabel: {
      fontSize: 11 * baseFontSize,
    },
    formCard: {
      padding: basePadding * 0.8,
    },
    label: {
      fontSize: 11 * baseFontSize,
    },
    inputText: {
      paddingHorizontal: basePadding * 0.7,
      paddingVertical: basePadding * 0.6,
      fontSize: 14 * baseFontSize,
    },
    actions: {
      marginTop: basePadding,
    },
    primary: {
      paddingHorizontal: basePadding,
      paddingVertical: basePadding * 0.7,
    },
    primaryText: {
      fontSize: 14 * baseFontSize,
    },
    secondary: {
      paddingHorizontal: basePadding,
      paddingVertical: basePadding * 0.7,
    },
    secondaryText: {
      fontSize: 14 * baseFontSize,
    },
  };
};

const Label = ({ text }) => {
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  return <Text style={[styles.label, dynamicStyles.label]}>{text}</Text>;
};

const Input = (props) => {
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  return (
    <TextInput
      placeholderTextColor="rgba(248,250,252,0.4)"
      style={[styles.input, dynamicStyles.inputText]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
  heading: {
    color: palette.frost,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.slate,
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    alignItems: 'center',
  },
  bullet: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bulletActive: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  bulletDone: {
    backgroundColor: palette.lime,
    borderColor: palette.lime,
  },
  bulletText: {
    color: palette.frost,
    fontWeight: '600',
  },
  stepLabel: {
    color: palette.slate,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 20,
    gap: 10,
  },
  label: {
    color: palette.slate,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    borderRadius: 16,
    color: palette.frost,
    backgroundColor: 'rgba(2,6,23,0.4)',
  },
  compliance: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  complianceText: {
    color: palette.slate,
    flex: 1,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  primary: {
    backgroundColor: palette.neon,
    borderRadius: 20,
  },
  primaryText: {
    color: palette.jet,
    fontWeight: '700',
  },
  secondary: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
  },
  secondaryText: {
    color: palette.slate,
    fontWeight: '600',
  },
});

