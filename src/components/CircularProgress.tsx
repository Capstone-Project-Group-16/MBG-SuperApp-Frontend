import { View, Text, StyleSheet } from "react-native"
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

type Props = {
    value: number
    max?: number
    unit?: string
    gradientColors: [string, string]
    backgroundColor: string
    sizePercent: number
    strokePercent: number
    valueFontSize: number
    unitFontSize?: number
}

export default function CircularProgress({ value, max = 100, unit, gradientColors, backgroundColor, sizePercent, strokePercent, valueFontSize, unitFontSize }: Props) {
    const size = wp(sizePercent + "%")
    const strokeWidth = wp(strokePercent + "%")
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const progress = (value / max) * circumference

    return (
        <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
            <Svg width={size} height={size}>

                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={gradientColors[0]} />
                        <Stop offset="100%" stopColor={gradientColors[1]} />
                    </LinearGradient>
                </Defs>

                {/* Background */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#grad)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    fill="none"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            <View style={styles.textWrap}>
                {unit === "%" ? (
                    <Text style={[styles.value, { fontSize: valueFontSize }]}>
                        {`${value}%`}
                    </Text>
                ) : (
                    <>
                        <Text style={[styles.value, { fontSize: valueFontSize }]}>
                            {max === 100 ? `${value}` : `${value}/${max}`}
                        </Text>

                        {!!unit && (
                            <Text style={[styles.unit, { fontSize: unitFontSize }]}>
                                {unit}
                            </Text>
                        )}
                    </>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textWrap: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    value: {
        fontFamily: "Jost-Medium",
        color: colors.textBlack,
    },
    unit: {
        fontFamily: "Jost-Medium",
        color: colors.textBlack,
        marginTop: 4,
    },
})
