import BottomNav from "@/components/bottomNavigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import {
  pickupFromCatering,
  pickupFromSchool,
} from "../lib/api.js";

type DeliveryStatus =
  | "ON_DELIVERY"
  | "ARRIVED_AT_SCHOOL"
  | "RETURNING_TO_CATERING"
  | "RETURNED_TO_CATERING";

type ProgressItem = {
  label: string;
  time?: string | null;
  status: DeliveryStatus;
  isActive: boolean;
  isDone: boolean;
  isScan?: boolean;
};

const Wrapper = styled.View`
  flex: 1;
  background-color: white;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const HeaderText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  color: black;
  margin-top: 10px;
`;

const DeliveryCard = styled.View`
  background-color: #f8ffed;
  border: 2px solid #b7e1b0;
  border-radius: 16px;
  padding: 16px;
  margin-top: 20px;
  justify-content: space-between;
`;

const DeliveryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DeliveryLabel = styled.Text`
  font-family: "Jost";
  font-size: 14px;
  color: #666;
`;

const DeliveryValue = styled.Text`
  font-family: "Jost";
  font-size: 16px;
  font-weight: 600;
  color: #214626;
`;

const StatusContainer = styled.View`
  margin-top: 25px;
`;

const StatusTitle = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 14px;
`;

const ProgressWrapper = styled.View`
  padding-left: 10px;
  margin-top: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 22px;
`;

const Circle = styled.View<{ active: boolean; done: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${(props: { active: boolean; done: boolean }) =>
    props.done ? "#1F8815" : props.active ? "#214626" : "#A7B0A6"};
  margin-right: 14px;
`;

const Line = styled.View`
  position: absolute;
  width: 2px;
  height: 30px;
  background-color: #b7d4b2;
  left: 7px;
  top: 18px;
`;

const Label = styled.Text<{ done?: boolean }>`
  font-family: "Jost";
  font-size: 15px;
  color: ${(props: { done?: boolean }) => (props.done ? "#1F8815" : "#111")};
  flex: 1;
`;

const TimeText = styled.Text`
  font-family: "Jost";
  font-size: 13px;
  color: #444;
`;

const ScanText = styled.Text`
  color: #214626;
  font-family: "Jost";
  font-size: 14px;
  text-decoration: underline;
`;

const DoneButton = styled.TouchableOpacity`
  background-color: #214626;
  border-radius: 26px;
  padding: 14px 24px;
  align-self: center;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const DoneText = styled.Text`
  color: white;
  font-family: "Fredoka-Regular";
  font-size: 16px;
  font-weight: 700;
`;

export default function DeliveryProgress() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const plateDistributionId = params.plateDistributionId as string;
  const plateCode = params.plateCode as string;
  const initialStatus = params.status as DeliveryStatus;

  const [schoolName, setSchoolName] = useState(params.schoolName || "");
  const [studentName, setStudentName] = useState(params.studentName || "");
  const [status, setStatus] = useState<DeliveryStatus>(initialStatus);
  const [progress, setProgress] = useState<ProgressItem[]>([]);

  useEffect(() => {
    buildProgress(initialStatus);
  }, []);

  const buildProgress = (current: DeliveryStatus) => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const list: ProgressItem[] = [
      {
        label: "Food ready and delivery start",
        status: "ON_DELIVERY",
        time: current === "ON_DELIVERY" ? nowTime : null,
        isActive: current === "ON_DELIVERY",
        isDone:
          current === "ARRIVED_AT_SCHOOL" ||
          current === "RETURNING_TO_CATERING" ||
          current === "RETURNED_TO_CATERING",
      },
      {
        label: "Food delivered to student",
        status: "ARRIVED_AT_SCHOOL",
        time: current === "ARRIVED_AT_SCHOOL" ? nowTime : null,
        isActive: current === "ARRIVED_AT_SCHOOL",
        isDone:
          current === "RETURNING_TO_CATERING" ||
          current === "RETURNED_TO_CATERING",
      },
      {
        label: "Plate returned",
        status: "RETURNING_TO_CATERING",
        time: current === "RETURNING_TO_CATERING" ? nowTime : null,
        isScan: true,
        isActive: current === "RETURNING_TO_CATERING",
        isDone: current === "RETURNED_TO_CATERING",
      },
      {
        label: "Delivery completed",
        status: "RETURNED_TO_CATERING",
        time: current === "RETURNED_TO_CATERING" ? nowTime : null,
        isActive: current === "RETURNED_TO_CATERING",
        isDone: current === "RETURNED_TO_CATERING",
      },
    ];

    setProgress(list);
  };

  // === HANDLERS FOR UPDATE STATUS ===
  const handlePickupFromCatering = async () => {
    try {
      await pickupFromCatering(plateCode);
      setStatus("ON_DELIVERY");
      buildProgress("ON_DELIVERY");
    } catch (e) {
      console.log("Error updating ON_DELIVERY:", e);
    }
  };

  const handlePickupFromSchool = async () => {
    try {
      await pickupFromSchool(plateCode);
      setStatus("RETURNING_TO_CATERING");
      buildProgress("RETURNING_TO_CATERING");
    } catch (e) {
      console.log("Error updating RETURNING_TO_CATERING:", e);
    }
  };

  return (
    <Wrapper>
      <Container>
        <HeaderText>Delivery Progress</HeaderText>

        {/* Information Card */}
        <DeliveryCard>
          <DeliveryRow>
            <DeliveryLabel>School:</DeliveryLabel>
            <DeliveryValue>{schoolName}</DeliveryValue>
          </DeliveryRow>

          <DeliveryRow style={{ marginTop: 5 }}>
            <DeliveryLabel>Student:</DeliveryLabel>
            <DeliveryValue>{studentName}</DeliveryValue>
          </DeliveryRow>

          <DeliveryRow style={{ marginTop: 5 }}>
            <DeliveryLabel>Plate Code:</DeliveryLabel>
            <DeliveryValue>{plateCode}</DeliveryValue>
          </DeliveryRow>
        </DeliveryCard>

        {/* Progress Section */}
        <StatusContainer>
          <StatusTitle>Current Status</StatusTitle>
          <ProgressWrapper>
            {progress.map((p, index) => (
              <Row key={index}>
                <Circle active={p.isActive} done={p.isDone} />
                {index !== progress.length - 1 && <Line />}

                {p.isScan ? (
                  <Label>
                    Plate returned.{" "}
                    <ScanText
                      onPress={() =>
                        router.push({
                          pathname: "/plateScan",
                          params: { plateCode },
                        })
                      }
                    >
                      SCAN HERE
                    </ScanText>
                  </Label>
                ) : (
                  <Label done={p.isDone}>{p.label}</Label>
                )}

                <TimeText>{p.time || "--:--"}</TimeText>
              </Row>
            ))}
          </ProgressWrapper>
        </StatusContainer>

        <DoneButton onPress={() => router.push("/deliveryList")}>
          <DoneText>CHECK OTHER DELIVERY</DoneText>
        </DoneButton>
      </Container>

      <BottomNav />
    </Wrapper>
  );
}
