import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./pages/LoginScreen";
import SelectUserScreen from "./pages/SelectUserScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ProfileLoginScreen from "./pages/UserLoginScreen";
import MainAppAdminScreen from "./pages/MainAppAdminScreen";
import ChildDashboardScreen from "./pages/ChildDashboardScreen";
import VerifyQuestsScreen from "./pages/VerifyQuestsScreen";

// Definim ce ecrane avem și ce parametri primesc (momentan niciunul)
export type RootStackParamList = {
  Login: undefined;
  SelectUser: undefined;
  Register: undefined;
  ProfileLogin: { user: { id: string; name: string; type: string } };
  MainAppAdminScreen: undefined;
  ChildDashboardScreen: { childId: string };
  VerifyQuestsScreen: { childId: string; childName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id="main_stack">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectUser"
          component={SelectUserScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileLogin"
          component={ProfileLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainAppAdminScreen"
          component={MainAppAdminScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChildDashboardScreen"
          component={ChildDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyQuestsScreen"
          component={VerifyQuestsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
