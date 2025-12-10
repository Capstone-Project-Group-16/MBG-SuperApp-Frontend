// deliveryStatus.tsx (clean + updated)
import BottomNav from "@/components/bottomNavigation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { createDeliverySchedule } from "../lib/api";

// styled components
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 30px;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 26px;
  font-family: "Fredoka-Bold";
  font-weight: 600;
  color: black;
  margin-top: 10px;
`;

const SectionLabel = styled.Text`
  font-size: 14px;
  font-family: "Fredoka-Medium";
  font-weight: 700;
  color: black;
  margin-bottom: 8px;
  margin-top: 10px;
`;

const Box = styled.View`
  background-color: #ebf4e5;
  width: 90%;
  border-radius: 10px;
  border: 2px rgba(69, 162, 70, 0.5) solid;
  padding: 15px;
  margin-top: 10px;
`;

const InfoText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 14px;
  color: black;
  margin-top: 5px;
`;

const Option = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 100%;
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? "#d8ffdb" : "white"};
  border-radius: 5px;
  border: 2px rgba(69, 162, 70, 0.5) solid;
  padding: 8px 10px;
  margin-top: 6px;
`;

const OptionText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 13px;
  color: black;
`;

const OptionSub = styled.Text`
  font-size: 10px;
  color: #878787;
`;

const TimeBox = styled.View`
  background-color: white;
  border: 2px rgba(69, 162, 70, 0.5) solid;
  width: 120px;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
`;

const TimeText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 18px;
  color: black;
`;

const StartButton = styled.TouchableOpacity`
  width: 90%;
  height: 50px;
  background-color: #214626;
  border-radius: 26px;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
`;

const StartText = styled.Text`
  color: white;
  font-size: 16px;
  font-family: "Fredoka-Regular";
  font-weight: 700;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 40px;
  left: 20px;
`;

const BackArrow = styled.Text`
  font-size: 24px;
  color: #45a246;
`;

export default function DeliveryStatus() {
  const router = useRouter();

  // ⬅ NEW: get params from plateScan.tsx
  const { studentName, schoolName, plateCode } = useLocalSearchParams();

  // driver
  const [driverList, setDriverList] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  // date & time
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  // format helpers
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const formatTime = (t: Date) => {
    const hh = t.getHours().toString().padStart(2, "0");
    const mm = t.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}:00`;
  };

  // start delivery
  const handleStartDelivery = async () => {
    try {
      const pickUpDate = formatDate(deliveryDate);
      const pickUpTime = formatTime(time);

      const resp = await createDeliverySchedule(pickUpDate, pickUpTime);
      console.log("createDeliverySchedule response:", resp);

      router.push("/deliveryProgress");
    } catch (err) {
      console.error("Error creating delivery:", err);
    }
  };

  return (
    <Container>
      <BackButton onPress={() => router.push("/home")}>
        <BackArrow>{"←"}</BackArrow>
      </BackButton>

      <Title>Delivery Detail</Title>

      <SectionLabel>FILL IN DELIVERY DETAIL</SectionLabel>

      <Box>
        {/* --- SELECT DESTINATION (Revised) --- */}
        <SectionLabel>DELIVERY DESTINATION</SectionLabel>

        <InfoText>School : {schoolName ?? "-"}</InfoText>
        <InfoText>Student : {studentName ?? "-"}</InfoText>
        <InfoText>Plate : {plateCode ?? "-"}</InfoText>

        {/* --- DELIVERY SERVICE (unchanged) --- */}
        <SectionLabel>DELIVERY SERVICE</SectionLabel>

        {driverList.length > 0 ? (
          driverList.map((driver: any) => (
            <Option
              key={driver.driverId}
              isSelected={String(selectedService) === String(driver.driverId)}
              onPress={() => setSelectedService(driver.driverId)}
            >
              <OptionText>{driver.userFullName ?? driver.driverName}</OptionText>
              <OptionSub>ID: {driver.driverId}</OptionSub>
            </Option>
          ))
        ) : (
          <Option
            isSelected={selectedService === "driver"}
            onPress={() => setSelectedService("driver")}
          >
            <OptionText>Designated driver (Recommended)</OptionText>
            <OptionSub>Driver will be auto-assigned</OptionSub>
          </Option>
        )}

        {/* --- SCHEDULE (unchanged) --- */}
        <SectionLabel>SET SCHEDULE FOR DELIVERY</SectionLabel>

        {/* Date */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TimeBox>
            <TimeText>{formatDate(deliveryDate)}</TimeText>
          </TimeBox>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={deliveryDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) setDeliveryDate(selected);
            }}
          />
        )}

        {/* Time */}
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{ marginTop: 8 }}
        >
          <TimeBox>
            <TimeText>
              {time.getHours().toString().padStart(2, "0")}:
              {time.getMinutes().toString().padStart(2, "0")}
            </TimeText>
          </TimeBox>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              setShowTimePicker(false);
              if (selected) setTime(selected);
            }}
          />
        )}
      </Box>

      <StartButton onPress={handleStartDelivery}>
        <StartText>START DELIVERY</StartText>
      </StartButton>

      <BottomNav />
    </Container>
  );
}
