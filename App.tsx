import { NavigationContainer, DefaultTheme, type Theme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "react-native"
import { useFonts } from "expo-font";
import SplashScreen from "./src/screen/SplashScreen"
import SignIn from "./src/screen/SignIn"
import Home from "./src/screen/Home"
import FoodCustomizer from "./src/screen/FoodCustomizer"
import FoodOrder from "./src/screen/FoodOrder"
import FoodScanner from "./src/screen/FoodScanner";
import NutritionFacts from "./src/screen/NutritionFacts";
import FoodWaste from "./src/screen/FoodWaste";
import MBGQuiz from "./src/screen/MBGQuiz";
import QuizResult from "./src/screen/QuizResult";
import DistributionTracker from "./src/screen/DistributionTracker";
import SpinWheel from "./src/screen/SpinWheel";
import Leaderboard from "./src/screen/Leaderboard";
import "react-native-gesture-handler";

export type RootStackParamList = {
  SplashScreen: undefined
  SignIn: undefined
  Home: { studentProfileId: number }
  FoodCustomizer: { studentProfileId: number }
  FoodOrder: {
    studentProfileId: number
    foodId: number          
    foodName: string        
    foodPrice: number       
    tray: any              
    foodImageLink?: string | null  
  }
  FoodScanner: { scanMode?: "distribution" | "waste" }
  NutritionFacts: undefined
  FoodWaste: undefined
  MBGQuiz: undefined
  QuizResult: { score: number; correct: number; incorrect: number; xp: number; gems: number }
  DistributionTracker: { studentProfileId: number }
  SpinWheel: { studentProfileId: number }
  Leaderboard: { studentProfileId: number }
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
    "Jost-Bold": require("./assets/font/jost/static/Jost-Bold.ttf"),
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
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="FoodCustomizer" component={FoodCustomizer} />
        <Stack.Screen name="FoodOrder" component={FoodOrder} />
        <Stack.Screen name="FoodScanner" component={FoodScanner} />
        <Stack.Screen name="NutritionFacts" component={NutritionFacts} />
        <Stack.Screen name="FoodWaste" component={FoodWaste} />
        <Stack.Screen name="MBGQuiz" component={MBGQuiz} />
        <Stack.Screen name="QuizResult" component={QuizResult} />
        <Stack.Screen name="DistributionTracker" component={DistributionTracker} />
        <Stack.Screen name="SpinWheel" component={SpinWheel} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}