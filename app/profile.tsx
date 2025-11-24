import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  position: relative;
  justify-content: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  background-color: #c1e5c0;
  padding: 7px 12px;
  border-radius: 20px;
  z-index: 10;
`;

const BackText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 14px;
  color: #2f5d2b;
  font-weight: 600;
`;

const Title = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 24px;
  font-weight: 700;
  color: black;
  flex: 1;
  text-align: center;
  margin-right: 20px;
`;

const ProfileImageWrapper = styled.View`
  align-self: center;
  margin-top: 10px;
  border-width: 2px;
  border-color: rgba(69, 162, 70, 0.65);
  border-radius: 100px;
  padding: 7px;
`;

const ProfileImage = styled.Image`
  width: 90px;
  height: 90px;
`;

const InputLabel = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 16px;
  color: black;
  margin-top: 15px;
`;

const InputBox = styled.TextInput`
  border: 2px solid #45a246;
  border-radius: 10px;
  padding: 10px;
  font-family: "Jost";
  font-size: 15px;
  color: black;
  margin-top: 7px;
`;

const TextArea = styled.TextInput`
  border: 2px solid #45a246;
  border-radius: 10px;
  padding: 10px;
  font-family: "Jost";
  font-size: 15px;
  color: black;
  margin-top: 8px;
  height: 90px;
`;

const UploadSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

const UploadIcon = styled.Image`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

const UploadText = styled.Text`
  font-family: "Fredoka-Regular";
  font-size: 16px;
  color: black;
  text-decoration: underline;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #214626;
  border-radius: 26px;
  padding: 14px 24px;
  align-self: center;
  margin-top: 35px;
  width: 80%;
`;

const LogoutText = styled.Text`
  color: white;
  font-family: "Fredoka-Regular";
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

const YourProfilePage = () => {
  const router = useRouter();

  // Temporary Placeholder
  const [cateringName, setCateringName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const handleUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Please allow access to gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert("Upload Success", "Your file has been selected!");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have been logged out.", [
      { text: "OK", onPress: () => router.replace("/splash") },
    ]);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBack}>
          <BackText>{"<"}</BackText>
        </BackButton>
        <Title>Your Profile</Title>
      </Header>

      <ProfileImageWrapper>
        <ProfileImage source={require("../assets/images/profile.png")} />
      </ProfileImageWrapper>

      <InputLabel>Catering Name</InputLabel>
      <InputBox
        value={cateringName}
        onChangeText={setCateringName}
        placeholder=""
      />

      <InputLabel>Email</InputLabel>
      <InputBox value={email} onChangeText={setEmail} placeholder="" />

      <InputLabel>Password</InputLabel>
      <InputBox
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder=""
      />

      <InputLabel>Catering Address*</InputLabel>
      <TextArea value={address} onChangeText={setAddress} placeholder="" />

      <UploadSection>
        <TouchableOpacity onPress={handleUpload}>
          <UploadIcon source={require("../assets/images/upload.png")} />
        </TouchableOpacity>
        <UploadText>Upload Business License*</UploadText>
      </UploadSection>

      <LogoutButton onPress={handleLogout}>
        <LogoutText>Log out</LogoutText>
      </LogoutButton>
    </Container>
  );
};

export default YourProfilePage;