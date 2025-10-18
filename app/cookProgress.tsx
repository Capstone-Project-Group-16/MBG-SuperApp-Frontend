// import BottomNav from "@/components/bottomNavigation";
// import { Picker } from "@react-native-picker/picker";
// import { useRouter } from "expo-router";
// import { ChevronRight } from "lucide-react";
// import React, { useState } from "react";
// import { Image, ScrollView } from "react-native";
// import { AnimatedCircularProgress } from "react-native-circular-progress";
// import styled from "styled-components/native";

// export default function CookProgress() {
//   const router = useRouter();
//   const [selectedCity, setSelectedCity] = useState("All");
//   const [selectedDate, setSelectedDate] = useState("Today");

//   // Dummy data sekolah (nantinya bisa fetch dari backend)
//   const schoolData = [
//     { name: "SMAN 1 DEPOK", totalClass: 8, totalOrder: 300, progress: 10 },
//     { name: "SMAN 2 DEPOK", totalClass: 10, totalOrder: 420, progress: 40 },
//     { name: "SMAN 3 DEPOK", totalClass: 6, totalOrder: 240, progress: 85 },
//   ];

//   return (
//     <Container>
//       {/* HEADER */}
//       <Header>
//         <BackButton onPress={() => router.back()}>
//           <Image
//             source={require("../assets/images/back-icon.png")}
//             style={{ width: 22, height: 22 }}
//           />
//         </BackButton>
//         <Title>Cooking Progress</Title>
//       </Header>

//       {/* IMAGE */}
//       <Logo source={require("../assets/images/cooking.png")} />

//       {/* FILTER SECTION */}
//       <FilterContainer>
//         <FilterLabel>FILTER BY:</FilterLabel>
//         <FilterRow>
//           <PickerContainer>
//             <Picker
//               selectedValue={selectedCity}
//               onValueChange={(itemValue) => setSelectedCity(itemValue)}
//               style={{ width: 120, height: 40 }}
//             >
//               <Picker.Item label="City" value="All" />
//               <Picker.Item label="Depok" value="Depok" />
//               <Picker.Item label="Jakarta" value="Jakarta" />
//             </Picker>
//           </PickerContainer>

//           <PickerContainer>
//             <Picker
//               selectedValue={selectedDate}
//               onValueChange={(itemValue) => setSelectedDate(itemValue)}
//               style={{ width: 120, height: 40 }}
//             >
//               <Picker.Item label="Date" value="Today" />
//               <Picker.Item label="Yesterday" value="Yesterday" />
//               <Picker.Item label="Last week" value="LastWeek" />
//             </Picker>
//           </PickerContainer>
//         </FilterRow>
//       </FilterContainer>

//       {/* RESULT SECTION */}
//       <ResultLabel>Result</ResultLabel>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {schoolData.map((school, index) => (
//           <Card key={index}>
//             <ProgressContainer>
//               <AnimatedCircularProgress
//                 size={60}
//                 width={6}
//                 fill={school.progress}
//                 tintColor={school.progress >= 70 ? "#45A246" : "#FFCC00"}
//                 backgroundColor="#E0E0E0"
//                 rotation={0}
//               >
//                 {(fill: number) => (
//                   <ProgressText>{`${school.progress}%`}</ProgressText>
//                 )}
//               </AnimatedCircularProgress>
//             </ProgressContainer>

//             <InfoContainer>
//               <SchoolName>{school.name}</SchoolName>
//               <SchoolDetail>
//                 Total class: {school.totalClass} {"\n"}
//                 Total order: {school.totalOrder}
//               </SchoolDetail>
//             </InfoContainer>

//             <ArrowButton onPress={() => router.push("/orderList")}>
//               <ChevronRight color="#45A246" size={28} />
//             </ArrowButton>
//           </Card>
//         ))}
//       </ScrollView>

//       <BottomNav/>
//     </Container>
//   );
// }

// const Container = styled.View`
//   flex: 1;
//   background-color: white;
//   align-items: center;
//   padding-top: 40px;
// `;

// const Header = styled.View`
//   flex-direction: row;
//   align-items: center;
//   width: 90%;
//   justify-content: center;
//   position: relative;
// `;

// const BackButton = styled.TouchableOpacity`
//   position: absolute;
//   left: 0;
// `;

// const Title = styled.Text`
//   font-family: Fredoka;
//   font-size: 26px;
//   font-weight: 600;
//   color: black;
// `;

// const Logo = styled.Image`
//   width: 90px;
//   height: 90px;
//   margin-top: 20px;
//   margin-bottom: 10px;
// `;

// const FilterContainer = styled.View`
//   width: 90%;
//   margin-top: 10px;
// `;

// const FilterLabel = styled.Text`
//   font-family: Fredoka;
//   font-size: 13px;
//   font-weight: 700;
//   color: black;
//   margin-bottom: 6px;
// `;

// const FilterRow = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
// `;

// const PickerContainer = styled.View`
//   width: 45%;
//   border: 2px solid rgba(69, 162, 70, 0.5);
//   border-radius: 25px;
//   background-color: rgba(255, 255, 255, 0.35);
// `;

// const ResultLabel = styled.Text`
//   width: 90%;
//   font-family: Fredoka;
//   font-size: 16px;
//   font-weight: 600;
//   color: black;
//   margin-top: 20px;
// `;

// const Card = styled.View`
//   width: 90%;
//   background-color: #f8ffed;
//   border-radius: 30px;
//   border: 2px solid rgba(69, 162, 70, 0.5);
//   box-shadow: 2px 2px 1px rgba(69, 162, 70, 0.25);
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
//   padding: 15px;
//   margin-vertical: 8px;
// `;

// const ProgressContainer = styled.View`
//   align-items: center;
//   justify-content: center;
// `;

// const ProgressText = styled.Text`
//   font-family: Fredoka;
//   font-size: 14px;
//   font-weight: 500;
//   color: black;
// `;

// const InfoContainer = styled.View`
//   flex: 1;
//   margin-left: 15px;
// `;

// const SchoolName = styled.Text`
//   font-family: Fredoka;
//   font-size: 18px;
//   font-weight: 600;
//   color: black;
// `;

// const SchoolDetail = styled.Text`
//   font-family: Fredoka;
//   font-size: 14px;
//   font-weight: 300;
//   color: black;
// `;

// const ArrowButton = styled.TouchableOpacity`
//   background-color: #d8ffdb;
//   border-radius: 25px;
//   border: 2px solid rgba(69, 162, 70, 0.8);
//   width: 35px;
//   height: 35px;
//   align-items: center;
//   justify-content: center;
// `;

// const BottomWrapper = styled.View`
//   width: 100%;
//   position: absolute;
//   bottom: 0;
// `;