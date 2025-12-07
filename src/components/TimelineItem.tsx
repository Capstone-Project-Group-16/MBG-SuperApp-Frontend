import { View, Text, StyleSheet } from "react-native"
import { colors } from "../theme/Color"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

type TimelineItemProps = {
  label: string
  time: string
  isActive: boolean
  isCompleted: boolean
  isLast: boolean
}

export default function TimelineItem({ label, time, isActive, isCompleted, isLast }: TimelineItemProps) {
  const dotColor = isCompleted ? colors.brandGreen : isActive ? colors.brandGreen : "#CCCCCC"
  const lineColor = isCompleted || isActive ? colors.brandGreen : "#CCCCCC"
  const textColor = isCompleted ? colors.brandGreen : isActive ? colors.textBlack : "#999999"

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        {!isLast && <View style={[styles.line, { backgroundColor: lineColor }]} />}
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: hp("2.5%") },
  progress: { alignItems: "center", marginRight: wp("4%") },
  dot: { width: wp("3%"), height: wp("3%"), borderRadius: wp("1.5%") },
  line: { width: wp("0.5%"), height: hp("3%"), marginTop: hp("0.5%") },
  content: { paddingTop: hp("0.5%") },
  label: { fontFamily: "Fredoka-Medium", fontSize: RFValue(14), marginBottom: hp("0.5%") },
  time: { fontFamily: "Fredoka", fontSize: RFValue(12), color: "#999999" },
})
