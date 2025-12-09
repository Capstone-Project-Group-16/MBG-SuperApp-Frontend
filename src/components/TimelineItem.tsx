import { View, Text, StyleSheet, Image } from "react-native"
import { colors } from "../theme/Color"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

type TimelineItemProps = {
  label: string
  time?: string
  isStatus?: boolean // if false, status pending; if true, status active
  isLast?: boolean
}

export default function TimelineItem({ label, time, isStatus, isLast }: TimelineItemProps) {
  let dotContent = null

  const isCompleted = !!time
  const isActive = !isCompleted && isStatus === true
  const lineColor = isCompleted ? colors.brandBorder : isActive ? colors.textBlack : colors.brandGrey
  const textColor = isCompleted ? colors.brandBorder : isActive ? colors.textBlack : colors.brandGrey

  if (isCompleted) {
    dotContent = <Image source={require("../../assets/icon/complete.png")} style={styles.dotIcon} />
  } else if (isActive) {
    dotContent = <Image source={require("../../assets/icon/active.png")} style={styles.dotIcon} />
  } else {
    dotContent = <Image source={require("../../assets/icon/pending.png")} style={styles.dotIcon} />
  }

  return (
    <View style={styles.container}>
      {/* Dot + Line */}
      <View style={styles.progress}>
        <View style={[styles.dot]}>
          {dotContent}
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: lineColor }]} />}
      </View>

      {/* Label + Time */}
      <View style={styles.content}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        <Text style={[styles.time, { color: textColor }]}>{time}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: hp("2.5%") },
  progress: { alignItems: "center", marginRight: wp("4%"), paddingTop: hp("1.3%") },
  dot: { width: wp("3%"), height: wp("3%"), borderRadius: wp("1.5%") },
  dotIcon: { width: wp("3%"), height: wp("3%"),resizeMode: "contain" },
  line: { width: wp("0.5%"), height: hp("3%"), marginTop: hp("0.8%") },
  content: { paddingTop: hp("0.5%") },
  label: { fontFamily: "Jost-Medium", fontSize: RFValue(14), marginBottom: hp("0.5%") },
  time: { fontFamily: "Jost-Medium", fontSize: RFValue(14), color: "#999999" },
})
