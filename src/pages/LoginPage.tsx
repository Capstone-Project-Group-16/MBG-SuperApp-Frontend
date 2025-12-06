import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoImg from "../fe-assets/logo.png";

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5ffe6;
`;

const Card = styled.div`
  width: 420px;
  padding: 40px 36px;
  background: white;
  border-radius: 18px;
  outline: 4px #c6d6b9ff solid;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 140px;
  height: auto;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-family: Fredoka;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 30px;
  color: black;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-family: Fredoka;
  font-size: 18px;
  margin-bottom: 8px;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #214626;
  background: #ecf0f3;
  font-size: 16px;
  color: black;
  ::placeholder {
    color: #555;
    opacity: 1;
  }
`;

// const ForgotPassword = styled.div`
//   width: 100%;
//   text-align: right;
//   font-family: Fredoka;
//   font-size: 14px;
//   text-decoration: underline;
//   cursor: pointer;
//   margin-top: -10px;
//   margin-bottom: 25px;
// `;

const SignInButton = styled.button`
  width: 100%;
  height: 54px;
  background: #214626;
  color: white;
  font-size: 20px;
  font-family: Fredoka;
  font-weight: 700;
  border-radius: 26px;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
`;

const FooterText = styled.div`
  font-family: Fredoka;
  font-size: 14px;
  color: black;
`;

const SignUpLink = styled.span`
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
`;

export default function LoginPage() {
  const navigate = useNavigate();

  const registrationLink = "https://forms.gle/6NUcPm8zaY5HxG6x7";

  return (
    <PageContainer>
      <Card>
        <Logo src={LogoImg} />

        <Title>Sign in your account</Title>

        <InputContainer>
          <Label>Email</Label>
          <Input type="email"
                placeholder="Enter your email"/>
        </InputContainer>

        <InputContainer>
          <Label>Password</Label>
          <Input type="password"
                placeholder="Enter your password"/>
        </InputContainer>

        {/* <ForgotPassword>Forgot password?</ForgotPassword> */}

        <SignInButton onClick={() => navigate("/dashboard")}>
          Sign In
          </SignInButton>

        <FooterText>
          Don’t have an account?{" "}
          <SignUpLink onClick={() => window.open(registrationLink, "_blank")}>
            Register here
          </SignUpLink>
        </FooterText>
      </Card>
    </PageContainer>
  );
}