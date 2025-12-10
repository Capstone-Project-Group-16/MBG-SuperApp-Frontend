"use client"

import { View, Text, StyleSheet, Animated, Image, type ImageSourcePropType, Alert } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useRef, useState } from "react"
import { colors } from "../theme/Color"
import { apiFetch } from "../lib/api"
import Button from "./Button"

type Segment = {
  id: number
  label: string
  icon?: ImageSourcePropType
}

interface Props {
  onSpin: (result: {
    prizeId: number
    prizeName: string
    prizeType: string
    studentExpPoints: number
    studentMbgPoints: number
  }) => void
  isSpinning: boolean
  segments: Segment[]
  studentProfileId: number
}

export default function SpinWheelItem({ onSpin, isSpinning, segments, studentProfileId }: Props) {
  const spinAnim = useRef(new Animated.Value(0)).current
  const [spinning, setSpinning] = useState(false)
  const segmentAngle = 360 / segments.length
  const visualCorrection = 45

  const OFFSETS = [
    { x: wp("10%"), y: wp("4%") },
    { x: wp("10%"), y: wp("4%") },
    { x: wp("10%"), y: wp("4%") },
    { x: wp("9%"), y: wp("6%") },
    { x: wp("9%"), y: wp("6%") },
    { x: wp("11%"), y: wp("6%") },
    { x: wp("11%"), y: wp("6%") },
    { x: wp("9%"), y: wp("6%") },
  ]

  const handleSpin = async () => {
    if (isSpinning) return

    setSpinning(true)

    try {
      const { res, data } = await apiFetch("/api/mbg-food-gamification/food-prize/spin", {
        method: "POST",
      })

      if (!res.ok) {
        Alert.alert("Error", data?.message || "Failed to spin the wheel")
        setSpinning(false)
        return
      }

      const normalize = (s?: string) =>
        (s ?? "").toString().toLowerCase().trim()

      function findSegmentIndexForPrize(prize: { prizeName: string, prizeType: string }, segments: Segment[]) {
        const name = normalize(prize.prizeName)        
        const type = normalize(prize.prizeType) 

        if (type.includes("sticker")) {
          const stickerIndexes = segments
            .map((s, i) => (normalize(s.label).includes("sticker") ? i : -1))
            .filter(i => i !== -1)
          if (stickerIndexes.length > 0) {
            return stickerIndexes[Math.floor(Math.random() * stickerIndexes.length)]
          }
          return -1
        }

        for (let i = 0; i < segments.length; i++) {
          const segLabel = normalize(segments[i].label)
          const segParts = segLabel.split(/\s+/) 
          const nameParts = name.split(/\s+/)   

          if (segParts.length >= 2 && nameParts.length >= 2) {
            const segNumber = segParts[0]
            const segUnit = segParts[1]        
            const nameNumber = nameParts[0]
            const prizeUnitFromType = type.includes("exp") ? "exp"
              : type.includes("mbg") ? "mbg"
                : nameParts[1] 

            if (segNumber === nameNumber && segUnit.includes(prizeUnitFromType)) {
              return i
            }
          }
        }

        const fallbackIndex = segments.findIndex(s =>
          normalize(s.label).includes(name) || name.includes(normalize(s.label))
        )
        if (fallbackIndex !== -1) return fallbackIndex

        return -1
      }

      const wonPrizeIndex = findSegmentIndexForPrize(data.prize, segments)

      if (wonPrizeIndex === -1) {
        Alert.alert("Error", "Prize not mapped to wheel segment")
        setSpinning(false)
        return
      }

      const targetAngle = wonPrizeIndex * segmentAngle + segmentAngle / 2
      const randomSpins = Math.floor(Math.random() * 5) + 5
      const totalRotation =  randomSpins * 360 + wonPrizeIndex * segmentAngle + segmentAngle / 2 + visualCorrection

      spinAnim.setValue(0)

      Animated.timing(spinAnim, {
        toValue: totalRotation,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setSpinning(false)
        onSpin({
          prizeId: data.prize?.prizeId,
          prizeName: data.prize?.prizeName,
          prizeType: data.prize?.prizeType,
          studentExpPoints: data.studentExpPoints,
          studentMbgPoints: data.studentMbgPoints,
        })
      })
    } catch (err) {
      console.error("[v0] Spin error:", err)
      Alert.alert("Error", "Failed to spin the wheel")
      setSpinning(false)
    }
  }

  const spinStyle = {
    transform: [
      {
        rotate: spinAnim.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
          extrapolate: "extend",
        }),
      },
    ],
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {/* Wheel pointer */}
        <View style={styles.pointerContainer}>
          <Image source={require("../../assets/icon/pointer-wheel.png")} style={styles.pointerImage} resizeMode="contain" />
        </View>

        {/* Wheel stand */}
        <View style={styles.standContainer}>
          <Image source={require("../../assets/icon/stand-wheel.png")} style={styles.standImage} resizeMode="contain" />
        </View>

        {/* Animated wheel circle */}
        <Animated.View style={[styles.rotatingContainer, spinStyle]}>
          <Image
            source={require("../../assets/icon/circle-wheel.png")}
            style={styles.circleImage}
            resizeMode="contain"
          />

          {/* Segments */}
          {segments.map((segment, idx) => {
            const offset = OFFSETS[idx] ?? { x: 0, y: 0 }

            return (
              <View
                key={segment.id}
                style={[
                  styles.segment,
                  {
                    transform: [{ rotate: `${idx * segmentAngle}deg` }],
                  },
                ]}
              >
                <View
                  style={{
                    transform: [
                      { translateX: offset.x },
                      { translateY: offset.y },
                      { rotate: `${-idx * segmentAngle}deg` },
                    ],
                    alignItems: "center",
                  }}
                >
                  {segment.icon && <Image source={segment.icon} style={styles.segmentIcon} resizeMode="contain" />}
                  <Text style={styles.segmentLabel}>{segment.label}</Text>
                </View>
              </View>
            )
          })}
        </Animated.View>
      </View>

      {/* Spin Button */}
      <View style={styles.buttonContainer}>
        <Button title="500 GEMS" onPress={handleSpin} disabled={isSpinning} style={{ width: wp("90%") }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    width: "100%",
    height: wp("100%"),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pointerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("37%"),
    zIndex: 10,
  },
  pointerImage: {
    width: wp("20%"),
    height: wp("20%"),
  },
  rotatingContainer: {
    width: wp("80%"),
    height: wp("80%"),
    alignItems: "center",
    justifyContent: "center",
  },
  circleImage: {
    width: "140%",
    height: "140%",
  },
  segment: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingTop: wp("10%"),
    paddingLeft: wp("18%"),
  },
  segmentIcon: {
    width: wp("7%"),
    height: wp("7%"),
  },
  segmentLabel: {
    fontSize: RFValue(10),
    fontFamily: "Fredoka-Medium",
    color: colors.textBlack,
    marginTop: hp("1%"),
    textAlign: "center",
  },
  standContainer: {
    position: "absolute",
    bottom: -wp("15%"),
    alignItems: "center",
    justifyContent: "center",
  },
  standImage: {
    width: wp("40%"),
    height: wp("40%"),
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: hp("10.5%"),
  },
})
