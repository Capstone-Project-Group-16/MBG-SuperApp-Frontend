import { NavigationContainer, DefaultTheme, type Theme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "react-native"
import { useFonts } from "expo-font";
import SplashScreen from "./src/screen/SplashScreen"
import SignIn from "./src/screen/SignIn"
import SignUp from "./src/screen/SignUp"
import Home from "./src/screen/Home"
import FoodCustomizer from "./src/screen/FoodCustomizer"
import "react-native-gesture-handler";

export type RootStackParamList = {
  Splash: undefined
  SignIn: undefined
  SignUp: undefined
  Home: undefined
  FoodCustomizer: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

// Brand-aware navigation theme
const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F3FFE9", 
    card: "#F3FFE9",
    text: "#111111",
    border: "#6BB36F",
    primary: "#1E4B2F",
    notification: "#F69A4C",
  },
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Madimi-One": require("./assets/font/madimi-one/MadimiOne-Regular.ttf"),
    "Fredoka": require("./assets/font/fredoka/Fredoka-VariableFont_wdth,wght.ttf"),
    "Fredoka-Medium": require("./assets/font/fredoka/static/Fredoka-Medium.ttf"),
    "Fredoka-SemiBold": require("./assets/font/fredoka/static/Fredoka-SemiBold.ttf"),
    "Fredoka-Bold": require("./assets/font/fredoka/static/Fredoka-Bold.ttf"),
    "Jost": require("./assets/font/jost/Jost-VariableFont_wght.ttf"),
    "Jost-Medium": require("./assets/font/jost/static/Jost-Medium.ttf"),
    "Jost-SemiBold": require("./assets/font/jost/static/Jost-SemiBold.ttf"),
  });
  
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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="FoodCustomizer" component={FoodCustomizer} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
