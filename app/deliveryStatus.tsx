// ini kode untuk set delivery detail (tujuan)

import BottomNav from "@/components/bottomNavigation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

// styled components
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 30px;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 26px;
  font-family: "Fredoka-Regular";
  font-weight: 600;
  color: black;
  margin-top: 10px;
`;

const SectionLabel = styled.Text`
  font-size: 12px;
  font-family: "Fredoka-Regular";
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

const PickerRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledPicker = styled(Picker)`
  width: 48%;
  height: 40px;
  border-radius: 30px;
  border: 2px rgba(69, 162, 70, 0.5) solid;
  background-color: white;
`;

const InfoText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 14px;
  color: black;
  margin-top: 5px;
`;

const Option = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 100%;
  background-color: ${(p: { isSelected: boolean }) =>
    p.isSelected ? "#d8ffdb" : "white"};
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
  width: 80px;
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
  const [selectedCity, setSelectedCity] = useState<string>("City");
  const [selectedSchool, setSelectedSchool] = useState<string>("School");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const cities = ["Depok", "Jakarta", "Bekasi"];
  const schools = ["SMAN 1 Depok", "SMAN 2 Depok", "SMAN 1 Bekasi"];

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowPicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <Container>
      {/* Back Button */}
      <BackButton onPress={() => router.push("/home")}>
        <BackArrow>{"←"}</BackArrow>
      </BackButton>

      <Title>Delivery Detail</Title>

      <SectionLabel>FILL IN DELIVERY DETAIL</SectionLabel>

      <Box>
        <SectionLabel>SELECT DESTINATION</SectionLabel>

        {/* Dropdown Picker */}
        <PickerRow>
          <StyledPicker
            selectedValue={selectedCity}
            onValueChange={(itemValue: any) => setSelectedCity(itemValue as string)}
          >
            <Picker.Item label="City" value="City" />
            {cities.map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </StyledPicker>

          <StyledPicker
            selectedValue={selectedSchool}
            onValueChange={(itemValue: any) => setSelectedSchool(itemValue as string)}
          >
            <Picker.Item label="School" value="School" />
            {schools.map((school) => (
              <Picker.Item key={school} label={school} value={school} />
            ))}
          </StyledPicker>
        </PickerRow>

        <InfoText>City : {selectedCity}</InfoText>
        <InfoText>School : {selectedSchool}</InfoText>

        {/* DELIVERY SERVICE */}
        <SectionLabel>CHOOSE DELIVERY SERVICE</SectionLabel>
        <Option
          isSelected={selectedService === "driver"}
          onPress={() => setSelectedService("driver")}
        >
          <OptionText>Designated driver (Recommended)</OptionText>
        </Option>
        <Option
          isSelected={selectedService === "other"}
          onPress={() => setSelectedService("other")}
        >
          <OptionText>Other services</OptionText>
          <OptionSub>(Gojek, Grab, etc.)</OptionSub>
        </Option>

        {/* SCHEDULE */}
        <SectionLabel>SET SCHEDULE FOR DELIVERY</SectionLabel>

        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <TimeBox>
            <TimeText>
              {time.getHours().toString().padStart(2, "0")}:
              {time.getMinutes().toString().padStart(2, "0")}
            </TimeText>
          </TimeBox>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </Box>

      <StartButton onPress={() => router.push("/deliveryProgress")}>
        <StartText>START DELIVERY</StartText>
      </StartButton>

      <BottomNav />
    </Container>
  );
}