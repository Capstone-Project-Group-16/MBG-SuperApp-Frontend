import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapImage from "../fe-assets/map.png";

const PageWrapper = styled.div`
  width: 100vw;
  height: 100v;
  background: #fef7ff;
  display: flex;
  flex-direction: column;
  font-family: Fredoka;
  color: black;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 90px; 
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px 60px;
  margin-left: 160px;
  color: black;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: black;
`;

// const SubTitle = styled.h2`
//   font-size: 28px;
//   font-weight: 600;
//   margin-top: 25px;
//   color: black;
// `;

const MapPreview = styled.img`
  width: 100%;
  max-width: 650px;
  margin-top: 20px;
  border-radius: 12px;
  border: 1px solid #3f3f3f;
  cursor: pointer;
`;

const TopRow = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 25px;
`;

const TableHeader = styled.div`
  width: 100%;
  background: #E5FFE6;
  border: 1px solid #8AA18D;
  border-radius: 30px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
  font-weight: 600;
  color: black;
  margin-bottom: 18px;
`;

const NutritionCard = styled.div`
  flex: 0.8;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
  height: fit-content;
`;

const BarWrapper = styled.div`
  margin-top: 15px;
`;

const BarRow = styled.div`
  margin-bottom: 18px;
`;

const BarLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const BarBackground = styled.div`
  width: 100%;
  height: 16px;
  border-radius: 10px;
  background: #e8e8e8;
`;

const BarFill = styled.div<{ width: string; color: string }>`
  height: 100%;
  border-radius: 10px;
  width: ${(props) => props.width};
  background: ${(props) => props.color};
`;

const SectionRow = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 30px;
`;

const CardLarge = styled.div`
  flex: 1;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
`;

const ActivityBox = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid #45a246;
  padding: 12px 16px;
  margin-bottom: 12px;
  color: black;
`;

// const TimeStamp = styled.div`
//   font-size: 10px;
//   margin-top: 4px;
//   opacity: 0.7;
//   color: black;
// `;

const FavMenuCard = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid #45a246;
  padding: 16px 20px;
  margin-bottom: 12px;
  color: black;

  display: flex;
  flex-direction: column;
  gap: 6px;
`;


const StatLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 14px;
  color: black;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #45a246;
  text-align: center;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const SmallStatCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 20px;
  border: 1px solid #45a246;
  padding: 25px;
  min-height: 110px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;

  font-size: 16px;
  font-weight: 600;
  color: black;
`;


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PageWrapper>
      <Navbar />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Welcome, Government</Title>

          {/* Map + Average Nutrition Row */}
          <TopRow>
            <div style={{ flex: 1 }}>
            <TableHeader>Check the Map</TableHeader>
              <Link to="/tracker">
                <MapPreview src={MapImage} alt="Map Preview" />
              </Link>
            </div>

            {/* AVERAGE NUTRITION CARD */}
            <NutritionCard>
              <TableHeader>Average Nutrition %</TableHeader>

              <BarWrapper>

                <BarRow>
                  <BarLabel>Potassium – 70%</BarLabel>
                  <BarBackground>
                    <BarFill width="70%" color="#C070FF" />
                  </BarBackground>
                </BarRow>

                <BarRow>
                  <BarLabel>Calcium – 65%</BarLabel>
                  <BarBackground>
                    <BarFill width="65%" color="#67D4FF" />
                  </BarBackground>
                </BarRow>

                <BarRow>
                  <BarLabel>Iron (Zat Besi) – 58%</BarLabel>
                  <BarBackground>
                    <BarFill width="58%" color="#A05A2C" />
                  </BarBackground>
                </BarRow>

                <BarRow>
                  <BarLabel>Vitamin A – 82%</BarLabel>
                  <BarBackground>
                    <BarFill width="82%" color="#FFC447" />
                  </BarBackground>
                </BarRow>

                <BarRow>
                  <BarLabel>Vitamin C – 75%</BarLabel>
                  <BarBackground>
                    <BarFill width="75%" color="#A8FF3A" />
                  </BarBackground>
                </BarRow>

                <BarRow>
                  <BarLabel>Vitamin D – 68%</BarLabel>
                  <BarBackground>
                    <BarFill width="68%" color="#FFF2A6" />
                  </BarBackground>
                </BarRow>

                <BarRow>
                  <BarLabel>Magnesium – 60%</BarLabel>
                  <BarBackground>
                    <BarFill width="60%" color="#7A90A4" />
                  </BarBackground>
                </BarRow>

              </BarWrapper>
            </NutritionCard>

          </TopRow>

          <SectionRow>

            {/* Recent Activity */}
            <CardLarge>
              <TableHeader>Recent Activities</TableHeader>
              {/* Placeholder API */}
              <ActivityBox>No recent activity yet.</ActivityBox>
            </CardLarge>

            {/* Favorite Menu */}
            <CardLarge>
            <TableHeader>Favorite Menu per Week</TableHeader>

            {/* harusnya bagian ini udah kesambung ke backend , tapi masih hardcoded */}
            <FavMenuCard>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>Ultimate Hero Feast</div>
              <div style={{ opacity: 0.8 }}>Total pesanan: -</div>
            </FavMenuCard>

            <FavMenuCard>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>Speed Runner Combo</div>
              <div style={{ opacity: 0.8 }}>Total pesanan: -</div>
            </FavMenuCard>
          </CardLarge>

          </SectionRow>

          <CardLarge style={{ marginTop: "35px" }}>
            <TableHeader>This Week's Statistic</TableHeader>

            <StatsRow>

                {/* Total hasil distribusi */}
                <SmallStatCard>
                <StatLabel>Total Hasil Distribusi</StatLabel>
                {/* API: total hasil distribusi */}
                <StatValue>-</StatValue>
                </SmallStatCard>

                {/* Total sekolah */}
                <SmallStatCard>
                <StatLabel>Total Sekolah per Kota yang Sudah Menerima MBG</StatLabel>
                {/* API: total sekolah */}
                <StatValue>-</StatValue>
                </SmallStatCard>

                {/* Kota tertunda */}
                <SmallStatCard>
                <StatLabel>Kota Tertunda atau Gagal</StatLabel>
                {/* API: kota tertunda/gagal */}
                <StatValue>-</StatValue>
                </SmallStatCard>

            </StatsRow>
            </CardLarge>


        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
