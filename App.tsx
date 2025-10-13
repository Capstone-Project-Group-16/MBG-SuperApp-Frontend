import { NavigationContainer, DefaultTheme, type Theme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "react-native"
import SplashScreen from "./src/screen/SplashScreen"
import SignIn from "./src/screen/SignIn"
import SignUp from "./src/screen/SignUp"
import "react-native-gesture-handler";

export type RootStackParamList = {
  Splash: undefined
  SignIn: undefined
  SignUp: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

// Brand-aware navigation theme
const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F3FFE9", // brandMint
    card: "#F3FFE9",
    text: "#111111",
    border: "#6BB36F",
    primary: "#1E4B2F",
    notification: "#F69A4C",
  },
}

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
