import { useState } from "react";
import styled from "styled-components";
import DistributionMap from "../components/DistributionMap";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fef7ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Fredoka;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-top: 120px;
  margin-bottom: 20px;
`;

const FiltersWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
`;

const FilterBox = styled.div`
  width: 120px;
  height: 45px;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  font-size: 14px;
`;

const MapContainer = styled.div`
  width: 80%;
  max-width: 900px;
  margin-top: 40px;
  position: relative;
`;

const LegendRow = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 25px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
`;

const RedDot = styled.div`
  width: 20px;
  height: 20px;
  background: #e30004;
  border-radius: 50%;
`;

const YellowDot = styled.div`
  width: 20px;
  height: 20px;
  background: #ffd500;
  border-radius: 50%;
`;

const GreenDot = styled.div`
  width: 20px;
  height: 20px;
  background: #2ecc71;
  border-radius: 50%;
`;

export default function TrackerPage() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <PageWrapper>
      <Navbar />

      {/* GLOBAL SIDEBAR */}
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} />

      <Title>Distribution Tracker</Title>

      <FiltersWrapper>
        <FilterBox>City</FilterBox>
        <FilterBox>Date</FilterBox>
      </FiltersWrapper>

      {/* MAP INTERAKTIF */}
      <MapContainer>
        <DistributionMap />
      </MapContainer>

      <LegendRow>
        <LegendItem>
          <RedDot /> Belum dikirim
        </LegendItem>
        <LegendItem>
          <YellowDot /> Dalam perjalanan
        </LegendItem>
        <LegendItem>
          <GreenDot /> Sudah terkirim
        </LegendItem>
      </LegendRow>
    </PageWrapper>
  );
}