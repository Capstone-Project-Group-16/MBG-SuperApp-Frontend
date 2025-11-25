import BottomNav from "@/components/bottomNavigation";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import styled from "styled-components/native";

export default function CookProgress() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [isLoaded, setIsLoaded] = useState(false);

  // Dummy data sekolah
  const schoolData = [
    { name: "SMAN 1 DEPOK", totalClass: 8, totalOrder: 300, progress: 10 },
    { name: "SMAN 2 DEPOK", totalClass: 10, totalOrder: 420, progress: 40 },
    { name: "SMAN 3 DEPOK", totalClass: 6, totalOrder: 240, progress: 85 },
  ];

const filteredSchools = isLoaded
  ? schoolData.filter((school) => {
      if (selectedCity !== "All" && !school.name.includes(selectedCity.toUpperCase())) {
        return false;
      }
      return true;
    })
  : [];

  const handleBack = () => {
    router.replace("/home");
  };

  // styled components
const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  padding-top: 40px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  width: 90%;
  justify-content: center;
  position: relative;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  background-color: #c1e5c0;
  padding: 6px 12px;
  border-radius: 20px;
`;

const BackText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 14px;
  color: #2f5d2b;
  font-weight: 600;
`;

const Title = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 26px;
  font-weight: 600;
  color: black;
`;

const Logo = styled.Image`
  width: 90px;
  height: 90px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const FilterContainer = styled.View`
  width: 90%;
  margin-top: 10px;
`;

const FilterLabel = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 13px;
  font-weight: 700;
  color: black;
  margin-bottom: 6px;
`;

const FilterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const PickerContainer = styled.View`
  width: 45%;
  border: 2px solid rgba(69, 162, 70, 0.5);
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.35);
`;

const ResultLabel = styled.Text`
  width: 90%;
  font-family: "Fredoka-Regular";
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin-top: 20px;
`;

const Card = styled.View`
  width: 90%;
  background-color: #f8ffed;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  elevation: 3;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin-vertical: 8px;
`;

const ProgressContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const ProgressText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 14px;
  font-weight: 500;
  color: black;
`;

const InfoContainer = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const SchoolName = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 18px;
  font-weight: 600;
  color: black;
`;

const SchoolDetail = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 14px;
  font-weight: 300;
  color: black;
`;

const ArrowButton = styled.TouchableOpacity`
  background-color: #d8ffdb;
  border-radius: 25px;
  border: 2px solid rgba(69, 162, 70, 0.8);
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
`;

const ArrowText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 18px;
  font-weight: 700;
  color: #45a246;
`;

const LoadButton = styled.TouchableOpacity`
  margin-top: 12px;
  background-color: #45a246;
  padding: 10px;
  border-radius: 25px;
  align-items: center;
`;

const LoadText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

  return (
    <Container>
      {/* HEADER */}
      <Header>
        <BackButton onPress={handleBack}>
          <BackText>{"<"}</BackText>
        </BackButton>
        <Title>Cooking Progress</Title>
      </Header>

      {/* IMAGE */}
      <Logo source={require("../assets/images/cooking.png")} />

      {/* FILTER SECTION */}
      <FilterContainer>
        <FilterLabel>FILTER BY:</FilterLabel>
        <FilterRow>
          <PickerContainer>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(itemValue) => setSelectedCity(itemValue)}
              style={{ width: "100%", height: 40 }}
            >
              <Picker.Item label="City" value="All" />
              <Picker.Item label="Depok" value="Depok" />
              <Picker.Item label="Jakarta" value="Jakarta" />
            </Picker>
          </PickerContainer>

          <PickerContainer>
            <Picker
              selectedValue={selectedDate}
              onValueChange={(itemValue) => setSelectedDate(itemValue)}
              style={{ width: "100%", height: 40 }}
            >
              <Picker.Item label="Date" value="Today" />
              <Picker.Item label="Yesterday" value="Yesterday" />
              <Picker.Item label="Last week" value="LastWeek" />
            </Picker>
          </PickerContainer>
        </FilterRow>

        <LoadButton onPress={() => setIsLoaded(true)}>
          <LoadText>Load</LoadText>
        </LoadButton>

      </FilterContainer>

      {/* RESULT SECTION */}
      <ResultLabel>Result</ResultLabel>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}
      >
        {filteredSchools.map((school, index) => (
          <Card key={index}>
            <ProgressContainer>
              <AnimatedCircularProgress
                size={60}
                width={6}
                fill={school.progress}
                tintColor={school.progress >= 70 ? "#45A246" : "#FFCC00"}
                backgroundColor="#E0E0E0"
                rotation={0}
              >
                {() => <ProgressText>{`${school.progress}%`}</ProgressText>}
              </AnimatedCircularProgress>
            </ProgressContainer>

            <InfoContainer>
              <SchoolName>{school.name}</SchoolName>
              <SchoolDetail>
                Total class: {school.totalClass} {"\n"}
                Total order: {school.totalOrder}
              </SchoolDetail>
            </InfoContainer>

            <ArrowButton onPress={() => router.push({
              pathname: "/orderList",
              params: {
                viewLevel: "class",
                schoolName: school.name,
              },
            }
            )}>
              <ArrowText>{">"}</ArrowText>
            </ArrowButton>
          </Card>
        ))}
      </ScrollView>

      <BottomNav />
    </Container>
  );
}