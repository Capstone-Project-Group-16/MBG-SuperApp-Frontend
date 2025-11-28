import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  background-color: #fff;
  padding: 15px 5px;
  border-top-width: 1px;
  border-top-color: #ddd;
  
  z-index : 9999;
  elevation: 10;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export default function BottomNav() {
  const router = useRouter();

  return (
    <Container>
      <TouchableOpacity onPress={() => router.push("/orderList")}>
        <Image
          source={require("../assets/images/order-list.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/cookProgress")}>
        <Image
          source={require("../assets/images/cook-progress.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/deliveryList")}>
        <Image
          source={require("../assets/images/delivery-status.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/home")}>
        <Image
          source={require("../assets/images/home.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    </Container>
  );
}
