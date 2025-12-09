"use client"

import { View, Text, StyleSheet, Animated, Pressable } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useRef } from "react"
import { colors } from "../theme/Color"

const WHEEL_SEGMENTS = [
  { id: 1, label: "25 EXP", color: colors.nutriYellow, icon: "⚡" },
  { id: 2, label: "40 GEMS", color: colors.nutriPink, icon: "💎" },
  { id: 3, label: "15 EXP", color: colors.nutriBlue, icon: "⚡" },
  { id: 4, label: "15 GEMS", color: colors.nutriGreen, icon: "💎" },
  { id: 5, label: "25 EXP", color: colors.nutriYellow, icon: "⚡" },
  { id: 6, label: "40 GEMS", color: colors.nutriPink, icon: "💎" },
  { id: 7, label: "15 EXP", color: colors.nutriBlue, icon: "⚡" },
  { id: 8, label: "15 GEMS", color: colors.nutriGreen, icon: "💎" },
]

export default function SpinWheelComponent({
  onSpin,
  isSpinning,
}: {
  onSpin: (result: string) => void
  isSpinning: boolean
}) {
  const spinAnim = useRef(new Animated.Value(0)).current
  const wheelSize = wp("70%")
  const segmentAngle = 360 / WHEEL_SEGMENTS.length

  const handleSpin = () => {
    if (isSpinning) return

    const randomSpins = Math.floor(Math.random() * 5) + 5
    const randomSegment = Math.floor(Math.random() * WHEEL_SEGMENTS.length)
    const totalRotation = randomSpins * 360 + randomSegment * segmentAngle

    spinAnim.setValue(0)

    Animated.timing(spinAnim, {
      toValue: totalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      const winningSegment = WHEEL_SEGMENTS[randomSegment]
      onSpin(winningSegment.label)
    })
  }

  const spinStyle = {
    transform: [
      {
        rotate: spinAnim.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  }

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <View style={styles.pointer} />

      {/* Animated Wheel */}
      <Animated.View style={[styles.wheelContainer, spinStyle]}>
        <View style={[styles.wheel, { width: wheelSize, height: wheelSize }]}>
          {WHEEL_SEGMENTS.map((segment, idx) => {
            const rotation = idx * segmentAngle
            return (
              <View
                key={segment.id}
                style={[
                  styles.segment,
                  {
                    backgroundColor: segment.color,
                    transform: [{ rotate: `${rotation}deg` }],
                  },
                ]}
              >
                <Text style={styles.segmentText}>{segment.icon}</Text>
                <Text style={styles.segmentLabel}>{segment.label}</Text>
              </View>
            )
          })}
        </View>
      </Animated.View>

      {/* Stand */}
      <View style={styles.stand} />

      {/* Spin Button */}
      <Pressable
        style={({ pressed }) => [styles.spinButton, pressed && { opacity: 0.8 }]}
        onPress={handleSpin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>💎 5 GEMS</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("3%"),
  },
  pointer: {
    width: wp("6%"),
    height: hp("3%"),
    backgroundColor: colors.brandGrey,
    borderRadius: wp("1%"),
    zIndex: 10,
    marginBottom: hp("-1.5%"),
  },
  wheelContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  wheel: {
    borderRadius: wp("35%"),
    borderWidth: wp("3.5%"),
    borderColor: colors.brandOrange,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  segment: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: wp("8%"),
  },
  segmentText: {
    fontSize: RFValue(20),
  },
  segmentLabel: {
    fontSize: RFValue(12),
    fontFamily: "Fredoka-SemiBold",
    color: colors.textBlack,
    marginTop: hp("0.5%"),
    textAlign: "center",
  },
  stand: {
    width: wp("15%"),
    height: hp("4%"),
    backgroundColor: colors.textBlack,
    borderRadius: wp("2%"),
    marginTop: hp("1%"),
  },
  spinButton: {
    marginTop: hp("3%"),
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("2%"),
    backgroundColor: colors.brandGreen,
    borderRadius: wp("8%"),
    alignItems: "center",
  },
  spinButtonText: {
    fontSize: RFValue(18),
    fontFamily: "Fredoka-SemiBold",
    color: colors.white,
    letterSpacing: 0.5,
  },
})
