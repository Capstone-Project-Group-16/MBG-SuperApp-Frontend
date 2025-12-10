import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { apiRequest, API_ENDPOINTS, getStoredToken } from "../services/api";

interface MostOrderedFood {
  rank: number;
  foodId: number;
  foodName: string;
  foodImageLink: string;
  foodPrice: number;
  cateringId: number;
  totalOrders: number;
}

interface MostOrderedFoodResponse {
  mostOrderedFood: MostOrderedFood[];
  total: number;
  orderDate: string;
  filterType: string;
}

interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  magnesium: number;
  totalOrders: number;
}

interface AverageNutritionResponse {
  orderDate: string;
  filterType: string;
  data: Nutrition | null;
  dataByProvince: any[] | null;
  dataBySchool: any[] | null;
}

interface LeaderboardEntry {
  rank: number;
  studentProfileId: number;
  userId: number;
  userFullName: string;
  userProfilePictureLink: string | null;
  schoolId: number;
  schoolName: string;
  expPoints: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
}

interface WasteStatsResponse {
  totalRecords: number;
  averageWastePercentage: number;
  records: Array<{
    foodWastePercentageId: number;
    orderId: number;
    wastePercentage: number;
  }>;
}

interface Plate {
  plateId: number;
  orderId: number | null;
  plateCode: string;
  plateStatus: string;
}

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
  font-weight: 700;
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
  justify-content: space-between;
  width: 100%;
  gap: 25px;
  margin-top: 25px;
  margin-left: -40px;
  margin-right: -40px;
  padding-left: 40px;
  padding-right: 40px;
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
  font-weight: 700;
  color: black;
  margin-bottom: 18px;
`;

// average nutrition ---
const NutritionCard = styled.div`
  width: calc((100% - 25px) / 2);
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
  width: calc((100% - 25px) / 2);
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
  height: fit-content;
  max-height: 600px;
  overflow-y: auto;
`;

const FavMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FavMenuCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #45a246;
  padding: 10px 14px;
  margin-bottom: 0;
  color: black;
  min-height: 50px;

  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;

  &:hover {
    background-color: #f9fff9;
  }
`;

const FavMenuTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #214626;
`;

const FavMenuCount = styled.div`
  opacity: 0.7;
  font-size: 13px;
  color: #555;
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

const BottomRow = styled.div`
  display: flex;
  gap: 25px;
  width: 100%;
  margin-top: 35px;
`;

const LeaderboardSection = styled.div`
  flex: 1;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 20px 25px;
  color: black;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 600px;
  overflow-y: auto;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;

  tbody tr {
    border-bottom: 1px solid #e0e0e0;

    &:hover {
      background: #f9f9f9;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 12px 8px;
    font-size: 14px;
    color: black;
  }
`;

const LeaderboardRank = styled.td`
  font-weight: 700;
  font-size: 16px;
  color: #45a246;
  width: 40px;
`;

const LeaderboardName = styled.td`
  font-weight: 600;
  color: #214626;
  flex: 1;
`;

const LeaderboardSchool = styled.td`
  font-size: 13px;
  color: #999;
  width: 150px;
`;

const LeaderboardPoints = styled.td`
  font-weight: 700;
  color: #45a246;
  text-align: right;
  width: 100px;
`;

const ViewMoreLink = styled(Link)`
  align-self: center;
  margin-top: 15px;
  padding: 8px 16px;
  background: #45a246;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #388642;
  }
`;

const WasteCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(255, 107, 107, 0.5);
  padding: 20px 25px;
  color: black;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 600px;
  overflow-y: auto;
`;

const WasteTableHeader = styled.div`
  width: 100%;
  background: #ffe5e5;
  border: 1px solid #ff6b6b;
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

const WasteStatsDisplay = styled.div`
  text-align: center;
  margin-bottom: 16px;

  div:first-child {
    font-size: 13px;
    color: #666;
    margin-bottom: 6px;
  }

  div:last-child {
    font-size: 28px;
    font-weight: 700;
    color: #ff6b6b;
  }
`;

