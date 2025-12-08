import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DistributionImg from "../fe-assets/distribution.png";

const PageWrapper = styled.div`
  width: 100vw;
  height: 100v;
  background: #fef7ff;
  display: flex;
  flex-direction: column;
  font-family: Fredoka;
  color: black;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 35px;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  margin-left: 20px;
  color: black;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: black;
`;

const SubText = styled.div`
  font-size: 20px;
  opacity: 0.8;
`;

// check the distribution ---
const DistributionCard = styled.div`
  width: 32%;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
  height: fit-content;
`;

const DistributionHeader = styled.div`
  width: 92%;
  background: #e5ffe6;
  border: 1px solid #8aa18d;
  border-radius: 30px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 22px;
  font-weight: 600;
  color: black;
  padding: 0 20px;
  margin-bottom: 18px;
`;

const ArrowButton = styled(Link)`
  font-size: 26px;
  font-weight: bold;
  color: #45a246;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const DistributionImage = styled.img`
  width: 55%;
  max-width: 150px;
  margin: 0 auto;
  display: block;
  margin-bottom: 18px;
`;

const DistributionItem = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid #45a246;
  padding: 16px 18px;
  margin-bottom: 14px;
  color: black;

  display: flex;
  justify-content: space-between;
  font-size: 15px;
`;
// ---

const TopRow = styled.div`
  display: flex;
  justify-content: center; 
  width: 100%;
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

// average nutrition ---
const NutritionCard = styled.div`
  width: 32%;
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
// ---

// favorite menu ---
const FavoriteMenuLarge = styled.div`
  width: 32%;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
  height: fit-content;
`;

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
// ---

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

// const TimeStamp = styled.div`
//   font-size: 10px;
//   margin-top: 4px;
//   opacity: 0.7;
//   color: black;
// `;

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
          <SubText>Apa yang bisa kami bantu hari ini?</SubText>

          {/* Check distribution */}
          <TopRow>
            <DistributionCard>
              <DistributionHeader>
                Check Distribution
                <ArrowButton to="/tracker">→</ArrowButton>
              </DistributionHeader>

              <DistributionImage src={DistributionImg} alt="Distribution" />

              {/* recent activity masih hardcode, integrasi be-fe disini */}
              <DistributionItem>
                <span>10 school orders in Depok are currently on delivery</span>
                <span style={{ opacity: 0.7, fontSize: "12px" }}>09:00 AM</span>
              </DistributionItem>
            </DistributionCard>

            {/* FAVORITE MENU PER WEEK */}
            <FavoriteMenuLarge>
              <TableHeader>Favorite Menu per Week</TableHeader>

            {/* masih hardcoded, sambung bagian ini ke backend */}
            <FavMenuCard>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>Ultimate Hero Feast</div>
              <div style={{ opacity: 0.8 }}>Total pesanan: -</div>
            </FavMenuCard>

            <FavMenuCard>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>Speed Runner Combo</div>
              <div style={{ opacity: 0.8 }}>Total pesanan: -</div>
            </FavMenuCard>
            </FavoriteMenuLarge>

            {/* AVERAGE NUTRITION CARD */}
            <NutritionCard>
              <TableHeader>Average Nutrition</TableHeader>

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

          <SectionRow></SectionRow>

          <CardLarge style={{ marginTop: "35px" }}>
            <TableHeader>This Week's Statistic</TableHeader>

            <StatsRow>

                {/* Total hasil distribusi */}
                <SmallStatCard>
                <StatLabel>Total Hasil Distribusi</StatLabel>
                {/* API: total hasil distribusi */}
                <StatValue>0</StatValue>
                </SmallStatCard>

                {/* Total sekolah */}
                <SmallStatCard>
                <StatLabel>Total Sekolah per Kota yang Sudah Menerima MBG</StatLabel>
                {/* API: total sekolah */}
                <StatValue>0</StatValue>
                </SmallStatCard>

                {/* Kota tertunda */}
                <SmallStatCard>
                <StatLabel>Kota Tertunda atau Gagal</StatLabel>
                {/* API: kota tertunda/gagal */}
                <StatValue></StatValue>
                </SmallStatCard>

            </StatsRow>
            </CardLarge>


        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
