import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { palette } from '../theme/colors';
import { useDimensions } from '../hooks/useDimensions';

export const AdminDashboardScreen = () => {
  const { providers, appointments, setProviders } = useAppContext();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
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

  const handleProviderPress = (provider) => {
    setSelectedProvider(provider);
  };

  const handleViewDocument = (document, documentName) => {
    if (!document || (!document.uri && !document.uploaded)) {
      Alert.alert('Documento no disponible', 'Este documento no ha sido cargado aún.');
      return;
    }
    setSelectedDocument({ document, name: documentName });
    setDocumentModalVisible(true);
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
            setSelectedProvider(null);
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
              <TouchableOpacity
                key={provider.id}
                style={[styles.row, dynamicStyles.row]}
                onPress={() => handleProviderPress(provider)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.provider, dynamicStyles.provider]}>{provider.name}</Text>
                  <Text style={[styles.providerMeta, dynamicStyles.providerMeta]}>
                    {provider.specialty} · Licencia {provider.id.split('-')[1]}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.verifyButton, dynamicStyles.verifyButton]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleVerifyProvider(provider);
                  }}
                >
                  <Text style={[styles.verifyText, dynamicStyles.verifyText]}>Validar</Text>
                </TouchableOpacity>
              </TouchableOpacity>
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

      {/* Modal de detalles del proveedor */}
      <Modal
        visible={selectedProvider !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProvider(null)}
      >
        <View style={styles.providerModalOverlay}>
          <View style={styles.providerModalContent}>
            <View style={styles.providerModalHeader}>
              <Text style={styles.providerModalTitle}>Detalles del solicitante</Text>
              <TouchableOpacity onPress={() => setSelectedProvider(null)}>
                <Ionicons name="close" size={24} color={palette.frost} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.providerModalScroll} showsVerticalScrollIndicator={false}>
              {selectedProvider && (
                <>
                  <View style={styles.providerDetailSection}>
                    <Text style={styles.providerDetailSectionTitle}>Información personal</Text>
                    <DetailRow label="Nombre completo" value={selectedProvider.name || selectedProvider.fullName || 'No especificado'} />
                    <DetailRow label="Correo electrónico" value={selectedProvider.email || 'No especificado'} />
                    <DetailRow label="Teléfono" value={selectedProvider.phone || 'No especificado'} />
                  </View>

                  <View style={styles.providerDetailSection}>
                    <Text style={styles.providerDetailSectionTitle}>Información profesional</Text>
                    <DetailRow label="Especialidad" value={selectedProvider.specialty || 'No especificada'} />
                    <DetailRow label="Título académico" value={selectedProvider.academicTitle || 'No especificado'} />
                    <DetailRow label="Años de experiencia" value={selectedProvider.experience ? `${selectedProvider.experience} años` : 'No especificado'} />
                    <DetailRow label="Lugar de trabajo" value={selectedProvider.workplace || selectedProvider.clinic || 'No especificado'} />
                    {selectedProvider.workplaceAddress && (
                      <DetailRow label="Dirección" value={selectedProvider.workplaceAddress} />
                    )}
                    <DetailRow label="Precio de consulta" value={`$${selectedProvider.price || 0} USD`} />
                    {selectedProvider.bio && (
                      <View style={styles.bioContainer}>
                        <Text style={styles.bioLabel}>Biografía</Text>
                        <Text style={styles.bioText}>{selectedProvider.bio}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.providerDetailSection}>
                    <Text style={styles.providerDetailSectionTitle}>Documentos</Text>
                    {selectedProvider.documents ? (
                      <>
                        <DocumentViewer
                          label="Título profesional"
                          document={selectedProvider.documents.title}
                          onPress={() => handleViewDocument(selectedProvider.documents.title, 'Título profesional')}
                        />
                        <DocumentViewer
                          label="Cédula de identidad o pasaporte"
                          document={selectedProvider.documents.id}
                          onPress={() => handleViewDocument(selectedProvider.documents.id, 'Cédula/Pasaporte')}
                        />
                        <DocumentViewer
                          label="Certificación del Ministerio de Salud"
                          document={selectedProvider.documents.healthCert}
                          onPress={() => handleViewDocument(selectedProvider.documents.healthCert, 'Certificación de Salud')}
                        />
                        {selectedProvider.documents.specialization && (
                          <DocumentViewer
                            label="Certificado de especialización"
                            document={selectedProvider.documents.specialization}
                            onPress={() => handleViewDocument(selectedProvider.documents.specialization, 'Certificado de especialización')}
                          />
                        )}
                      </>
                    ) : (
                      <Text style={styles.noDocumentsText}>No hay documentos cargados</Text>
                    )}
                  </View>

                  <View style={styles.providerModalActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => {
                        Alert.alert(
                          'Rechazar solicitud',
                          `¿Estás seguro de que deseas rechazar la solicitud de ${selectedProvider.name}?`,
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Rechazar',
                              style: 'destructive',
                              onPress: () => {
                                const updatedProviders = providers.map((p) =>
                                  p.id === selectedProvider.id ? { ...p, verificationStatus: 'rechazado' } : p,
                                );
                                setProviders(updatedProviders);
                                setSelectedProvider(null);
                                Alert.alert('Solicitud rechazada', 'La solicitud ha sido rechazada.');
                              },
                            },
                          ],
                        );
                      }}
                    >
                      <Ionicons name="close-circle" size={20} color={palette.magenta} />
                      <Text style={styles.rejectButtonText}>Rechazar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleVerifyProvider(selectedProvider)}
                    >
                      <Ionicons name="checkmark-circle" size={20} color={palette.jet} />
                      <Text style={styles.approveButtonText}>Validar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para ver documentos */}
      <Modal
        visible={documentModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDocumentModalVisible(false)}
      >
        <View style={styles.documentModalOverlay}>
          <View style={styles.documentModalContent}>
            <View style={styles.documentModalHeader}>
              <Text style={styles.documentModalTitle}>{selectedDocument?.name || 'Documento'}</Text>
              <TouchableOpacity onPress={() => setDocumentModalVisible(false)}>
                <Ionicons name="close" size={24} color={palette.frost} />
              </TouchableOpacity>
            </View>
            {selectedDocument?.document?.uri && selectedDocument.document.uri !== 'simulated' ? (
              <ScrollView style={styles.documentViewer} contentContainerStyle={styles.documentViewerContent}>
                {(() => {
                  const doc = selectedDocument.document;
                  const isImage = doc.mimeType?.includes('image') || 
                                  doc.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                                  doc.uri?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                  
                  if (isImage) {
                    return (
                      <Image
                        source={{ uri: doc.uri }}
                        style={styles.documentImage}
                        resizeMode="contain"
                      />
                    );
                  } else {
                    return (
                      <View style={styles.documentPlaceholder}>
                        <Ionicons name="document-text" size={64} color={palette.neon} />
                        <Text style={styles.documentPlaceholderText}>
                          {doc.name || 'Documento PDF'}
                        </Text>
                        <Text style={styles.documentPlaceholderSubtext}>
                          {doc.size ? `Tamaño: ${(doc.size / 1024).toFixed(2)} KB` : 'Documento cargado'}
                        </Text>
                        <Text style={styles.documentPlaceholderSubtext}>
                          {doc.mimeType || 'Tipo: PDF'}
                        </Text>
                      </View>
                    );
                  }
                })()}
              </ScrollView>
            ) : (
              <View style={styles.documentPlaceholder}>
                <Ionicons name="document-outline" size={64} color={palette.slate} />
                <Text style={styles.documentPlaceholderText}>Documento simulado</Text>
                <Text style={styles.documentPlaceholderSubtext}>
                  Este es un documento de prueba. En producción se mostraría el archivo real.
                </Text>
                {selectedDocument?.document?.name && (
                  <Text style={styles.documentPlaceholderSubtext}>
                    Nombre: {selectedDocument.document.name}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const DocumentViewer = ({ label, document, onPress }) => {
  const hasDocument = document && (document.uploaded || document.uri);
  return (
    <TouchableOpacity
      style={[styles.documentViewerItem, hasDocument && styles.documentViewerItemUploaded]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={hasDocument ? 'document-text' : 'document-outline'}
        size={24}
        color={hasDocument ? palette.lime : palette.slate}
      />
      <View style={styles.documentViewerInfo}>
        <Text style={styles.documentViewerLabel}>{label}</Text>
        {hasDocument && (
          <Text style={styles.documentViewerStatus}>
            {document.name || 'Documento cargado'} {document.size ? `(${(document.size / 1024).toFixed(2)} KB)` : ''}
          </Text>
        )}
        {!hasDocument && (
          <Text style={styles.documentViewerMissing}>No cargado</Text>
        )}
      </View>
      <Ionicons name="eye-outline" size={20} color={hasDocument ? palette.neon : palette.slate} />
    </TouchableOpacity>
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
  providerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  providerModalContent: {
    backgroundColor: palette.jet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  providerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  providerModalTitle: {
    color: palette.frost,
    fontSize: 20,
    fontWeight: '700',
  },
  providerModalScroll: {
    flex: 1,
  },
  providerDetailSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.1)',
  },
  providerDetailSectionTitle: {
    color: palette.neon,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    color: palette.slate,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    color: palette.frost,
    fontSize: 15,
    fontWeight: '500',
  },
  bioContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 12,
  },
  bioLabel: {
    color: palette.slate,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bioText: {
    color: palette.frost,
    fontSize: 14,
    lineHeight: 20,
  },
  documentViewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  documentViewerItemUploaded: {
    borderColor: palette.lime,
    backgroundColor: 'rgba(163,230,53,0.1)',
  },
  documentViewerInfo: {
    flex: 1,
  },
  documentViewerLabel: {
    color: palette.frost,
    fontWeight: '600',
    fontSize: 14,
  },
  documentViewerStatus: {
    color: palette.lime,
    fontSize: 12,
    marginTop: 2,
  },
  documentViewerMissing: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  noDocumentsText: {
    color: palette.slate,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  providerModalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.2)',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(219,39,119,0.2)',
    borderWidth: 1,
    borderColor: palette.magenta,
  },
  rejectButtonText: {
    color: palette.magenta,
    fontWeight: '700',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: palette.lime,
  },
  approveButtonText: {
    color: palette.jet,
    fontWeight: '700',
  },
  documentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentModalContent: {
    backgroundColor: palette.jet,
    borderRadius: 24,
    width: '95%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  documentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  documentModalTitle: {
    color: palette.frost,
    fontSize: 18,
    fontWeight: '700',
  },
  documentViewer: {
    flex: 1,
  },
  documentViewerContent: {
    padding: 20,
    alignItems: 'center',
    minHeight: 400,
  },
  documentImage: {
    width: '100%',
    height: 500,
    borderRadius: 12,
  },
  documentPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  documentPlaceholderText: {
    color: palette.frost,
    fontSize: 16,
    fontWeight: '600',
  },
  documentPlaceholderSubtext: {
    color: palette.slate,
    fontSize: 14,
    textAlign: 'center',
  },
});

