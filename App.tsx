import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { warmUp } from "./services/apiUtils";

import LoginScreen          from "./pages/LoginScreen";
import SelectUserScreen     from "./pages/SelectUserScreen";
import RegisterScreen       from "./pages/RegisterScreen";
import ProfileLoginScreen   from "./pages/UserLoginScreen";
import MainAppAdminScreen   from "./pages/MainAppAdminScreen";
import ChildDashboardScreen from "./pages/ChildDashboardScreen";
import VerifyQuestsScreen   from "./pages/VerifyQuestsScreen";
import SettingsScreen       from "./pages/SettingsScreen";
import AddChildScreen       from "./pages/AddChildScreen";
import EditProfileScreen    from "./pages/EditProfileScreen";

export type RootStackParamList = {
  Login:                undefined;
  SelectUser:           undefined;
  Register:             undefined;
  ProfileLogin:         { user: { id: string; name: string; type: string; avatarColor: string } };
  MainAppAdminScreen:   undefined;
  ChildDashboardScreen: { childId: string; childName: string; isAdmin?: boolean; parentId?: string };
  VerifyQuestsScreen:   undefined;
  Settings: {
    profileId: string; profileType: "PARENT" | "CHILD"; profileName: string;
    currentUsername?: string; currentEmail?: string;
    currentPhone?: string; currentAvatarColor?: string;
  };
  AddChild:    undefined;
  EditProfile: {
    profileId: string; profileType: "PARENT" | "CHILD"; profileName: string;
    currentUsername?: string; currentEmail?: string;
    currentPhone?: string; currentAvatarColor?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Pre-solve the InfinityFree bot challenge before the user reaches login
  useEffect(() => {
    warmUp("https://emeia.infinityfree.me/my-api/get_data.php");
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator id="main_stack">
        <Stack.Screen name="Login"                component={LoginScreen}          options={{ headerShown: false }} />
        <Stack.Screen name="SelectUser"           component={SelectUserScreen}      options={{ headerShown: false }} />
        <Stack.Screen name="Register"             component={RegisterScreen}        options={{ headerShown: false }} />
        <Stack.Screen name="ProfileLogin"         component={ProfileLoginScreen}    options={{ headerShown: false }} />
        <Stack.Screen name="MainAppAdminScreen"   component={MainAppAdminScreen}    options={{ headerShown: false }} />
        <Stack.Screen name="ChildDashboardScreen" component={ChildDashboardScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="VerifyQuestsScreen"   component={VerifyQuestsScreen}    options={{ headerShown: false }} />
        <Stack.Screen name="Settings"             component={SettingsScreen}        options={{ headerShown: false }} />
        <Stack.Screen name="AddChild"             component={AddChildScreen}        options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile"          component={EditProfileScreen}     options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
