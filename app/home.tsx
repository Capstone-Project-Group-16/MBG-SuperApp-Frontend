import BottomNav from "@/components/bottomNavigation";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, TouchableOpacity as RNTouchable, Text, useWindowDimensions } from "react-native";
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
  font-family: "Fredoka-Bold";
  font-size: 28px;
  font-weight: 600;
  color: black;
  text-align: center;
  margin-top: 25px;
`;

const SectionTitle = styled.Text`
  font-family: "Fredoka-Medium";
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
  font-family: "Fredoka-Medium";
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
  font-family: "Fredoka-Regular";
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: black;
`;

const StatValue = styled.Text`
  font-family: "Fredoka-Regular";
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

const MenuOverlay = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.35);
  z-index: 90;
`;

const MenuPanel = styled(Animated.View)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${/* will set via transform width, keep fallback */ '260px'};
  background-color: white;
  padding: 30px 18px;
  z-index: 100;
  elevation: 20;
`;

const MenuItem = styled.TouchableOpacity`
  padding-vertical: 12px;
  margin-bottom: 8px;
`;

const MenuItemText = styled.Text`
  font-family: "Fredoka-Medium";
  font-size: 18px;
  color: #214626;
`;


// styled components
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
    // fetch("(API)")
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

    // menu (sidebar) state + animation
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const { width: screenWidth } = useWindowDimensions();
  const MENU_WIDTH = Math.min(300, Math.round(screenWidth * 0.75));

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -MENU_WIDTH,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const navigateAndClose = (path: any) => {
    closeMenu();
    setTimeout(() => router.push(path), 200);
  };


  return (
    <Container>

    {menuOpen && (
        <MenuOverlay activeOpacity={1} onPress={closeMenu}>
        </MenuOverlay>
      )}

      <MenuPanel
        style={{
          width: MENU_WIDTH,
          transform: [{ translateX: slideAnim }],
          position: 'absolute',
          zIndex: 100,
        }}
        pointerEvents={menuOpen ? 'auto' : 'none'}
      >
        <RNTouchable onPress={closeMenu} style={{ alignSelf: 'flex-end', padding: 6 }}>
          <Text style={{ fontSize: 20, color: '#214626' }}>✕</Text>
        </RNTouchable>

        <MenuItem onPress={() => navigateAndClose('/orderList')}>
          <MenuItemText>Order List</MenuItemText>
        </MenuItem>

        <MenuItem onPress={() => navigateAndClose('/cookProgress')}>
          <MenuItemText>Cooking Progress</MenuItemText>
        </MenuItem>

        <MenuItem onPress={() => navigateAndClose('/deliveryList')}>
          <MenuItemText>Delivery Progress</MenuItemText>
        </MenuItem>
      </MenuPanel>

      <ScrollArea showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header>
        <BurgerButton onPress={openMenu}>
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
                  <Text style={{ fontFamily: "Fredoka-Regular", fontSize: 14, fontWeight: "600" }}>
                    {cookingPercent}%
                  </Text>
                )}
              </AnimatedCircularProgress>
            ) : (
              // placeholder when no data
              <IngredientCircle>
                <Text style={{ fontFamily: "Fredoka-Regular" }}>-</Text>
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