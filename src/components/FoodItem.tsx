import { View, Text, StyleSheet, Pressable, ImageSourcePropType, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

type Props = {
  id: string
  label: string
  icon?: ImageSourcePropType
  isSelected: boolean
  onToggle: () => void
}

export default function FoodItem({ id, label, icon, isSelected, onToggle }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <Pressable
        onPress={onToggle}
        style={[styles.button, isSelected ? styles.deleteBtn : styles.addBtn]}
        accessibilityRole="button"
        accessibilityLabel={isSelected ? `Remove ${label}` : `Add ${label}`}
      >
        <Text style={styles.buttonText}>{isSelected ? "Delete" : "Add"}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: wp("19%"), alignItems: "center", gap: wp("3%") },
  iconBox: {
    width: "65%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: { borderRadius: wp("3%"), backgroundColor: colors.brandBlue },
  icon: { width: "85%", height: "85%" },
  button: { height: wp("4%"), paddingHorizontal: wp("2.5%"), marginTop: wp("0.1%"), borderRadius: wp("2%"), alignItems: "center", justifyContent: "center" },
  addBtn: { backgroundColor: "#6BB36F" },
  deleteBtn: { backgroundColor: "#FF6B6B" },
  buttonText: { color: colors.white, fontFamily: "Fredoka-Medium", fontSize: RFValue(10) },
})
