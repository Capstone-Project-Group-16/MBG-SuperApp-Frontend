// ini kode buat ngecek progress PER delivery-nya

import BottomNav from "@/components/bottomNavigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";

type StatusItem = {
  text: string;
  time: string;
  active?: boolean;
};

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: white;
  position: relative;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DeliveryInfo = styled.View`
  flex: 1;
`;

const SchoolName = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 18px;
  font-weight: 700;
  color: #214626;
`;

const DeliveryText = styled.Text`
  font-family: "Jost";
  font-size: 14px;
  color: #333;
  margin-top: 3px;
`;

const DeliveryImage = styled.Image`
  width: 55px;
  height: 55px;
  margin-left: 10px;
`;

const StatusContainer = styled.View`
  margin-top: 25px;
`;

const StatusTitle = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 18px;
  font-weight: 700;
  color: black;
  text-align: center;
  margin-bottom: 14px;
`;

const StatusList = styled.View`
  background-color: #f8ffed;
  border: 2px solid rgba(69, 162, 70, 0.5);
  border-radius: 20px;
  padding: 15px;
`;

const StatusItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

/* Tipe untuk styled props: active */
const StatusIconWrapper = styled.View`
  width: 28px;
  align-items: center;
  position: relative;
`;

/* line between circles - absolute positioned (rendered only when needed) */
const StatusLine = styled.View`
  width: 2px;
  height: 42px;
  background-color: #b7d4b2;
  position: absolute;
  top: 16px;
`;

const StatusCircle = styled.View<{ active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(p: { active?: boolean }) =>
    p.active ? "#214626" : "#b7d4b2"};
`;

const StatusTextStyled = styled.Text`
  font-family: "Jost";
  font-size: 15px;
  color: #222;
  flex: 1;
  margin-left: 12px;
`;

const StatusTime = styled.Text`
  font-family: "Jost";
  font-size: 14px;
  color: #444;
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

const DeliveryProgress: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ambil param jika dikirim, fallback ke dummy
  const schoolName = (params?.schoolName as string) || "SMAN 1 DEPOK";
  const eta = (params?.eta as string) || "12:00 PM";

  // kalau dikirim sebagai JSON string via params, parse; kalau nggak, fallback ke array contoh
  const parsedStatus =
    typeof params?.currentStatus === "string"
      ? (JSON.parse(params.currentStatus as string) as StatusItem[])
      : undefined;

  const currentStatus: StatusItem[] =
    parsedStatus ??
    [
      { text: "Catering checking order list", time: "06:00 AM", active: true },
      { text: "Catering buy raw ingredients", time: "06:30 AM", active: true },
      { text: "Food being cooked", time: "07:30 AM", active: true },
      { text: "Food ready", time: "10:00 AM", active: false },
      { text: "Food being delivered", time: "10:30 AM", active: false },
      { text: "Food has been arrived", time: "12:00 PM", active: false },
    ];

  return (
    <Wrapper>
    <Container>
      <ScrollArea showsVerticalScrollIndicator={false}>
      <HeaderText>Delivery Progress</HeaderText>

      <DeliveryCard>
        <DeliveryInfo>
          <SchoolName>{schoolName}</SchoolName>
          <DeliveryText>Food is on the way!</DeliveryText>
          <DeliveryText>ETA: {eta}</DeliveryText>
        </DeliveryInfo>
        <DeliveryImage
          source={require("../assets/images/delivery-truck.png")}
          resizeMode="contain"
        />
      </DeliveryCard>

      <StatusContainer>
        <StatusTitle>Current Status</StatusTitle>

        <StatusList>
          {currentStatus.map((item: StatusItem, index: number) => (
            <StatusItemRow key={index}>
              <StatusIconWrapper>
                {/* circle */}
                <StatusCircle active={!!item.active} />
                {/* render connector line if not last */}
                {index !== currentStatus.length - 1 && <StatusLine />}
              </StatusIconWrapper>

              <StatusTextStyled>{item.text}</StatusTextStyled>
              <StatusTime>{item.time}</StatusTime>
            </StatusItemRow>
          ))}
        </StatusList>
      </StatusContainer>

      <DoneButton onPress={() => router.push("/deliveryList")}>
        <DoneText>CHECK OTHER DELIVERY</DoneText>
      </DoneButton>
      </ScrollArea>

    </Container>
        <BottomNav />
    </Wrapper>
  );
};

export default DeliveryProgress;