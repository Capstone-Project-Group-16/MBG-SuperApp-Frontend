// ini untuk page ngelist semua delivery yang udah dijalanin/on-going
// tampilannya ada dua. kalo kosong, bisa bikin delivery => masuk deliveryStatus.tsx
// kalo udah ada delivery, ada kayak list ongoing/completed (liat di figma)

import BottomNav from "@/components/bottomNavigation";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

// styled components
const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const Title = styled.Text`
  font-family: "Fredoka";
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  font-family: "Fredoka";
  font-size: 18px;
  text-align: center;
  color: black;
  margin-top: 40px;
`;

const DeliveryImage = styled.Image`
  width: 100px;
  height: 100px;
  align-self: center;
  margin-top: 30px;
`;

const StartButton = styled.TouchableOpacity`
  background-color: #214626;
  border-radius: 26px;
  padding-vertical: 14px;
  padding-horizontal: 24px;
  align-self: center;
  margin-top: 30px;
`;

const StartText = styled.Text`
  color: white;
  font-family: "Fredoka";
  font-size: 16px;
  font-weight: 700;
`;

const SectionTitle = styled.Text`
  font-family: "Fredoka";
  font-size: 18px;
  font-weight: 700;
  margin-top: 25px;
  color: black;
`;

const DeliveryCard = styled.TouchableOpacity`
  background-color: #f8ffed;
  border-width: 2px;
  border-color: rgba(69, 162, 70, 0.5);
  border-radius: 20px;
  padding: 15px;
  margin-top: 10px;
`;

const DeliveryText = styled.Text`
  font-family: "Fredoka";
  font-size: 16px;
  font-weight: 700;
`;

const StatusText = styled.Text`
  font-family: "Jost";
  font-size: 14px;
  color: black;
`;

// ==== Component ====
const DeliveryList = () => {
  const router = useRouter();

  // sementara pakai dummy data
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      school: "SMAN 1 DEPOK",
      status: "Food being delivered",
      time: "10:30 AM",
      ongoing: true,
    },
  ]);

  const hasDeliveries = deliveries.length > 0;

  return (
    <Container>
      <Title>Delivery Progress</Title>

      {!hasDeliveries ? (
        <>
          <EmptyText>There’s no delivery going on in the mean time.</EmptyText>
          <DeliveryImage
            source={require("../assets/images/delivery-status.png")}
            resizeMode="contain"
          />
          <StartButton onPress={() => router.push("/deliveryStatus")}>
            <StartText>MAKE DELIVERY</StartText>
          </StartButton>
        </>
      ) : (
        <>
          <Image
            source={require("../assets/images/delivery-status.png")}
            style={{
              width: 80,
              height: 80,
              alignSelf: "center",
              marginTop: 10,
            }}
          />
          <SectionTitle>Ongoing</SectionTitle>
          {deliveries
            .filter((d) => d.ongoing)
            .map((d) => (
              <DeliveryCard
                key={d.id}
                onPress={() => router.push("/deliveryProgress")}
              >
                <DeliveryText>{d.school}</DeliveryText>
                <StatusText>
                  Status: {d.status} • {d.time}
                </StatusText>
              </DeliveryCard>
            ))}

          <SectionTitle>Completed</SectionTitle>
          {deliveries
            .filter((d) => !d.ongoing)
            .map((d) => (
              <DeliveryCard key={d.id}>
                <DeliveryText>{d.school}</DeliveryText>
                <StatusText>Delivered successfully</StatusText>
              </DeliveryCard>
            ))}
        </>
      )}
      <BottomNav />
    </Container>
  );
};

export default DeliveryList;
