import { View, StyleSheet, ImageSourcePropType, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"

interface FoodItem {
    id: string
    label: string
    icon?: ImageSourcePropType
}

interface FoodTrayProps {
  selectedFoods: FoodItem[]
}

export default function FoodTray({ selectedFoods }: FoodTrayProps) {
  const trayWidth = wp("75%")
  const trayHeight = trayWidth * 0.7

    // Map selected foods to tray slots
  const traySlots = Array(5).fill(null)
  selectedFoods.slice(0, 5).forEach((food, index) => {
    traySlots[index] = food
  })

  return (
    <View style={[styles.container, { width: trayWidth, height: trayHeight }]}>
      <Image 
        source={require("../../assets/icon/food-tray.png")} 
        style={styles.trayImage} 
        resizeMode="contain" 
      />

      {/* Slot 1: Large slot (top-left) */}
      <View style={[styles.slot, {
        top: trayHeight * 0.08,
        left: trayWidth * 0.16,
        width: trayWidth * 0.4,
        height: trayHeight * 0.32,
      }]}>
        {traySlots[0] && (
            <Image source={traySlots[0].icon} style={styles.foodIcon} resizeMode="contain" />
        )}
      </View>

      {/* Slot 2: Round slot (top-right) */}
      <View style={[styles.slot, {
        top: trayHeight * 0.11,
        right: trayWidth * 0.04,
        width: trayWidth * 0.28,
        height: trayHeight * 0.28,
      }]}>
        {traySlots[1] && (
            <Image source={traySlots[1].icon} style={styles.foodIcon} resizeMode="contain" />
        )}
      </View>

      {/* Slot 3: Bottom-left */}
      <View style={[styles.slot, {
        bottom: trayHeight * 0.19,
        left: trayWidth * 0.06,
        width: trayWidth * 0.25,
        height: trayHeight * 0.25,
      }]}>
        {traySlots[2] && (
            <Image source={traySlots[2].icon} style={styles.foodIcon} resizeMode="contain" />
        )}
      </View>

      {/* Slot 4: Bottom-center */}
      <View style={[styles.slot, {
        bottom: trayHeight * 0.19,
        left: trayWidth * 0.5 - (trayWidth * 0.24) / 2,
        width: trayWidth * 0.25,
        height: trayHeight * 0.25,
      }]}>
        {traySlots[3] && (
            <Image source={traySlots[3].icon} style={styles.foodIcon} resizeMode="contain" />
        )}
      </View>

      {/* Slot 5: Bottom-right */}
      <View style={[styles.slot, {
        bottom: trayHeight * 0.19,
        right: trayWidth * 0.07,
        width: trayWidth * 0.25,
        height: trayHeight * 0.25,
      }]}>
        {traySlots[4] && (
            <Image source={traySlots[4].icon} style={styles.foodIcon} resizeMode="contain" />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  trayImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  slot: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  foodIcon: {
    width: "90%",
    height: "90%",
  },
})
