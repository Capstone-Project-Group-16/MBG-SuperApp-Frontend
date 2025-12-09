import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const BurgerButton = styled.button`
  position: fixed;
  top: 90px;
  left: 0;
  width: 40px;
  height: 40px;
  background: #8aa18d;
  border: none;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;
  z-index: 201;
`;

const BurgerBar = styled.div`
  width: 24px;
  height: 3px;
  background: white;
  margin: 5px 0;
  border-radius: 3px;
`;

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const navigate = useNavigate();

  // integrasi bagian ini juga
  const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");

  navigate("/login");
};


  return (
    <>
      <BurgerButton onClick={() => setOpen(!open)}>
        <BurgerBar />
        <BurgerBar />
        <BurgerBar />
      </BurgerButton>

      <SidebarWrapper open={open}>
        <SidebarItem onClick={() => navigate("/dashboard")}>Dashboard</SidebarItem>
        <SidebarItem onClick={() => navigate("/tracker")}>Distribution Tracker</SidebarItem>
        <SidebarItem onClick={() => navigate("/statistic")}>Distribution Statistic</SidebarItem>
        <SidebarItem onClick={handleLogout}>Log Out</SidebarItem>
      </SidebarWrapper>
    </>
  );
}
