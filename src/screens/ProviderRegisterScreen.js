import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { useAppContext, ROLE_TYPES } from '../context/AppContext';
import { gradients, palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';
import { SpecialtySelector } from '../components/SpecialtySelector';
import { ScheduleModal } from '../components/ScheduleModal';

const steps = [
  { key: 'profile', title: 'Datos personales', icon: 'person-outline' },
  { key: 'professional', title: 'Información profesional', icon: 'briefcase-outline' },
  { key: 'documents', title: 'Documentos', icon: 'document-attach-outline' },
  { key: 'verification', title: 'Verificación', icon: 'shield-checkmark-outline' },
];

export const ProviderRegisterScreen = () => {
  const navigation = useNavigation();
  const { providers, setProviders, login } = useAppContext();
  const { width, isSmallDevice } = useDimensions();
  const dynamicStyles = getDynamicStyles(width, isSmallDevice);
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    // Datos personales
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Información profesional
    specialty: '',
    academicTitle: '',
    experience: '',
    workplace: '',
    workplaceAddress: '',
    bio: '',
    consultationPrice: '',
    availability: '',
    availabilitySchedule: null, // Objeto con horarios por día
    // Documentos
    titleDocument: null,
    idDocument: null,
    healthCertification: null,
    specializationCert: null,
  });
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  const updateField = (key, value) => {
    // Validación para campos numéricos
    if (key === 'experience') {
      // Solo permitir números
      const numericValue = value.replace(/[^0-9]/g, '');
      setForm((prev) => ({ ...prev, [key]: numericValue }));
    } else if (key === 'consultationPrice') {
      // Permitir números y un punto decimal
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Solo permitir un punto decimal
      const parts = numericValue.split('.');
      const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
      setForm((prev) => ({ ...prev, [key]: finalValue }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleGetWorkplaceLocation = () => {
    setLocationModalVisible(true);
  };

  const handleUseCurrentLocation = () => {
    // Simulación de obtener ubicación actual
    updateField('workplace', 'Clínica San José');
    updateField('workplaceAddress', 'Av. Amazonas N12-123, Quito, Ecuador');
    setLocationModalVisible(false);
    Alert.alert('Ubicación seleccionada', 'Ubicación obtenida desde Google Maps.');
  };

  const handleSearchLocation = () => {
    if (!locationSearch.trim()) {
      Alert.alert('Campo vacío', 'Por favor ingresa el nombre del lugar.');
      return;
    }
    // Simulación de búsqueda en Google Maps
    updateField('workplace', locationSearch);
    updateField('workplaceAddress', 'Dirección obtenida desde Google Maps');
    setLocationSearch('');
    setLocationModalVisible(false);
    Alert.alert('Ubicación seleccionada', `Lugar "${locationSearch}" seleccionado desde Google Maps.`);
  };

  const handleDocumentUpload = async (documentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setForm((prev) => ({
          ...prev,
          [documentType]: {
            uri: file.uri,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
            uploaded: true,
          },
        }));
        Alert.alert('Documento cargado', `El archivo ${file.name} ha sido cargado exitosamente.`);
      }
    } catch (error) {
      console.error('Error al seleccionar documento:', error);
      Alert.alert('Error', 'No se pudo cargar el documento. Por favor intenta nuevamente.');
    }
  };

  const handleAutoFill = () => {
    switch (currentStep) {
      case 0:
        setForm((prev) => ({
          ...prev,
          fullName: 'Dr. María González',
          email: 'maria.gonzalez@test.com',
          phone: '+593 99 987 6543',
          password: 'test123',
          confirmPassword: 'test123',
        }));
        break;
      case 1:
        setForm((prev) => ({
          ...prev,
          specialty: 'Cardiología',
          academicTitle: 'Médico Especialista en Cardiología',
          experience: '8',
          workplace: 'Clínica San José',
          workplaceAddress: 'Av. Amazonas N12-123, Quito',
          bio: 'Especialista en cardiología con amplia experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares.',
          consultationPrice: '65',
          availability: 'Lunes: 09:00, 11:00 | Martes: 14:00, 16:00',
        }));
        break;
      case 2:
        setForm((prev) => ({
          ...prev,
          titleDocument: { uri: 'simulated', name: 'titleDocument.pdf', uploaded: true },
          idDocument: { uri: 'simulated', name: 'idDocument.pdf', uploaded: true },
          healthCertification: { uri: 'simulated', name: 'healthCertification.pdf', uploaded: true },
          specializationCert: { uri: 'simulated', name: 'specializationCert.pdf', uploaded: true },
        }));
        break;
      default:
        break;
    }
  };


  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!form.fullName || !form.email || !form.phone || !form.password) {
          Alert.alert('Campos requeridos', 'Completa todos los campos del paso 1.');
          return false;
        }
        if (form.password !== form.confirmPassword) {
          Alert.alert('Error', 'Las contraseñas no coinciden.');
          return false;
        }
        return true;
      case 1:
        if (!form.specialty || !form.academicTitle || !form.workplace || !form.consultationPrice) {
          Alert.alert('Campos requeridos', 'Completa todos los campos del paso 2.');
          return false;
        }
        // Validar que el precio sea un número válido
        const price = parseFloat(form.consultationPrice);
        if (isNaN(price) || price <= 0) {
          Alert.alert('Precio inválido', 'El precio de consulta debe ser un número mayor a 0.');
          return false;
        }
        return true;
      case 2:
        // Verificar que los documentos requeridos estén cargados
        const hasTitle = form.titleDocument && (form.titleDocument.uploaded || form.titleDocument.uri);
        const hasId = form.idDocument && (form.idDocument.uploaded || form.idDocument.uri);
        const hasHealthCert = form.healthCertification && (form.healthCertification.uploaded || form.healthCertification.uri);
        
        if (!hasTitle || !hasId || !hasHealthCert) {
          Alert.alert(
            'Documentos requeridos',
            'Debes subir al menos los siguientes documentos:\n\n• Título profesional\n• Cédula de identidad o pasaporte\n• Certificación del Ministerio de Salud\n\nEl certificado de especialización es opcional.',
          );
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    // Si estamos en el último paso (verificación), enviar directamente
    if (currentStep === steps.length - 1) {
      handleSubmit();
      return;
    }
    
    // Validar el paso actual antes de continuar
    if (!validateStep(currentStep)) {
      return;
    }
    
    // Avanzar al siguiente paso
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    // Validar todos los pasos antes de enviar
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      Alert.alert(
        'Información incompleta',
        'Por favor completa todos los pasos del formulario antes de enviar la solicitud.',
      );
      return;
    }

    try {
      const newProvider = {
        id: `pending-${Date.now()}`,
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        specialty: form.specialty,
        academicTitle: form.academicTitle,
        experience: form.experience,
        workplace: form.workplace,
        bio: form.bio,
        price: Number(form.consultationPrice) || 40,
        rating: 0,
        distance: 0,
        tags: [form.specialty],
        availability: form.availabilitySchedule
          ? Object.entries(form.availabilitySchedule)
              .filter(([_, times]) => times && times.length > 0)
              .flatMap(([day, times]) => times.map((time) => `${day} ${time}`))
          : form.availability
          ? form.availability.split(',').map((t) => t.trim()).filter((t) => t)
          : ['09:00', '11:00', '16:00'],
        type: ['Consultorio', 'Domicilio'],
        clinic: form.workplace,
        verificationStatus: 'pendiente',
        documents: {
          title: form.titleDocument,
          id: form.idDocument,
          healthCert: form.healthCertification,
          specialization: form.specializationCert,
        },
      };

      setProviders([newProvider, ...providers]);
      
      // Limpiar el formulario
      setForm({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        specialty: '',
        academicTitle: '',
        experience: '',
        workplace: '',
        workplaceAddress: '',
        bio: '',
        consultationPrice: '',
        availability: '',
        availabilitySchedule: null,
        titleDocument: null,
        idDocument: null,
        healthCertification: null,
        specializationCert: null,
      });
      setCurrentStep(0);
      
      // Navegar al login y mostrar mensaje flotante
      navigation.navigate('HealthLogin', {
        showMessage: true,
        message: 'Tu registro ha sido enviado exitosamente. Los administradores revisarán tus documentos y te notificarán cuando tu cuenta sea aprobada. Este proceso puede tomar entre 24 y 48 horas.',
      });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al enviar tu solicitud. Por favor intenta nuevamente.');
      console.error('Error al enviar solicitud:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, dynamicStyles.stepTitle]}>Datos personales</Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Nombre completo *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Dr. Juan Pérez"
                placeholderTextColor="rgba(248,250,252,0.4)"
                value={form.fullName}
                onChangeText={(v) => updateField('fullName', v)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Correo electrónico *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="doctor@email.com"
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
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, dynamicStyles.stepTitle]}>Información profesional</Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Especialidad *</Text>
              <SpecialtySelector
                value={form.specialty}
                onSelect={(specialty) => updateField('specialty', specialty)}
                dynamicStyles={dynamicStyles}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Título académico *</Text>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Ej: Médico General, Especialista en..."
                placeholderTextColor="rgba(248,250,252,0.4)"
                value={form.academicTitle}
                onChangeText={(v) => updateField('academicTitle', v)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Años de experiencia</Text>
              <View style={styles.experienceContainer}>
                <TextInput
                  style={[styles.input, dynamicStyles.input, styles.experienceInput]}
                  placeholder="Ej: 5"
                  placeholderTextColor="rgba(248,250,252,0.4)"
                  keyboardType="number-pad"
                  value={form.experience}
                  onChangeText={(v) => updateField('experience', v)}
                />
                <Text style={styles.experienceLabel}>años</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Lugar de trabajo *</Text>
              <TouchableOpacity
                style={[styles.locationButton, dynamicStyles.locationButton]}
                onPress={handleGetWorkplaceLocation}
              >
                <Ionicons name="location" size={20} color={palette.neon} />
                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationText, dynamicStyles.locationText]}>
                    {form.workplace || 'Seleccionar desde Google Maps'}
                  </Text>
                  {form.workplaceAddress && (
                    <Text style={[styles.locationAddress, dynamicStyles.locationAddress]}>
                      {form.workplaceAddress}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={palette.slate} />
              </TouchableOpacity>
              {form.workplace && (
                <TextInput
                  style={[styles.input, dynamicStyles.input, styles.locationInput]}
                  placeholder="Editar nombre del lugar (opcional)"
                  placeholderTextColor="rgba(248,250,252,0.4)"
                  value={form.workplace}
                  onChangeText={(v) => updateField('workplace', v)}
                />
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Biografía profesional</Text>
              <TextInput
                style={[styles.input, styles.textArea, dynamicStyles.input]}
                placeholder="Describe tu experiencia y especialización..."
                placeholderTextColor="rgba(248,250,252,0.4)"
                multiline
                numberOfLines={4}
                value={form.bio}
                onChangeText={(v) => updateField('bio', v)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Precio de consulta (USD) *</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceSymbol}>$</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.input, styles.priceInput]}
                  placeholder="50.00"
                  placeholderTextColor="rgba(248,250,252,0.4)"
                  keyboardType="decimal-pad"
                  value={form.consultationPrice}
                  onChangeText={(v) => updateField('consultationPrice', v)}
                />
                <Text style={styles.priceLabel}>USD</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicStyles.label]}>Horarios disponibles</Text>
              <TouchableOpacity
                style={[styles.scheduleButton, dynamicStyles.scheduleButton]}
                onPress={() => setScheduleModalVisible(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={palette.neon} />
                <View style={styles.scheduleTextContainer}>
                  <Text style={[styles.scheduleText, dynamicStyles.scheduleText]}>
                    {form.availability || 'Configurar horarios por día'}
                  </Text>
                  {form.availability && (
                    <Text style={[styles.scheduleSubtext, dynamicStyles.scheduleSubtext]}>
                      Toca para editar
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={palette.slate} />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, dynamicStyles.stepTitle]}>Documentos requeridos</Text>
            <Text style={[styles.stepDescription, dynamicStyles.stepDescription]}>
              Sube los siguientes documentos para verificación. Todos serán revisados por los administradores.
            </Text>

            <DocumentUpload
              label="Título profesional *"
              icon="school-outline"
              uploaded={form.titleDocument}
              onPress={() => handleDocumentUpload('titleDocument')}
              dynamicStyles={dynamicStyles}
            />
            <DocumentUpload
              label="Cédula de identidad o pasaporte *"
              icon="card-outline"
              uploaded={form.idDocument}
              onPress={() => handleDocumentUpload('idDocument')}
              dynamicStyles={dynamicStyles}
            />
            <DocumentUpload
              label="Certificación del Ministerio de Salud *"
              icon="medical-outline"
              uploaded={form.healthCertification}
              onPress={() => handleDocumentUpload('healthCertification')}
              dynamicStyles={dynamicStyles}
            />
            <DocumentUpload
              label="Certificados de especialización (opcional)"
              icon="ribbon-outline"
              uploaded={form.specializationCert}
              onPress={() => handleDocumentUpload('specializationCert')}
              dynamicStyles={dynamicStyles}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.verificationCard}>
              <Ionicons name="document-text-outline" size={48} color={palette.neon} />
              <Text style={[styles.verificationTitle, dynamicStyles.verificationTitle]}>
                Revisar información
              </Text>
              <Text style={[styles.verificationText, dynamicStyles.verificationText]}>
                Revisa que toda tu información esté correcta antes de enviar tu solicitud.
              </Text>
              
              <View style={styles.reviewSection}>
                <Text style={[styles.reviewLabel, dynamicStyles.reviewLabel]}>Datos personales</Text>
                <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>{form.fullName}</Text>
                <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>{form.email}</Text>
                <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>{form.phone}</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={[styles.reviewLabel, dynamicStyles.reviewLabel]}>Información profesional</Text>
                <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>{form.specialty}</Text>
                <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>{form.academicTitle}</Text>
                <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>{form.workplace}</Text>
                <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>
                  Precio: ${form.consultationPrice || '40'} USD
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={[styles.reviewLabel, dynamicStyles.reviewLabel]}>Documentos</Text>
                <View style={styles.documentReview}>
                  <Ionicons 
                    name={form.titleDocument ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={form.titleDocument ? palette.lime : palette.slate} 
                  />
                  <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>
                    Título profesional {form.titleDocument ? '✓' : '✗'}
                  </Text>
                </View>
                <View style={styles.documentReview}>
                  <Ionicons 
                    name={form.idDocument ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={form.idDocument ? palette.lime : palette.slate} 
                  />
                  <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>
                    Cédula/Pasaporte {form.idDocument ? '✓' : '✗'}
                  </Text>
                </View>
                <View style={styles.documentReview}>
                  <Ionicons 
                    name={form.healthCertification ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={form.healthCertification ? palette.lime : palette.slate} 
                  />
                  <Text style={[styles.reviewValue, dynamicStyles.reviewValue]}>
                    Certificación de Salud {form.healthCertification ? '✓' : '✗'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.verificationText, dynamicStyles.verificationText, styles.warningText]}>
                ⚠️ Una vez enviada, tu solicitud será revisada por los administradores. Este proceso puede tomar entre 24 y 48 horas.
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
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
              <Text style={[styles.title, dynamicStyles.title]}>Registro de médico</Text>
              <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
                Completa tu perfil profesional para unirte a MedicConnect
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

          <View style={styles.stepper}>
            {steps.map((step, index) => (
              <View key={step.key} style={styles.stepIndicator}>
                <View
                  style={[
                    styles.stepBullet,
                    dynamicStyles.stepBullet,
                    index === currentStep && styles.stepBulletActive,
                    index < currentStep && styles.stepBulletDone,
                  ]}
                >
                  {index < currentStep ? (
                    <Ionicons name="checkmark" size={16} color={palette.jet} />
                  ) : (
                    <Ionicons name={step.icon} size={16} color={index === currentStep ? palette.jet : palette.slate} />
                  )}
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      index < currentStep && styles.stepConnectorDone,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          <View style={styles.stepLabels}>
            {steps.map((step, index) => (
              <Text
                key={step.key}
                style={[
                  styles.stepLabel,
                  dynamicStyles.stepLabel,
                  index === currentStep && styles.stepLabelActive,
                ]}
              >
                {step.title}
              </Text>
            ))}
          </View>

          {renderStepContent()}

          <ScheduleModal
            visible={scheduleModalVisible}
            onClose={() => setScheduleModalVisible(false)}
            onSave={(scheduleString, scheduleObject) => {
              updateField('availability', scheduleString);
              updateField('availabilitySchedule', scheduleObject);
            }}
            initialSchedule={form.availabilitySchedule}
          />

          {/* Modal de selección de ubicación */}
          <Modal
            visible={locationModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setLocationModalVisible(false)}
          >
            <View style={styles.locationModalOverlay}>
              <View style={styles.locationModalContent}>
                <View style={styles.locationModalHeader}>
                  <Text style={styles.locationModalTitle}>Seleccionar ubicación</Text>
                  <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                    <Ionicons name="close" size={24} color={palette.frost} />
                  </TouchableOpacity>
                </View>

                <View style={styles.locationOptions}>
                  <TouchableOpacity
                    style={styles.locationOption}
                    onPress={handleUseCurrentLocation}
                  >
                    <Ionicons name="locate" size={24} color={palette.neon} />
                    <View style={styles.locationOptionText}>
                      <Text style={styles.locationOptionTitle}>Usar ubicación actual</Text>
                      <Text style={styles.locationOptionSubtitle}>
                        Obtener desde GPS
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={palette.slate} />
                  </TouchableOpacity>

                  <View style={styles.locationDivider}>
                    <View style={styles.locationDividerLine} />
                    <Text style={styles.locationDividerText}>o</Text>
                    <View style={styles.locationDividerLine} />
                  </View>

                  <View style={styles.locationSearchContainer}>
                    <Text style={styles.locationSearchLabel}>Buscar lugar</Text>
                    <View style={styles.locationSearchInputContainer}>
                      <Ionicons name="search" size={20} color={palette.slate} style={styles.locationSearchIcon} />
                      <TextInput
                        style={styles.locationSearchInput}
                        placeholder="Ej: Clínica San José, Hospital..."
                        placeholderTextColor="rgba(248,250,252,0.4)"
                        value={locationSearch}
                        onChangeText={setLocationSearch}
                        onSubmitEditing={handleSearchLocation}
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.locationSearchButton, !locationSearch.trim() && styles.locationSearchButtonDisabled]}
                      onPress={handleSearchLocation}
                      disabled={!locationSearch.trim()}
                    >
                      <Text style={styles.locationSearchButtonText}>Buscar</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.locationModalCancel}
                  onPress={() => setLocationModalVisible(false)}
                >
                  <Text style={styles.locationModalCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.actions}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[styles.secondaryButton, dynamicStyles.secondaryButton]}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={[styles.secondaryText, dynamicStyles.secondaryText]}>Atrás</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.primaryButton, dynamicStyles.primaryButton]}
              onPress={handleNext}
            >
              <Text style={[styles.primaryText, dynamicStyles.primaryText]}>
                {currentStep === steps.length - 1 ? 'Enviar solicitud' : 'Continuar'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const DocumentUpload = ({ label, icon, uploaded, onPress, dynamicStyles }) => {
  // Verificar si el documento está cargado (puede ser un objeto o un valor truthy)
  const isUploaded = uploaded && (uploaded.uploaded || uploaded.uri || uploaded === true);
  
  return (
    <TouchableOpacity 
      style={[
        styles.documentButton, 
        dynamicStyles.documentButton,
        isUploaded && styles.documentButtonUploaded
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.documentIcon, isUploaded && styles.documentIconUploaded]}>
        <Ionicons name={icon} size={24} color={isUploaded ? palette.lime : palette.neon} />
      </View>
      <View style={styles.documentInfo}>
        <Text style={[styles.documentLabel, dynamicStyles.documentLabel]}>{label}</Text>
        {isUploaded && (
          <Text style={[styles.documentStatus, dynamicStyles.documentStatus]}>
            ✓ Documento cargado
          </Text>
        )}
        {!isUploaded && (
          <Text style={[styles.documentHint, dynamicStyles.documentHint]}>
            Toca para subir
          </Text>
        )}
      </View>
      <Ionicons
        name={isUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
        size={24}
        color={isUploaded ? palette.lime : palette.slate}
      />
    </TouchableOpacity>
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
    stepBullet: {
      width: isSmallDevice ? 36 : 40,
      height: isSmallDevice ? 36 : 40,
      borderRadius: isSmallDevice ? 18 : 20,
    },
    stepLabel: {
      fontSize: 10 * baseFontSize,
    },
    stepTitle: {
      fontSize: 20 * baseFontSize,
    },
    stepDescription: {
      fontSize: 13 * baseFontSize,
    },
    label: {
      fontSize: 12 * baseFontSize,
    },
    input: {
      paddingHorizontal: basePadding * 0.7,
      paddingVertical: basePadding * 0.6,
      fontSize: 14 * baseFontSize,
    },
    verificationTitle: {
      fontSize: 22 * baseFontSize,
    },
    verificationText: {
      fontSize: 14 * baseFontSize,
    },
    reviewLabel: {
      fontSize: 13 * baseFontSize,
    },
    reviewValue: {
      fontSize: 14 * baseFontSize,
    },
    documentButton: {
      padding: basePadding * 0.8,
    },
    documentLabel: {
      fontSize: 14 * baseFontSize,
    },
    documentStatus: {
      fontSize: 12 * baseFontSize,
    },
    documentHint: {
      fontSize: 11 * baseFontSize,
    },
    autoFillButton: {
      paddingHorizontal: basePadding * 0.6,
      paddingVertical: basePadding * 0.4,
    },
    autoFillText: {
      fontSize: 12 * baseFontSize,
    },
    primaryButton: {
      paddingVertical: basePadding * 0.7,
      paddingHorizontal: basePadding,
    },
    primaryText: {
      fontSize: 16 * baseFontSize,
    },
    secondaryButton: {
      paddingVertical: basePadding * 0.7,
      paddingHorizontal: basePadding,
    },
    secondaryText: {
      fontSize: 16 * baseFontSize,
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
  title: {
    color: palette.frost,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: palette.slate,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
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
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepBullet: {
    borderWidth: 2,
    borderColor: 'rgba(148,163,184,0.3)',
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBulletActive: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  stepBulletDone: {
    backgroundColor: palette.lime,
    borderColor: palette.lime,
  },
  stepConnector: {
    position: 'absolute',
    top: 20,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: 'rgba(148,163,184,0.3)',
    zIndex: -1,
  },
  stepConnectorDone: {
    backgroundColor: palette.lime,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  stepLabel: {
    flex: 1,
    color: palette.slate,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: palette.neon,
    fontWeight: '600',
  },
  stepContent: {
    gap: 16,
    marginBottom: 24,
  },
  stepTitle: {
    color: palette.frost,
    fontWeight: '700',
    marginBottom: 8,
  },
  stepDescription: {
    color: palette.slate,
    marginBottom: 16,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  documentButton: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  documentButtonUploaded: {
    borderColor: palette.lime,
    backgroundColor: 'rgba(163,230,53,0.1)',
  },
  documentIconUploaded: {
    backgroundColor: 'rgba(163,230,53,0.2)',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34,211,238,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentLabel: {
    color: palette.frost,
    fontWeight: '600',
  },
  documentStatus: {
    color: palette.lime,
    marginTop: 4,
    fontSize: 12,
  },
  documentHint: {
    color: palette.slate,
    marginTop: 4,
    fontSize: 12,
    fontStyle: 'italic',
  },
  verificationCard: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  verificationTitle: {
    color: palette.frost,
    fontWeight: '700',
  },
  verificationText: {
    color: palette.slate,
    textAlign: 'center',
    lineHeight: 20,
  },
  warningText: {
    marginTop: 16,
    color: palette.neon,
    fontWeight: '600',
  },
  reviewSection: {
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.2)',
  },
  reviewLabel: {
    color: palette.neon,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  reviewValue: {
    color: palette.frost,
    marginBottom: 4,
    fontSize: 14,
  },
  documentReview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: palette.neon,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
  },
  primaryText: {
    color: palette.jet,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    alignItems: 'center',
  },
  secondaryText: {
    color: palette.slate,
    fontWeight: '600',
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  experienceInput: {
    flex: 1,
  },
  experienceLabel: {
    color: palette.slate,
    fontSize: 14,
  },
  locationButton: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationText: {
    color: palette.frost,
    fontWeight: '600',
  },
  locationAddress: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 2,
  },
  locationInput: {
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    paddingLeft: 16,
  },
  priceSymbol: {
    color: palette.frost,
    fontSize: 16,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 8,
  },
  priceLabel: {
    color: palette.slate,
    fontSize: 12,
    paddingRight: 16,
  },
  scheduleButton: {
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleText: {
    color: palette.frost,
    fontWeight: '600',
  },
  scheduleSubtext: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 2,
  },
  locationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  locationModalContent: {
    backgroundColor: palette.jet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  locationModalTitle: {
    color: palette.frost,
    fontSize: 20,
    fontWeight: '700',
  },
  locationOptions: {
    padding: 20,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  locationOptionText: {
    flex: 1,
  },
  locationOptionTitle: {
    color: palette.frost,
    fontSize: 16,
    fontWeight: '600',
  },
  locationOptionSubtitle: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 2,
  },
  locationDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  locationDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.3)',
  },
  locationDividerText: {
    color: palette.slate,
    fontSize: 12,
  },
  locationSearchContainer: {
    gap: 12,
  },
  locationSearchLabel: {
    color: palette.slate,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  locationSearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    paddingHorizontal: 12,
  },
  locationSearchIcon: {
    marginRight: 8,
  },
  locationSearchInput: {
    flex: 1,
    color: palette.frost,
    paddingVertical: 14,
    fontSize: 14,
  },
  locationSearchButton: {
    backgroundColor: palette.neon,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  locationSearchButtonDisabled: {
    opacity: 0.5,
  },
  locationSearchButtonText: {
    color: palette.jet,
    fontWeight: '700',
    fontSize: 16,
  },
  locationModalCancel: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.2)',
  },
  locationModalCancelText: {
    color: palette.slate,
    fontSize: 16,
    fontWeight: '600',
  },
});

