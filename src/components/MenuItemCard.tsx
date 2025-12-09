import { View, Text, StyleSheet, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"
import Button from "./Button"

interface MenuItem {
  id: string
  title: string
  description: string
  price?: string
  trayImage: any
}

interface Props {
  item: MenuItem
  onOrder?: () => void
  showPrice?: boolean
  showOrderButton?: boolean
}

export default function MenuItemCard({ item, onOrder, showPrice = true, showOrderButton = true }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* Left: Tray */}
        <View style={styles.trayWrapper}>
          <Image source={item.trayImage} style={styles.trayImage} resizeMode="contain" />
        </View>

        {/* Right: Title, description, price, button */}
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          {(showPrice || showOrderButton) && (
            <View style={styles.footer}>
              {showPrice && item.price && <Text style={styles.price}>{item.price}</Text>}
              {showOrderButton && onOrder && <Button title="ORDER" onPress={onOrder} fontSize={12} style={styles.orderButton} />}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp("4%"),
    marginBottom: hp("2%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    backgroundColor: colors.white,
    borderRadius: wp("3%"),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  trayWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  trayImage: {
    width: wp("32%"), 
    height: wp("32%"),
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(14),
    color: colors.textBlack,
    marginBottom: hp("0.5%"),
  },
  description: {
    fontFamily: "Jost",
    fontSize: RFValue(12),
    color: colors.textBlack,
    lineHeight: RFValue(16),
    marginBottom: hp("1%"),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
    justifyContent: "space-between",
  },
  price: {
    fontFamily: "Jost-Medium",
    fontSize: RFValue(12),
    color: colors.textBlack,
  },
  orderButton: {
    height: hp("3%"),
    paddingHorizontal: wp("4%"),
  },
})
