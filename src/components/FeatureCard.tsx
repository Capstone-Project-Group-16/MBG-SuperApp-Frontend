import { View, Text, StyleSheet, Pressable, type ViewStyle, ImageSourcePropType, Image } from "react-native"
import { colors } from "../theme/Color"

type Props = {
  title: string
  description: string
  icon?: ImageSourcePropType
  onPress?: () => void
  style?: ViewStyle
}

export default function FeatureCard({ title, description, icon, onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]} accessibilityRole="button">
      <View style={[styles.leftIconContainer]}>
        {icon && <Image source={icon} style={styles.leftIconImage} resizeMode="contain" />}
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 18,
    paddingBottom: 18,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandMint,
    gap: 12,
    shadowColor: colors.brandGreen,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 2 },
    elevation: 6,
  },
  leftIconContainer: { width: 64, height: 64, borderRadius: 14, borderWidth: 2, borderColor: colors.brandMint, backgroundColor: colors.brandMint, marginRight: 4 },
  leftIconImage: { width: 64, height: 64, alignSelf: "center" },
  textCol: { flex: 1 },
  title: { fontFamily: "Fredoka-SemiBold", fontSize: 18, color: colors.textBlack, marginBottom: 6, letterSpacing: 0.5 },
  desc: { fontFamily: "Jost", fontSize: 14, color: colors.textBlack, opacity: 0.9, lineHeight: 18 },
})
