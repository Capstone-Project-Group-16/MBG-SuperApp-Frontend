import BottomNav from "@/components/bottomNavigation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import styled from "styled-components/native";
import { getProvinces, getSchools, getStudentsBySchool } from "../lib/api";


// styled-components
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

  // data types
  type Province = {
  province: string;
  locationId: number;
};

type SchoolApi = {
  schoolId: number;
  schoolName: string;
  schoolLocationId?: number | null;
};

type StudentApi = {
  userId: number;
  schoolId: number;
  userFullName: string;
};

type DisplaySchool = {
  name: string;
  schoolId: number;
  totalOrder: number;
  progress: number;
};


export default function CookProgress() {
  const router = useRouter();

  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [appliedCity, setAppliedCity] = useState<string>("All");
  const [appliedDate, setAppliedDate] = useState<Date>(new Date());

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [schoolList, setSchoolList] = useState<SchoolApi[]>([]);
  const [displaySchools, setDisplaySchools] = useState<DisplaySchool[]>([]);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const provRaw = await getProvinces();
        const schRaw = await getSchools();

        // cast to typed arrays
        const provs = (provRaw as any[])?.map((p) => ({
          province: p.province,
          locationId: Number(p.locationId),
        })) as Province[];

        const schools = (schRaw as any[])?.map((s) => ({
          schoolId: Number(s.schoolId),
          schoolName: s.schoolName,
          schoolLocationId:
            s.schoolLocationId === undefined || s.schoolLocationId === null
              ? undefined
              : Number(s.schoolLocationId),
        })) as SchoolApi[];

        setProvinceList(provs);
        setSchoolList(schools);
      } catch (err) {
        console.error("Init Load Error:", err);
      }
    };

    fetchInit();
  }, []);


  const handleLoadFilter = async () => {
    try {
      setIsLoaded(false);

      // ambil semua sekolah sesuai filter provinsi (locationId)
      const filtered =
        appliedCity === "All"
          ? schoolList
          : schoolList.filter(
              (s) => String(s.schoolLocationId) === String(appliedCity)
            );

      // hitung total order per sekolah
      const result: DisplaySchool[] = [];

      for (let s of filtered) {
        const students = await getStudentsBySchool(s.schoolId);

        // totalOrder = jumlah murid (karena belum ada API order)
        const totalOrder = students.length;
        

        result.push({
          name: s.schoolName,
          schoolId: s.schoolId,
          totalOrder: totalOrder,
          progress: 0, // circular progress matiin dulu
        });
      }

      setDisplaySchools(result);
      setIsLoaded(true);
    } catch (err) {
      console.log("Load Filter Error:", err);
    }
  };

  const handleBack = () => {
    router.replace("/home");
  };


  return (
    <Container>
      {/* HEADER */}
      <Header>
        <BackButton onPress={handleBack}>
          <BackText>{"<"}</BackText>
        </BackButton>
        <Title>Cooking Progress</Title>
      </Header>

      <Logo source={require("../assets/images/cooking.png")} />

      {/* FILTER */}
      <FilterContainer>
        <FilterLabel>FILTER BY:</FilterLabel>

        <FilterRow>
          <PickerContainer>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(value) => setSelectedCity(value)}
            >
              <Picker.Item label="All City" value="All" />

              {provinceList.map((p) => (
                <Picker.Item
                  key={p.locationId}
                  label={p.province}
                  value={String(p.locationId)}
                />
              ))}
            </Picker>
          </PickerContainer>

          <PickerContainer>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text>
              {selectedDate.toDateString()}
            </Text>
          </TouchableOpacity>

        {/* DATE PICKER POPUP */}
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) {
                setSelectedDate(date);

                // kalau nanti mau dipanggil API filter tanggal, panggil fungsi di sini
                // loadStudentOrdersByDate(date);
              }
            }}
          />
        )}
      </PickerContainer>

        </FilterRow>

        <LoadButton
          onPress={() => {
            setAppliedCity(selectedCity);
            setAppliedDate(selectedDate);
            handleLoadFilter();
          }}
        >
          <LoadText>Load</LoadText>
        </LoadButton>
      </FilterContainer>

      <ResultLabel>Result</ResultLabel>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}
      >
        {isLoaded &&
          displaySchools.map((school, idx) => (
            <Card key={idx}>
              {/* CIRCULAR PROGRESS = 0% for now */}
              <ProgressContainer>
                <AnimatedCircularProgress
                  size={60}
                  width={6}
                  fill={0}
                  tintColor="#45A246"
                  backgroundColor="#E0E0E0"
                  rotation={0}
                >
                  {() => <ProgressText>0%</ProgressText>}
                </AnimatedCircularProgress>
              </ProgressContainer>

              <InfoContainer>
                <SchoolName>{school.name}</SchoolName>
                <SchoolDetail>
                  Total student: {school.totalOrder}
                </SchoolDetail>
              </InfoContainer>

              <ArrowButton
                onPress={() =>
                  router.push({
                    pathname: "/orderList",
                    params: {
                      viewLevel: "student",
                      schoolName: school.name,
                    },
                  })
                }
              >
                <ArrowText>{">"}</ArrowText>
              </ArrowButton>
            </Card>
          ))}
      </ScrollView>

      <BottomNav />
    </Container>
  );
}
