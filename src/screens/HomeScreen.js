import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DoctorCard } from '../components/DoctorCard';
import { useAppContext } from '../context/AppContext';
import { LogoutButton } from '../components/LogoutButton';
import { gradients, palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';

const categories = [
  'Todos',
  'Pediatría',
  'Cardiología',
 'Dermatología',
  'Enfermería',
  'Telemedicina',
];

const quickActions = [
  { icon: 'home', label: 'Domicilios' },
  { icon: 'medkit', label: 'Consultorio' },
  { icon: 'videocam', label: 'Virtual' },
  { icon: 'flask', label: 'Diagnóstico' },
];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { providers, setSelectedDoctor } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);

  const filteredProviders = useMemo(() => {
    if (selectedCategory === 'Todos') return providers;
    return providers.filter((provider) =>
      provider.tags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase())),
    );
  }, [providers, selectedCategory]);

  const handleQuickAction = (action) => {
    const actionMessages = {
      'Domicilios': 'Buscando médicos disponibles para consultas a domicilio...',
      'Consultorio': 'Mostrando clínicas y consultorios cercanos...',
      'Virtual': 'Filtrando especialistas con consultas virtuales disponibles...',
      'Diagnóstico': 'Buscando servicios de diagnóstico y laboratorios...',
    };
    
    Alert.alert(
      action.label,
      actionMessages[action.label] || `Funcionalidad de ${action.label} próximamente disponible.`,
      [{ text: 'Entendido' }],
    );
  };

  const handleViewMap = () => {
    Alert.alert(
      'Ver mapa',
      'Esta función mostrará un mapa interactivo con la ubicación de todos los profesionales cercanos. Próximamente disponible.',
      [{ text: 'Entendido' }],
    );
  };

  return (
    <LinearGradient colors={gradients.aurora} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView 
          contentContainerStyle={[styles.content, dynamicStyles.content]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, dynamicStyles.header]}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Ecosistema clínico inteligente</Text>
              <Text style={[styles.title, dynamicStyles.title]}>Encuentra a tu especialista en segundos</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.notify, dynamicStyles.notify]}
                onPress={() => navigation.navigate('Bookings')}
              >
                <Ionicons name="notifications-outline" size={isSmallDevice ? 18 : 20} color={palette.frost} />
              </TouchableOpacity>
              <LogoutButton />
            </View>
          </View>
          <View style={[styles.searchBox, dynamicStyles.searchBox]}>
            <Ionicons name="search" size={isSmallDevice ? 18 : 20} color={palette.slate} />
            <TextInput
              placeholder="Buscar especialidad, clínica o síntoma"
              placeholderTextColor="rgba(248,250,252,0.5)"
              style={[styles.input, dynamicStyles.input]}
            />
            <Ionicons name="options" size={isSmallDevice ? 18 : 20} color={palette.slate} />
          </View>
          <View style={[styles.actions, dynamicStyles.actions]}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.label} 
                style={[styles.action, dynamicStyles.action]}
                onPress={() => handleQuickAction(action)}
              >
                <Ionicons name={action.icon} size={isSmallDevice ? 18 : 20} color={palette.neon} />
                <Text style={[styles.actionText, dynamicStyles.actionText]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.chip,
                  dynamicStyles.chip,
                  selectedCategory === category && styles.chipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.chipText,
                    dynamicStyles.chipText,
                    selectedCategory === category && styles.chipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={[styles.sectionHeader, dynamicStyles.sectionHeader]}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Profesionales cercanos</Text>
            <TouchableOpacity onPress={handleViewMap}>
              <Text style={[styles.sectionAction, dynamicStyles.sectionAction]}>Ver mapa</Text>
            </TouchableOpacity>
          </View>
          {filteredProviders.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onPress={() => {
                setSelectedDoctor(doctor);
                navigation.navigate('DoctorDetail');
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const getDynamicStyles = (width, isSmallDevice) => {
  const basePadding = width < 375 ? 16 : width < 768 ? 20 : 24;
  const baseFontSize = isSmallDevice ? 0.9 : 1;
  
  return {
    content: {
      paddingHorizontal: basePadding,
      paddingVertical: basePadding * 0.8,
      paddingBottom: basePadding * 1.5,
    },
    header: {
      marginBottom: basePadding * 0.5,
    },
    subtitle: {
      fontSize: 11 * baseFontSize,
    },
    title: {
      fontSize: Math.min(24 * baseFontSize, width * 0.065),
      lineHeight: 28 * baseFontSize,
    },
    notify: {
      width: isSmallDevice ? 38 : 42,
      height: isSmallDevice ? 38 : 42,
      borderRadius: isSmallDevice ? 19 : 21,
    },
    searchBox: {
      marginTop: basePadding,
      paddingHorizontal: basePadding * 0.8,
      paddingVertical: basePadding * 0.7,
    },
    input: {
      fontSize: 14 * baseFontSize,
    },
    actions: {
      marginTop: basePadding,
      gap: isSmallDevice ? 6 : 8,
    },
    action: {
      paddingHorizontal: basePadding * 0.7,
      paddingVertical: basePadding * 0.6,
      flex: 1,
      minWidth: width < 375 ? 70 : undefined,
    },
    actionText: {
      fontSize: 11 * baseFontSize,
    },
    chip: {
      paddingHorizontal: basePadding * 0.7,
      paddingVertical: basePadding * 0.4,
    },
    chipText: {
      fontSize: 12 * baseFontSize,
    },
    sectionHeader: {
      marginTop: basePadding * 1.4,
      marginBottom: basePadding * 0.6,
    },
    sectionTitle: {
      fontSize: 16 * baseFontSize,
    },
    sectionAction: {
      fontSize: 14 * baseFontSize,
    },
  };
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subtitle: {
    color: palette.slate,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: palette.frost,
    fontWeight: '700',
  },
  notify: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  searchBox: {
    backgroundColor: 'rgba(15,23,42,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
  },
  input: {
    color: palette.frost,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  action: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: palette.slate,
  },
  filters: {
    marginTop: 24,
    gap: 12,
    paddingRight: 20,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  chipText: {
    color: palette.slate,
    fontWeight: '600',
  },
  chipTextActive: {
    color: palette.jet,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: palette.frost,
    fontWeight: '600',
  },
  sectionAction: {
    color: palette.neon,
  },
});

