// deliveryStatus.tsx (fixed)
import BottomNav from "@/components/bottomNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import {
  createDeliverySchedule,
  getProvinces,
  getSchools,
} from "../lib/api";

// styled components (kept as you had them)
const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 30px;
  align-items: center;
`;

// ... (other styled components unchanged)
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
  background-color: ${(p: any) => (p.isSelected ? "#d8ffdb" : "white")};
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

  // backend lists
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [allSchools, setAllSchools] = useState<any[]>([]); // raw schools from API
  const [schoolList, setSchoolList] = useState<any[]>([]); // filtered by province

  // driver list: backend endpoint for a list isn't available in api.js; keep placeholder array for now
  const [driverList, setDriverList] = useState<any[]>([]);

  // selection state (declare variables that were missing)
  const [selectedCity, setSelectedCity] = useState<string>("City"); // this stores locationId as string for filtering
  const [selectedSchool, setSelectedSchool] = useState<string>("School");
  const [selectedService, setSelectedService] = useState<string | number | null>(null);

  // date & time pickers
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  // load provinces and schools on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const provRaw = await getProvinces();
        setProvinceList(provRaw || []);

        const schRaw = await getSchools();
        setAllSchools(schRaw || []);

        // driverList: since there's no getDriversByCatering in api.js currently,
        // keep driverList empty or use placeholder (you can replace once API is ready)
        // setDriverList([{ driverId: 1, driverName: "John Driver" }]);
      } catch (err) {
        console.log("Error loading delivery setup:", err);
      }
    };

    fetchInitialData();
  }, []);

  // when user selects province (city), filter schools
  const handleSelectCity = (locationIdValue: string) => {
    setSelectedCity(locationIdValue);

    // filter allSchools by schoolLocationId === Number(locationIdValue)
    const filtered = allSchools.filter(
      (s: any) => String(s.schoolLocationId) === String(locationIdValue)
    );
    setSchoolList(filtered);
    // reset selected school
    setSelectedSchool("School");
  };

  // date/time handlers
  const onDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) setDeliveryDate(selected);
  };

  const onTimeChange = (_: any, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) setTime(selected);
  };

  // helpers to format date/time for backend
  const formatDate = (d: Date) => {
    // format YYYY-MM-DD
    return d.toISOString().split("T")[0];
  };

  const formatTime = (t: Date) => {
    // format HH:mm:ss or HH:mm
    const hh = t.getHours().toString().padStart(2, "0");
    const mm = t.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}:00`;
  };

  // start delivery (call backend createDeliverySchedule)
  const handleStartDelivery = async () => {
    try {
      const cateringIdStr = await AsyncStorage.getItem("cateringId");
      if (!cateringIdStr) throw new Error("cateringId not found in storage");
      const cateringId = Number(cateringIdStr);

      // we currently only have createDeliverySchedule(cateringId, pickUpDate, pickUpTime)
      const pickUpDate = formatDate(deliveryDate);
      const pickUpTime = formatTime(time);

      const resp = await createDeliverySchedule(cateringId, pickUpDate, pickUpTime);

      console.log("createDeliverySchedule response:", resp);

      // navigate to deliveryProgress (you might want to pass deliveryId if resp returns it)
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
        <SectionLabel>SELECT DESTINATION</SectionLabel>

        {/* Dropdown Picker */}
        <PickerRow>
          <StyledPicker
            selectedValue={selectedCity}
            onValueChange={(itemValue: any) => handleSelectCity(String(itemValue))}
          >
            <Picker.Item label="City" value="City" />
            {provinceList.map((prov: any) => (
              // province objects in your api.js are { province, locationId }
              <Picker.Item
                key={prov.locationId}
                label={prov.province}
                value={String(prov.locationId)}
              />
            ))}
          </StyledPicker>

          <StyledPicker
            selectedValue={selectedSchool}
            onValueChange={(value: any) => setSelectedSchool(String(value))}
          >
            <Picker.Item label="School" value="School" />
            {schoolList.map((school: any) => (
              <Picker.Item
                key={school.schoolId}
                label={school.schoolName}
                value={school.schoolName}
              />
            ))}
          </StyledPicker>
        </PickerRow>

        <InfoText>City : {selectedCity === "City" ? "-" : selectedCity}</InfoText>
        <InfoText>School : {selectedSchool === "School" ? "-" : selectedSchool}</InfoText>

        {/* DELIVERY SERVICE */}
        <SectionLabel>DELIVERY SERVICE</SectionLabel>

        {/* If driverList is available from backend later, map it; else show single Option */}
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

        {/* SCHEDULE */}
        <SectionLabel>SET SCHEDULE FOR DELIVERY</SectionLabel>

        {/* Date picker */}
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
            onChange={onDateChange}
          />
        )}

        {/* Time picker */}
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
            onChange={onTimeChange}
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
