import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "../fe-assets/logo.png";
import ProfileIcon from "../fe-assets/profile.png";

const NavbarContainer = styled.nav`
  width: 100vw;
  height: 70px;
  background: #c8e2a3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  width: auto;
  height: 48px;
  object-fit: contain;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const NavItem = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: black;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
    color: #797979ff;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const UsernameText = styled.span`
  margin-right: 12px;
  font-size: 20px;
  font-weight: 700;
  color: black;
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <LeftSection>
        <LogoImg src={Logo} alt="SuperApp Logo" />
      </LeftSection>

      <NavLinks>
        <NavItem to="/dashboard">Home</NavItem>
        <NavItem to="/about">About</NavItem>
      </NavLinks>

      <RightSection>
        <UsernameText>User</UsernameText> {/* placeholder */}
          <ProfileImg src={ProfileIcon} alt="User Profile" />
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;