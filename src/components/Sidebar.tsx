import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const SidebarWrapper = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-240px")};
  width: 240px;
  height: 100vh;
  background: #e9edea;
  border-right: 1px solid #8aa18d;
  border-bottom-left-radius: 18px;
  transition: 0.3s ease;
  padding-top: 90px;
  z-index: 200;
`;

const SidebarItem = styled.div`
  padding: 18px 22px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: black;
  border-bottom: 1px solid #cfd8d0;

  &:hover {
    background: #d7e3d6;
  }
`;

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen: _setOpen }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <SidebarWrapper open={open}>
      <SidebarItem onClick={() => navigate("/dashboard")}>Dashboard</SidebarItem>
      <SidebarItem onClick={() => navigate("/favorite-food")}>Favorite Food</SidebarItem>
      <SidebarItem onClick={() => navigate("/average-nutrition")}>Average Nutrition</SidebarItem>
      <SidebarItem onClick={() => navigate("/leaderboard")}>Student Leaderboard</SidebarItem>
      <SidebarItem onClick={() => navigate("/waste-stats")}>Food Waste Stats</SidebarItem>
      <SidebarItem onClick={() => navigate("/tracker")}>Distribution Tracker</SidebarItem>
      <SidebarItem onClick={() => navigate("/statistic")}>Distribution Statistic</SidebarItem>
      <SidebarItem onClick={handleLogout}>Log Out</SidebarItem>
    </SidebarWrapper>
  );
}
