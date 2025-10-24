import BottomNav from "@/components/bottomNavigation";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import styled from "styled-components/native";

// styled components
const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const Logo = styled.Image`
  width: 140px;
  height: 40px;
  resize-mode: contain;
`;

const BurgerButton = styled.TouchableOpacity`
  padding: 8px;
`;

const ProfileButton = styled.TouchableOpacity`
  background-color: #fff6e5;
  border: 1px solid #d6d6d6;
  border-radius: 50px;
  padding: 10px;
  box-shadow: 0px 2px 3px rgba(210, 158, 88, 0.6);
`;

const WelcomeText = styled.Text`
  font-family: Fredoka;
  font-size: 28px;
  font-weight: 600;
  color: black;
  text-align: center;
  margin-top: 25px;
`;

const SectionTitle = styled.Text`
  font-family: Fredoka;
  font-size: 18px;
  font-weight: 600;
  color: black;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Card = styled.View`
  background-color: white;
  border: 2px solid #53a8c7;
  border-radius: 25px;
  overflow: hidden;
  padding: 15px;
`;

const CardHeader = styled.View`
  background-color: #60d5ff;
  padding: 10px;
  align-items: center;
`;

const CardHeaderText = styled.Text`
  font-family: Fredoka;
  font-size: 16px;
  font-weight: 600;
  color: black;
`;

const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 15px 5px;
`;

const StatBox = styled.View`
  align-items: center;
  justify-content: center;
  width: 100px;
  min-height: 120px;
`;

const StatLabel = styled.Text`
  font-family: Fredoka;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: black;
`;

const StatValue = styled.Text`
  font-family: Fredoka;
  font-size: 16px;
  font-weight: 600;
  margin-top: 6px;
  color: black;
`;

const IngredientCard = styled.View`
  border: 2px solid rgba(69, 162, 70, 0.5);
  border-radius: 25px;
  padding: 10px;
  margin-bottom: 90px;
`;

const IngredientList = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;

const IngredientCircle = styled.View`
  width: 70px;
  height: 70px;
  border: 1px solid #45a246;
  border-radius: 35px;
  align-items: center;
  justify-content: center;
`;


// --- Main Component ---
const Home: React.FC = () => {
  const router = useRouter();

  // Dummy data for now (will fetch later)
  const [orderCount, setOrderCount] = useState<number>(0);
  const [cookedCount, setCookedCount] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [deliveredSchools, setDeliveredSchools] = useState<number>(0);
  const [totalSchools, setTotalSchools] = useState<number>(0);
  const [topIngredients, setTopIngredients] = useState<string[]>([]);

  useEffect(() => {
    // nanti di sini panggil API, contoh:
    // fetch("https://api.superapp.com/catering/dashboard")
    //   .then(res => res.json())
    //   .then(data => {
    //     setOrderCount(data.totalOrders);
    //     setCookedCount(data.cooked);
    //     setTotalOrders(data.totalOrders);
    //     setDeliveredSchools(data.deliveredSchools);
    //     setTotalSchools(data.totalSchools);
    //     setTopIngredients(data.topIngredients);
    //   });
  }, []);

  const cookingPercent =
    totalOrders > 0 ? Math.round((cookedCount / totalOrders) * 100) : 0;

  return (
    <Container>
      <ScrollArea showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header>
        <BurgerButton>
          <Image source={require("../assets/images/burger.png")} style={{ width: 25, height: 25 }} />
        </BurgerButton>

        <Logo source={require("../assets/images/superapp-logo-name.png")} />

        <ProfileButton onPress={() => router.push("/profile")}>
          <Image source={require("../assets/images/profile.png")} style={{ width: 22, height: 22 }} />
        </ProfileButton>
      </Header>

      {/* Welcome */}
      <WelcomeText>Welcome, CATERING!</WelcomeText>

      {/* Quick Heads-Up Section */}
      <SectionTitle>QUICK HEADS-UP</SectionTitle>
      <Card>
        <CardHeader>
          <CardHeaderText>Recent update</CardHeaderText>
        </CardHeader>
        <StatRow>
          <StatBox>
            <Image source={require("../assets/images/pick-order.png")} style={{ width: 40, height: 40 }} />
            <StatLabel>Number of Order</StatLabel>
            <StatValue>{orderCount || "-"}</StatValue>
          </StatBox>
          <StatBox>
            {totalOrders && cookedCount !== null ? (
              <AnimatedCircularProgress
                size={64}
                width={6}
                fill={cookingPercent}
                tintColor={cookingPercent >= 70 ? "#45A246" : "#FFCC00"}
                backgroundColor="#E6E6E6"
                rotation={0}
              >
                {() => (
                  <Text style={{ fontFamily: "Fredoka", fontSize: 14, fontWeight: "600" }}>
                    {cookingPercent}%
                  </Text>
                )}
              </AnimatedCircularProgress>
            ) : (
              // placeholder when no data
              <IngredientCircle>
                <Text style={{ fontFamily: "Fredoka" }}>-</Text>
              </IngredientCircle>
            )}

            <StatLabel>Cooking Progress</StatLabel>
            <StatValue>
              {`${cookedCount || 0}/${totalOrders || 0}`}
            </StatValue>
          </StatBox>
          <StatBox>
            <Image source={require("../assets/images/school.png")} style={{ width: 40, height: 40}} />
            <StatLabel>Delivery Status</StatLabel>
            <StatValue>
              {deliveredSchools && totalSchools ? `${deliveredSchools}/${totalSchools}` : "-/-"}
            </StatValue>
          </StatBox>
        </StatRow>
      </Card>

      {/* Ingredients Section */}
      <SectionTitle>Most ordered ingredients in a week</SectionTitle>
      <IngredientCard>
        <IngredientList>
          {topIngredients.length > 0 ? (
            topIngredients.map((item, index) => (
              <IngredientCircle key={index}>
                <Text>{item}</Text>
              </IngredientCircle>
            ))
          ) : (
            <>
              <IngredientCircle />
              <IngredientCircle />
              <IngredientCircle />
            </>
          )}
        </IngredientList>
        {/* pake nanti aja. belum ada const. <SeeMore>See more</SeeMore> */}
      </IngredientCard>
      </ScrollArea>

        <BottomNav/>
      
    </Container>
  );
};

export default Home;