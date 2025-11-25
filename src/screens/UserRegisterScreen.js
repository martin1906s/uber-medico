import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext, ROLE_TYPES } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';

export const UserRegisterScreen = () => {
  const navigation = useNavigation();
  const { login } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGetLocation = async () => {
    // Simulación de geolocalización
    Alert.alert(
      'Ubicación',
      'La ubicación se detectará automáticamente cuando uses la app. Por ahora, puedes ingresarla manualmente.',
    );
    updateField('location', 'Ubicación detectada');
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(
      'Login Social',
      `Login con ${provider} será implementado próximamente. Por ahora, completa el registro manual.`,
    );
  };

  const handleAutoFill = () => {
    setForm({
      fullName: 'Juan Pérez García',
      email: 'juan.perez@test.com',
      phone: '+593 99 123 4567',
      password: 'test123',
      confirmPassword: 'test123',
      location: 'Quito, Ecuador',
    });
  };

  const handleRegister = () => {
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    // Simulación de registro
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.', [
        {
          text: 'Continuar',
          onPress: () => login(ROLE_TYPES.USER),
        },
      ]);
    }, 1500);
  };

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={palette.frost} />
          </TouchableOpacity>

          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, dynamicStyles.title]}>Crear cuenta</Text>
              <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
                Únete a MedicConnect y encuentra el especialista que necesitas
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.autoFillButton, dynamicStyles.autoFillButton]}
              onPress={handleAutoFill}
            >
              <Ionicons name="flash-outline" size={16} color={palette.neon} />
              <Text style={[styles.autoFillText, dynamicStyles.autoFillText]}>Test</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, dynamicStyles.socialButton]}
              onPress={() => handleSocialLogin('Google')}
            >
              <Ionicons name="logo-google" size={20} color={palette.frost} />
              <Text style={[styles.socialText, dynamicStyles.socialText]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, dynamicStyles.socialButton]}
              onPress={() => handleSocialLogin('Facebook')}
            >
              <Ionicons name="logo-facebook" size={20} color={palette.frost} />
              <Text style={[styles.socialText, dynamicStyles.socialText]}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con email</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Nombre completo *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Ej: Juan Pérez"
                placeholderTextColor="rgba(248,250,252,0.4)"
                value={form.fullName}
                onChangeText={(v) => updateField('fullName', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Correo electrónico *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="tu@email.com"
                placeholderTextColor="rgba(248,250,252,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Teléfono *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="+593 99 999 9999"
                placeholderTextColor="rgba(248,250,252,0.4)"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => updateField('phone', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Ubicación</Text>
              <TouchableOpacity
                style={[styles.locationButton, dynamicStyles.locationButton]}
                onPress={handleGetLocation}
              >
                <Ionicons name="location" size={18} color={palette.neon} />
                <Text style={[styles.locationText, dynamicStyles.locationText]}>
                  {form.location || 'Detectar ubicación automáticamente'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Contraseña *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="rgba(248,250,252,0.4)"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => updateField('password', v)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Confirmar contraseña *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Repite tu contraseña"
                placeholderTextColor="rgba(248,250,252,0.4)"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, dynamicStyles.registerButton, loading && styles.disabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={[styles.registerText, dynamicStyles.registerText]}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.loginLinkText, dynamicStyles.loginLinkText]}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
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
    title: {
      fontSize: Math.min(28 * baseFontSize, width * 0.075),
    },
    subtitle: {
      fontSize: 14 * baseFontSize,
    },
    socialButton: {
      paddingVertical: basePadding * 0.6,
      paddingHorizontal: basePadding * 0.8,
    },
    socialText: {
      fontSize: 14 * baseFontSize,
    },
    label: {
      fontSize: 12 * baseFontSize,
    },
    input: {
      paddingHorizontal: basePadding * 0.7,
      paddingVertical: basePadding * 0.6,
      fontSize: 14 * baseFontSize,
    },
    locationButton: {
      paddingVertical: basePadding * 0.6,
      paddingHorizontal: basePadding * 0.7,
    },
    locationText: {
      fontSize: 14 * baseFontSize,
    },
    registerButton: {
      paddingVertical: basePadding * 0.7,
    },
    registerText: {
      fontSize: 16 * baseFontSize,
    },
    loginLinkText: {
      fontSize: 14 * baseFontSize,
    },
    autoFillButton: {
      paddingHorizontal: basePadding * 0.6,
      paddingVertical: basePadding * 0.4,
    },
    autoFillText: {
      fontSize: 12 * baseFontSize,
    },
  };
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  title: {
    color: palette.frost,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: palette.slate,
  },
  autoFillButton: {
    backgroundColor: 'rgba(34,211,238,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.neon,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  autoFillText: {
    color: palette.neon,
    fontWeight: '600',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  socialText: {
    color: palette.frost,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.3)',
  },
  dividerText: {
    color: palette.slate,
    fontSize: 12,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: palette.slate,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    color: palette.frost,
  },
  locationButton: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationText: {
    color: palette.frost,
    flex: 1,
  },
  registerButton: {
    backgroundColor: palette.neon,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerText: {
    color: palette.jet,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: palette.neon,
  },
  disabled: {
    opacity: 0.6,
  },
});

