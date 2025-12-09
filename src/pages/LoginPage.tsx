import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoImg from "../fe-assets/logo.png";
import { useAuth } from "../context/AuthContext";

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

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
  font-family: Fredoka;
  word-wrap: break-word;
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email && password && !isLoading) {
      handleSignIn();
    }
  };

  return (
    <PageContainer>
      <Card>
        <Logo src={LogoImg} />

        <Title>Sign in your account</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <InputContainer>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </InputContainer>

        <InputContainer>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </InputContainer>

        {/* <ForgotPassword>Forgot password?</ForgotPassword> */}

        <SignInButton onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </SignInButton>
      </Card>
    </PageContainer>
  );
}