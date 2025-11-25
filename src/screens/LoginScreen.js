import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext, ROLE_TYPES } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';

const roleOptions = [
  {
    key: ROLE_TYPES.USER,
    label: 'Usuario',
    description: 'Explora especialistas, agenda citas y gestiona pagos.',
    icon: 'person-circle-outline',
  },
  {
    key: ROLE_TYPES.HEALTH,
    label: 'Personal de salud',
    description: 'Carga credenciales y activa tu perfil profesional.',
    icon: 'medkit-outline',
  },
  {
    key: ROLE_TYPES.ADMIN,
    label: 'Administrador',
    description: 'Controla verificaciones y métricas globales.',
    icon: 'shield-checkmark-outline',
  },
];

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);

  const handleRoleSelection = (role) => {
    if (role === ROLE_TYPES.USER) {
      navigation.navigate('UserLogin');
    } else if (role === ROLE_TYPES.HEALTH) {
      navigation.navigate('HealthLogin');
    } else {
      login(role);
    }
  };

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={[styles.kicker, dynamicStyles.kicker]}>Bienvenido a MedicConnect</Text>
            <Text style={[styles.title, dynamicStyles.title]}>Selecciona tu rol para continuar</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              Personalizamos la experiencia y los accesos según tu perfil.
            </Text>
          </View>
          <View style={styles.options}>
            {roleOptions.map(({ key, label, description, icon }) => (
              <TouchableOpacity 
                key={key} 
                style={[styles.card, dynamicStyles.card]} 
                onPress={() => handleRoleSelection(key)}
                activeOpacity={0.8}
              >
                <Ionicons name={icon} size={isSmallDevice ? 22 : 24} color={palette.neon} />
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>{label}</Text>
                  <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>{description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={isSmallDevice ? 16 : 18} color={palette.slate} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.footer, dynamicStyles.footer]}>
            Al seleccionar un rol, serás dirigido al inicio de sesión correspondiente.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const getDynamicStyles = (width, isSmallDevice) => {
  const basePadding = width < 375 ? 16 : width < 768 ? 24 : 32;
  const baseFontSize = isSmallDevice ? 0.9 : 1;
  
  return {
    scrollContent: {
      paddingHorizontal: basePadding,
      paddingVertical: basePadding * 0.75,
      minHeight: '100%',
      justifyContent: 'center',
    },
    kicker: {
      fontSize: 11 * baseFontSize,
    },
    title: {
      fontSize: Math.min(28 * baseFontSize, width * 0.075),
    },
    subtitle: {
      fontSize: 14 * baseFontSize,
    },
    card: {
      padding: basePadding * 0.83,
      minHeight: width < 375 ? 80 : 90,
    },
    cardTitle: {
      fontSize: 16 * baseFontSize,
    },
    cardDescription: {
      fontSize: 13 * baseFontSize,
    },
    footer: {
      fontSize: 12 * baseFontSize,
      marginTop: basePadding,
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
  hero: {
    gap: 12,
    marginBottom: 32,
  },
  kicker: {
    color: palette.slate,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: palette.frost,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    color: palette.slate,
    lineHeight: 20,
  },
  options: {
    gap: 16,
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    width: '100%',
  },
  cardTitle: {
    color: palette.frost,
    fontWeight: '600',
    lineHeight: 22,
  },
  cardDescription: {
    color: palette.slate,
    marginTop: 4,
    lineHeight: 18,
  },
  footer: {
    color: palette.slate,
    textAlign: 'center',
    marginTop: 24,
  },
});


