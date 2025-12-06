import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ChefImg from "../fe-assets/koki.png";
import Logo from "../fe-assets/logo.png";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  background: #f5ffe6;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 80px; 
  box-sizing: border-box;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
`;

const LogoImage = styled.img`
  width: 140px;
  position: absolute;
  left: 60px;
  top: 140px;
`;

const Punchline = styled.div`
  position: absolute;
  left: 60px;
  top: 200px;
  width: 450px;
  color: #388642;
  font-family: Fredoka;
  font-size: 42px;
  font-weight: 600;
  line-height: 50px;
`;

const Subtitle = styled.div`
  position: absolute;
  left: 60px;
  top: 400px;
  width: 450px;
  font-family: Fredoka;
  font-size: 20px;
  color: #000;
`;

const Chef = styled.img`
  width: 230px;
  position: absolute;
  right: 40px;
  top: 250px;
`;

const SignInButton = styled.button`
  width: 160px;
  height: 60px;
  position: absolute;
  left: 60px;
  top: 500px;
  background: #214626;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);

  color: #ffffff;
  font-family: Fredoka;
  font-size: 26px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const RightSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 250px;
    height: auto;
    object-fit: contain;
  }
`;

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
        <ContentWrapper>
          <LeftSide>
      <LogoImage src={Logo} />

      <Punchline>
        Satu Langkah Gizi Sehat,
        <br />
        Seribu Manfaat untuk Negeri
      </Punchline>

      <Subtitle>
        Maintain the MBG distribution with our MBG Super App.
      </Subtitle>

      <SignInButton onClick={() => navigate("/login")}>
        Sign In
      </SignInButton>
      </LeftSide>

    <RightSide>
      <Chef src={ChefImg} />
    </RightSide>

      </ContentWrapper>
    </Container>
  );
};