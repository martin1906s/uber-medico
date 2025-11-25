import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, ROLE_TYPES, useAppContext } from './src/context/AppContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { DoctorDetailScreen } from './src/screens/DoctorDetailScreen';
import { BookingScreen } from './src/screens/BookingScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { ProviderOnboardingScreen } from './src/screens/ProviderOnboardingScreen';
import { HealthHomeScreen } from './src/screens/HealthHomeScreen';
import { HealthAppointmentsScreen } from './src/screens/HealthAppointmentsScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { MyAppointmentsScreen } from './src/screens/MyAppointmentsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { UserRegisterScreen } from './src/screens/UserRegisterScreen';
import { UserLoginScreen } from './src/screens/UserLoginScreen';
import { HealthLoginScreen } from './src/screens/HealthLoginScreen';
import { ProviderRegisterScreen } from './src/screens/ProviderRegisterScreen';
import { LogoutButton } from './src/components/LogoutButton';
import { palette } from './src/theme/colors';

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const HealthStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.jet,
    text: palette.frost,
    card: palette.graphite,
  },
};

const UserTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#060911',
        borderTopColor: 'rgba(148,163,184,0.2)',
        paddingBottom: 6,
        paddingTop: 6,
        height: 64,
      },
      tabBarActiveTintColor: palette.neon,
      tabBarInactiveTintColor: palette.slate,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Explorar: 'compass-outline',
          Bookings: 'calendar-outline',
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Explorar" component={HomeScreen} />
    <Tab.Screen
      name="Bookings"
      component={MyAppointmentsScreen}
      options={{ title: 'Citas' }}
    />
  </Tab.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="UserLogin" component={UserLoginScreen} />
    <AuthStack.Screen name="UserRegister" component={UserRegisterScreen} />
    <AuthStack.Screen name="HealthLogin" component={HealthLoginScreen} />
    <AuthStack.Screen name="ProviderRegister" component={ProviderRegisterScreen} />
  </AuthStack.Navigator>
);

const UserNavigator = () => (
  <UserStack.Navigator screenOptions={{ headerShown: false }}>
    <UserStack.Screen name="UserTabs" component={UserTabNavigator} />
    <UserStack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
    <UserStack.Screen name="Booking" component={BookingScreen} />
    <UserStack.Screen name="Payment" component={PaymentScreen} />
  </UserStack.Navigator>
);

const HealthStaffNavigator = () => (
  <HealthStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: palette.jet },
      headerTintColor: palette.frost,
      headerRight: () => <LogoutButton />,
    }}
  >
    <HealthStack.Screen
      name="HealthHome"
      component={HealthHomeScreen}
      options={{ headerShown: false }}
    />
    <HealthStack.Screen
      name="HealthAppointments"
      component={HealthAppointmentsScreen}
      options={{ headerShown: false }}
    />
    <HealthStack.Screen
      name="ProviderOnboarding"
      component={ProviderOnboardingScreen}
      options={{ title: 'Perfil profesional' }}
    />
  </HealthStack.Navigator>
);

const AdminNavigator = () => (
  <AdminStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: palette.jet },
      headerTintColor: palette.frost,
      headerRight: () => <LogoutButton />,
    }}
  >
    <AdminStack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{ title: 'Centro administrativo' }}
    />
  </AdminStack.Navigator>
);

const RoleBasedNavigator = () => {
  const { role } = useAppContext();

  if (!role) {
    return <AuthNavigator />;
  }

  if (role === ROLE_TYPES.USER) {
    return <UserNavigator />;
  }

  if (role === ROLE_TYPES.HEALTH) {
    return <HealthStaffNavigator />;
  }

  return <AdminNavigator />;
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <RoleBasedNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
