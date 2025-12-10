// ini untuk page ngelist semua delivery yang udah dijalanin/on-going
// tampilannya ada dua. kalo kosong, bisa bikin delivery => masuk deliveryStatus.tsx
// kalo udah ada delivery, ada kayak list ongoing/completed (liat di figma)

import BottomNav from "@/components/bottomNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

import { getDeliveryListByCatering } from "../lib/api";


// styled components
const Container = styled.View.attrs({
  contentContainerStyle: {
    paddingBottom: 100,
  },
})`
  flex: 1;
  background-color: white;
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
  padding: 20px;
  margin-bottom: 90px;
`;

const Title = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  font-family: "Fredoka-Regular";
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
  font-family: "Fredoka-Regular";
  font-size: 16px;
  font-weight: 700;
`;

const SectionTitle = styled.Text`
  font-family: "Fredoka-Regular";
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
  font-family: "Fredoka-Regular";
  font-size: 16px;
  font-weight: 700;
`;

const StatusText = styled.Text`
  font-family: "Jost";
  font-size: 14px;
  color: black;
`;

const DeliveryList = () => {
  const router = useRouter();

  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch delivery list
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);

        // Ambil cateringId dari login
        const cateringId = await AsyncStorage.getItem("cateringId");

        if (!cateringId) {
          console.log("No cateringId found");
          setLoading(false);
          return;
        }

        // Panggil API placeholder
        const result = await getDeliveryListByCatering(Number(cateringId));

        const mapped = result.map((item) => ({
          id: item.deliveryId,
          school: item.schoolName,
          totalFood: item.totalFoodToBeDelivered,
          time: item.pickUpTime,
          date: item.pickUpDate,

          // bisa diubah nanti kalo udah fix status delivery-nya
          ongoing: true,
          status: "Ongoing",
        }));

        setDeliveries(mapped);
      } catch (error) {
        console.log("Error fetching deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const hasDeliveries = deliveries.length > 0;

  return (
    <Container>
      <ScrollArea showsVerticalScrollIndicator={false}>
        <Title>Delivery Progress</Title>

        {loading ? (
          <EmptyText>Loading deliveries...</EmptyText>
        ) : !hasDeliveries ? (
          <>
            <EmptyText>There’s no delivery going on in the mean time.</EmptyText>
            <DeliveryImage
              source={require("../assets/images/delivery-status.png")}
              resizeMode="contain"
            />
            <StartButton onPress={() => router.push("/orderList")}>
              <StartText>MAKE DELIVERY</StartText>
            </StartButton>
          </>
        ) : (
          <>
            {/* IMAGE */}
            <Image
              source={require("../assets/images/delivery-status.png")}
              style={{
                width: 80,
                height: 80,
                alignSelf: "center",
                marginTop: 10,
              }}
            />

            {/* ONGOING */}
            <SectionTitle>Ongoing</SectionTitle>
            {deliveries
              .filter((d) => d.ongoing)
              .map((d) => (
                <DeliveryCard
                  key={d.id}
                  onPress={() =>
                    router.push({
                      pathname: "/deliveryProgress",
                      params: { deliveryId: d.id },
                    })
                  }
                >
                  <DeliveryText>{d.school}</DeliveryText>
                  <StatusText>
                    Status: {d.status} • {d.time}
                  </StatusText>
                </DeliveryCard>
              ))}

            {/* COMPLETED */}
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
      </ScrollArea>

      <BottomNav />
    </Container>
  );
};

export default DeliveryList;

