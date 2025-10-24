// ini kode buat ngecek progress PER delivery-nya

import BottomNav from "@/components/bottomNavigation";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

//styled components
const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const HeaderText = styled.Text`
  font-family: "Fredoka";
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  color: black;
  margin-top: 20px;
`;

const ProgressSection = styled.View`
  margin-top: 30px;
`;

const ProgressStep = styled.View<{ isActive: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  opacity: ${(p: { isActive: boolean }) => (p.isActive ? 1 : 0.4)};
`;

const StepIcon = styled.View<{ isActive: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${(p: { isActive: boolean }) =>
    p.isActive ? "#214626" : "#b7d4b2"};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const StepText = styled.Text<{ isActive: boolean }>`
  font-family: "Jost";
  font-size: 16px;
  color: ${(p: { isActive: boolean }) => (p.isActive ? "black" : "#888")};
`;


const StatusBox = styled.View`
  background-color: #f8ffed;
  border: 2px rgba(69, 162, 70, 0.5) solid;
  border-radius: 20px;
  padding: 20px;
  margin-top: 30px;
`;

const StatusTitle = styled.Text`
  font-family: "Fredoka";
  font-size: 18px;
  font-weight: 700;
  color: black;
  text-align: center;
`;

const StatusSubtitle = styled.Text`
  font-family: "Jost";
  font-size: 15px;
  color: #444;
  text-align: center;
  margin-top: 6px;
`;

const DoneButton = styled.TouchableOpacity`
  background-color: #214626;
  border-radius: 26px;
  padding: 14px 24px;
  align-self: center;
  margin-top: 35px;
`;

const DoneText = styled.Text`
  color: white;
  font-family: "Fredoka";
  font-size: 16px;
  font-weight: 700;
`;

const ProgressImage = styled.Image`
  width: 180px;
  height: 180px;
  align-self: center;
  margin-top: 20px;
`;

// ==== Component ====
const DeliveryProgress = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Food being prepared",
    "Food ready for delivery",
    "Driver en route",
    "Food delivered",
  ];

  // Simulasi progress otomatis setiap 5 detik (bisa diganti manual)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <HeaderText>Delivery Progress</HeaderText>

      <ProgressImage
        source={require("../assets/images/delivery-truck.png")}
        resizeMode="contain"
      />

      <ProgressSection>
        {steps.map((step, index) => (
          <ProgressStep key={index} isActive={index <= currentStep}>
            <StepIcon isActive={index <= currentStep} />
            <StepText isActive={index <= currentStep}>{step}</StepText>
          </ProgressStep>
        ))}
      </ProgressSection>

      <StatusBox>
        <StatusTitle>{steps[currentStep]}</StatusTitle>
        <StatusSubtitle>
          {currentStep < steps.length - 1
            ? "Please wait while we complete this step..."
            : "Delivery completed successfully!"}
        </StatusSubtitle>
      </StatusBox>

      {currentStep === steps.length - 1 && (
        <DoneButton onPress={() => router.push("/deliveryList")}>
          <DoneText>CHECK OTHER DELIVERY</DoneText>
        </DoneButton>
      )}
      <BottomNav />
    </Container>
  );
};

export default DeliveryProgress;