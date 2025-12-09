import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// layout utama
const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fef7ff;
  display: flex;
  flex-direction: column;
  color: black;
  overflow-y: auto;
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
  overflow-y: auto;
  overflow-x: hidden;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: black;
`;

const SubText = styled.div`
  font-size: 20px;
  opacity: 0.8;
`;

// konten page
const TopRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 25px;
  margin-top: 25px;
`;

const TableHeader = styled.div`
  width: 100%;
  background: #e5ffe6;
  border: 1px solid #8aa18d;
  border-radius: 30px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
  font-weight: 700;
  color: black;
  margin-bottom: 18px;
`;

const CardMedium = styled.div`
  width: 50%;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
  height: fit-content;
`;

const CardLarge = styled.div`
  flex: 1;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
  margin-top: 35px;
`;

// most ordered menu
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

// average nutrition
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

// statistic of the day
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

// order date filter button
const DateFilterButton = styled.button`
  background: #45a246;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  width: fit-content;

  &:hover {
    opacity: 0.9;
  }
`;

export default function Statistic() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Distribution Statistic</Title>
          <SubText>Lihat statistik pesanan MBG berdasarkan tanggal tertentu!</SubText>

          {/* DATE FILTER BUTTON */}
          <DateFilterButton>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-start"
            />
          </DateFilterButton>

          <TopRow>
            <CardMedium>
              <TableHeader>Most Ordered Menu Today</TableHeader>

            {/* to-do => integrate be-fe */}
              <FavMenuCard>
                <div style={{ fontWeight: 600, fontSize: "17px" }}>Ultimate Hero Feast</div>
                <div style={{ opacity: 0.8 }}>Total order: 0</div>
              </FavMenuCard>

              <FavMenuCard>
                <div style={{ fontWeight: 600, fontSize: "17px" }}>Speed Runner Combo</div>
                <div style={{ opacity: 0.8 }}>Total order: 0</div>
              </FavMenuCard>

              <FavMenuCard>
                <div style={{ fontWeight: 600, fontSize: "17px" }}>Galaxy Bento Set</div>
                <div style={{ opacity: 0.8 }}>Total order: 11</div>
              </FavMenuCard>
            </CardMedium>

            <CardMedium>
              <TableHeader>Average Nutrition</TableHeader>

            {/* to-do => integrate be-fe */}
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
            </CardMedium>
          </TopRow>

          <CardLarge>
            <TableHeader>Statistic of The Day</TableHeader>

            {/* to-do => integrate be-fe */}
            <StatsRow>
              <SmallStatCard>
                <StatLabel>Total hasil distribusi</StatLabel>
                <StatValue>0</StatValue>
              </SmallStatCard>

              <SmallStatCard>
                <StatLabel>Total sekolah tiap kota yang sudah menerima MBG</StatLabel>
                <StatValue>0</StatValue>
              </SmallStatCard>

              <SmallStatCard>
                <StatLabel>Kota yang tertunda atau gagal</StatLabel>
                <StatValue>0</StatValue>
              </SmallStatCard>
            </StatsRow>
          </CardLarge>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
