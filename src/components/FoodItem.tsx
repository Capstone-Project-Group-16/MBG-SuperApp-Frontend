import { View, Text, StyleSheet, Pressable, ImageSourcePropType, Image } from "react-native"
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
  container: { width: "23%", alignItems: "center", gap: 11 },
  iconBox: {
    width: "70%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: { borderRadius: 12, backgroundColor: colors.brandBlue },
  icon: { width: "80%", height: "80%" },
  button: { height: 17, paddingHorizontal: 10, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  addBtn: { backgroundColor: "#6BB36F" },
  deleteBtn: { backgroundColor: "#FF6B6B" },
  buttonText: { color: colors.white, fontFamily: "Fredoka-Medium", fontSize: 12 },
})
