import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext, ROLE_TYPES } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';

export const HealthLoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { login, providers } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (route.params?.showMessage && route.params?.message) {
      setMessageText(route.params.message);
      setShowMessage(true);
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  }, [route.params]);

  const handleLogin = () => {
    if (!form.email || !form.password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    
    // Simulación de login - buscar si el email existe en los proveedores registrados
    setTimeout(() => {
      setLoading(false);
      
      // Buscar si hay un proveedor con ese email
      const provider = providers.find((p) => p.email === form.email);
      
      if (provider) {
        // Verificar si está verificado
        if (provider.verificationStatus === 'pendiente') {
          Alert.alert(
            'Cuenta pendiente',
            'Tu cuenta está pendiente de verificación. Los administradores revisarán tus documentos y te notificarán cuando sea aprobada.',
          );
          return;
        }
        
        // Login exitoso - hacer login directamente sin alert
        login(ROLE_TYPES.HEALTH);
      } else {
        // Para testing: permitir login con cualquier email/contraseña
        // En producción, esto debería validar contra un backend
        if (form.email && form.password.length >= 6) {
          // Login exitoso para testing
          login(ROLE_TYPES.HEALTH);
        } else {
          Alert.alert(
            'Credenciales incorrectas',
            'No encontramos una cuenta con ese correo electrónico. ¿Deseas registrarte?',
            [
              {
                text: 'Registrarse',
                onPress: () => navigation.navigate('ProviderRegister'),
              },
              { text: 'Cancelar', style: 'cancel' },
            ],
          );
        }
      }
    }, 500);
  };

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Modal
          visible={showMessage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMessage(false)}
        >
          <View style={styles.messageOverlay}>
            <View style={styles.messageContainer}>
              <View style={styles.messageHeader}>
                <Ionicons name="checkmark-circle" size={32} color={palette.lime} />
                <Text style={styles.messageTitle}>Registro enviado</Text>
              </View>
              <Text style={styles.messageText}>{messageText}</Text>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => setShowMessage(false)}
              >
                <Text style={styles.messageButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

          <View style={styles.header}>
            <Ionicons name="medkit" size={64} color={palette.neon} />
            <Text style={[styles.title, dynamicStyles.title]}>Inicio de sesión</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              Personal de salud
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Correo electrónico</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={palette.slate} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  placeholder="tu@email.com"
                  placeholderTextColor="rgba(248,250,252,0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={form.email}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, email: v }))}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={palette.slate} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, dynamicStyles.input, styles.passwordInput]}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="rgba(248,250,252,0.4)"
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, password: v }))}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={palette.slate}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => {
                Alert.alert(
                  'Recuperar contraseña',
                  'Se enviará un enlace de recuperación a tu correo electrónico. Por favor, ingresa tu email y verifica tu bandeja de entrada.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Enviar',
                      onPress: () => {
                        Alert.alert(
                          'Enlace enviado',
                          'Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.',
                        );
                      },
                    },
                  ],
                );
              }}
            >
              <Text style={[styles.forgotPasswordText, dynamicStyles.forgotPasswordText]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, dynamicStyles.loginButton, loading && styles.disabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={[styles.loginButtonText, dynamicStyles.loginButtonText]}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, dynamicStyles.registerButton]}
            onPress={() => navigation.navigate('ProviderRegister')}
          >
            <Ionicons name="person-add-outline" size={20} color={palette.neon} />
            <Text style={[styles.registerButtonText, dynamicStyles.registerButtonText]}>
              Crear cuenta nueva
            </Text>
          </TouchableOpacity>

          <Text style={[styles.footer, dynamicStyles.footer]}>
            Si aún no tienes cuenta, regístrate para comenzar el proceso de verificación.
          </Text>
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
      fontSize: 16 * baseFontSize,
    },
    label: {
      fontSize: 12 * baseFontSize,
    },
    input: {
      fontSize: 14 * baseFontSize,
    },
    forgotPasswordText: {
      fontSize: 13 * baseFontSize,
    },
    loginButton: {
      paddingVertical: basePadding * 0.7,
    },
    loginButtonText: {
      fontSize: 16 * baseFontSize,
    },
    registerButton: {
      paddingVertical: basePadding * 0.7,
    },
    registerButtonText: {
      fontSize: 15 * baseFontSize,
    },
    footer: {
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
    justifyContent: 'center',
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: palette.frost,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    color: palette.neon,
    fontWeight: '600',
  },
  form: {
    gap: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    color: palette.frost,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  passwordInput: {
    paddingRight: 12,
  },
  eyeButton: {
    padding: 12,
    marginRight: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: palette.neon,
  },
  loginButton: {
    backgroundColor: palette.neon,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: palette.jet,
    fontWeight: '700',
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
  registerButton: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.neon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerButtonText: {
    color: palette.neon,
    fontWeight: '600',
  },
  footer: {
    color: palette.slate,
    textAlign: 'center',
    marginTop: 24,
  },
  disabled: {
    opacity: 0.6,
  },
  messageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageContainer: {
    backgroundColor: palette.graphite,
    borderRadius: 24,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  messageTitle: {
    color: palette.frost,
    fontSize: 20,
    fontWeight: '700',
  },
  messageText: {
    color: palette.slate,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  messageButton: {
    backgroundColor: palette.neon,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  messageButtonText: {
    color: palette.jet,
    fontWeight: '700',
    fontSize: 16,
  },
});