const ViewMoreWasteLink = styled(Link)`
  align-self: center;
  margin-top: 15px;
  padding: 8px 16px;
  background: #ff6b6b;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #ff5252;
  }
`;


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mostOrderedFood, setMostOrderedFood] = useState<MostOrderedFood[]>([]);
  const [nutrition, setNutrition] = useState<Nutrition | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [wasteAverage, setWasteAverage] = useState(0);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getStoredToken();
        const today = new Date();
        const orderDate = `${String(today.getDate()).padStart(2, "0")}:${String(today.getMonth() + 1).padStart(2, "0")}:${today.getFullYear()}`;
        
        const foodEndpoint = `${API_ENDPOINTS.FOOD_DEMAND.MOST_ORDERED}?order_date=${orderDate}&filter_type=all`;
        const nutritionEndpoint = `${API_ENDPOINTS.FOOD_DEMAND.AVERAGE_NUTRITION}?order_date=${orderDate}&filter_type=all`;
        const leaderboardEndpoint = `${API_ENDPOINTS.LEADERBOARD.GET}?filter_type=all`;
        const wasteEndpoint = `${API_ENDPOINTS.WASTE_STATS.ALL}?limit=1000`;
        const platesEndpoint = `${API_ENDPOINTS.PLATE.LIST}?skip=0&limit=1000`;
        
        const [foodData, nutritionData, leaderboardData, wasteData, platesData] = await Promise.all([
          apiRequest<MostOrderedFoodResponse>(foodEndpoint, {
            method: "GET",
            token: token || undefined,
          }),
          apiRequest<AverageNutritionResponse>(nutritionEndpoint, {
            method: "GET",
            token: token || undefined,
          }),
          apiRequest<LeaderboardResponse>(leaderboardEndpoint, {
            method: "GET",
            token: token || undefined,
          }),
          apiRequest<WasteStatsResponse>(wasteEndpoint, {
            method: "GET",
            token: token || undefined,
          }),
          apiRequest<Plate[]>(platesEndpoint, {
            method: "GET",
            token: token || undefined,
          }),
        ]);
        
        // Limit to 10 items
        setMostOrderedFood(foodData.mostOrderedFood.slice(0, 10));
        setNutrition(nutritionData.data);
        setLeaderboard(leaderboardData.leaderboard.slice(0, 10));
        setWasteAverage(wasteData.averageWastePercentage);
        setPlates(platesData.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setMostOrderedFood([]);
        setNutrition(null);
        setLeaderboard([]);
        setWasteAverage(0);
        setPlates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Welcome, Government</Title>
          <SubText>Apa yang bisa kami bantu hari ini?</SubText>

          {/* Check distribution */}
          <TopRow>
            <DistributionCard>
              <DistributionHeader>
                Plates Status
                <ArrowButton to="/tracker">→</ArrowButton>
              </DistributionHeader>

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  Loading...
                </div>
              ) : plates.length > 0 ? (
                <div style={{ padding: "15px" }}>
                  {plates.map((plate) => (
                    <DistributionItem key={plate.plateId}>
                      <span style={{ fontWeight: 600 }}>{plate.plateCode}</span>
                      <span style={{ opacity: 0.7, fontSize: "12px", display: "block", marginTop: "4px" }}>
                        Status: {plate.plateStatus.replace(/_/g, " ")}
                        {plate.orderId && ` • Order #${plate.orderId}`}
                      </span>
                    </DistributionItem>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  No plates available
                </div>
              )}
            </DistributionCard>

            {/* FAVORITE MENU PER WEEK */}
            <FavoriteMenuLarge>
              <TableHeader>Favorite Menu per Week</TableHeader>

              <FavMenuContainer>
                {isLoading ? (
                  <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                    Loading...
                  </div>
                ) : mostOrderedFood.length > 0 ? (
                  mostOrderedFood.map((item) => (
                    <FavMenuCard key={item.foodId}>
                      <FavMenuTitle>#{item.rank} {item.foodName}</FavMenuTitle>
                      <FavMenuCount>Total pesanan: {item.totalOrders}</FavMenuCount>
                    </FavMenuCard>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                    No data available
                  </div>
                )}
              </FavMenuContainer>
            </FavoriteMenuLarge>

            {/* AVERAGE NUTRITION CARD */}
            <NutritionCard>
              <TableHeader>Average Nutrition</TableHeader>

              {nutrition ? (
                <BarWrapper>
                  <BarRow>
                    <BarLabel>Potassium – {nutrition.potassium.toFixed(1)} mg</BarLabel>
                    <BarBackground>
                      <BarFill width={`${Math.min((nutrition.potassium / 1000) * 100, 100)}%`} color="#C070FF" />
                    </BarBackground>
                  </BarRow>

                  <BarRow>
                    <BarLabel>Calcium – {nutrition.calcium.toFixed(1)} mg</BarLabel>
                    <BarBackground>
                      <BarFill width={`${Math.min((nutrition.calcium / 300) * 100, 100)}%`} color="#67D4FF" />
                    </BarBackground>
                  </BarRow>

                  <BarRow>
                    <BarLabel>Iron (Zat Besi) – {nutrition.iron.toFixed(1)} mg</BarLabel>
                    <BarBackground>
                      <BarFill width={`${Math.min((nutrition.iron / 18) * 100, 100)}%`} color="#A05A2C" />
                    </BarBackground>
                  </BarRow>

                  <BarRow>
                    <BarLabel>Vitamin A – {nutrition.vitaminA.toFixed(1)} mcg</BarLabel>
                    <BarBackground>
                      <BarFill width={`${Math.min((nutrition.vitaminA / 900) * 100, 100)}%`} color="#FFC447" />
                    </BarBackground>
                  </BarRow>

                  <BarRow>
                    <BarLabel>Vitamin C – {nutrition.vitaminC.toFixed(1)} mg</BarLabel>
                    <BarBackground>
                      <BarFill width={`${Math.min((nutrition.vitaminC / 90) * 100, 100)}%`} color="#A8FF3A" />
                    </BarBackground>
                  </BarRow>

                  <BarRow>
                    <BarLabel>Vitamin D – {nutrition.vitaminD.toFixed(1)} mcg</BarLabel>
                    <BarBackground>
                      <BarFill width={`${Math.min((nutrition.vitaminD / 20) * 100, 100)}%`} color="#FFF2A6" />
                    </BarBackground>
                  </BarRow>

                  <BarRow>
                    <BarLabel>Magnesium – {nutrition.magnesium.toFixed(1)} mg</BarLabel>
                    <BarBackground>
                      <BarFill width={`${Math.min((nutrition.magnesium / 420) * 100, 100)}%`} color="#7A90A4" />
                    </BarBackground>
                  </BarRow>
                </BarWrapper>
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  No nutrition data available
                </div>
              )}
            </NutritionCard>
          </TopRow>

          {/* LEADERBOARD & WASTE STATS SECTION */}
          <BottomRow>
            <LeaderboardSection>
              <TableHeader>Top 10 Student Leaderboard</TableHeader>

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  Loading...
                </div>
              ) : leaderboard.length > 0 ? (
                <>
                  <LeaderboardTable>
                    <tbody>
                      {leaderboard.map((entry) => (
                        <tr key={entry.studentProfileId}>
                          <LeaderboardRank>{entry.rank}</LeaderboardRank>
                          <LeaderboardName>{entry.userFullName}</LeaderboardName>
                          <LeaderboardSchool>{entry.schoolName}</LeaderboardSchool>
                          <LeaderboardPoints>{entry.expPoints.toLocaleString()}</LeaderboardPoints>
                        </tr>
                      ))}
                    </tbody>
                  </LeaderboardTable>
                  <ViewMoreLink to="/leaderboard">View Full Leaderboard →</ViewMoreLink>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  No leaderboard data available
                </div>
              )}
            </LeaderboardSection>

            {/* WASTE STATS SECTION */}
            <WasteCard>
              <WasteTableHeader>Average Food Waste</WasteTableHeader>

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  Loading...
                </div>
              ) : wasteAverage > 0 ? (
                <>
                  <WasteStatsDisplay>
                    <div style={{ fontSize: "48px", fontWeight: "bold", color: "#ff6b6b" }}>
                      {wasteAverage.toFixed(2)}%
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                      Average Waste Percentage
                    </div>
                  </WasteStatsDisplay>
                  <ViewMoreWasteLink to="/waste-stats">View Detailed Stats →</ViewMoreWasteLink>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  No waste data available
                </div>
              )}
            </WasteCard>
          </BottomRow>

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
                <StatValue>0</StatValue>
                </SmallStatCard>

            </StatsRow>
            </CardLarge>


        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
