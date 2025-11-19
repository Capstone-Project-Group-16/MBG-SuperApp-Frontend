import { View, Text, StyleSheet, Pressable, type ViewStyle, ImageSourcePropType, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
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
    padding: wp("4.5%"),
    paddingBottom: wp("5%"),
    borderRadius: wp("8%"),
    borderWidth: 2,
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandMint,
    gap: wp("3%"),
    shadowColor: colors.brandGreen,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 2 },
    elevation: 6,
  },
  leftIconContainer: { width: wp("18%"), height: wp("18%"), borderRadius: wp("3.5%"), borderWidth: 2, borderColor: colors.brandMint, backgroundColor: colors.brandMint, marginRight: wp("1%") },
  leftIconImage: { width: wp("18%"), height: wp("18%"), alignSelf: "center" },
  textCol: { flex: 1 },
  title: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.textBlack, marginBottom: hp("0.75%"), letterSpacing: 0.5 },
  desc: { fontFamily: "Jost", fontSize: RFValue(14), color: colors.textBlack, opacity: 0.9, lineHeight: 22 },
})
