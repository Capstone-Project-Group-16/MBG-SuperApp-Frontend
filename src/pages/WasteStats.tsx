import { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { apiRequest, API_ENDPOINTS, getStoredToken } from "../services/api";

interface WasteRecord {
  foodWastePercentageId: number;
  orderId: number;
  wastePercentage: number;
}

interface WasteStatsResponse {
  totalRecords: number;
  averageWastePercentage: number;
  records: WasteRecord[];
}

const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
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
  margin-bottom: 10px;
`;

const SubText = styled.div`
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 30px;
  color: black;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 20px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const StatLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #214626;
`;

const StatValue = styled.div`
  font-size: 42px;
  font-weight: 700;
  color: #ff6b6b;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 30px;
  color: black;
`;

const TableHeader = styled.div`
  background: #e5ffe6;
  border: 1px solid #8aa18d;
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 700;
  color: black;
`;

const WasteTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    text-align: left;
    padding: 16px;
    background: #f0f0f0;
    border-bottom: 2px solid #ddd;
    font-weight: 700;
    color: #214626;
    font-size: 14px;
  }

  tbody td {
    padding: 14px 16px;
    border-bottom: 1px solid #e0e0e0;
    color: black;
    font-size: 14px;
  }

  tbody tr:hover {
    background: #f9f9f9;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const OrderId = styled.td`
  font-weight: 600;
  color: #214626;
`;

const WastePercentage = styled.td`
  font-weight: 600;
  color: #ff6b6b;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ddd;
`;

const ProgressBarFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: linear-gradient(90deg, #ff6b6b, #ff8888);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  color: white;
  font-size: 12px;
  font-weight: 700;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  background: ${({ isActive }) => (isActive ? "#ff6b6b" : "white")};
  color: ${({ isActive }) => (isActive ? "white" : "#ff6b6b")};
  border: 2px solid #ff6b6b;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  min-width: 36px;

  &:hover {
    background: ${({ isActive }) => (isActive ? "#ff5252" : "#fff0f0")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PaginationInfo = styled.div`
  font-size: 13px;
  color: #666;
  margin: 0 8px;
`;

export default function WasteStats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wasteData, setWasteData] = useState<WasteRecord[]>([]);
  const [averageWaste, setAverageWaste] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;
  const maxItems = 1000;

  const fetchWasteStats = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const token = getStoredToken();
      const endpoint = `${API_ENDPOINTS.WASTE_STATS.ALL}?limit=${maxItems}`;

      const data = await apiRequest<WasteStatsResponse>(endpoint, {
        method: "GET",
        token: token || undefined,
      });

      const allRecords = data.records || [];
      setTotalRecords(allRecords.length);
      setAverageWaste(data.averageWastePercentage);

      // Paginate the data
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setWasteData(allRecords.slice(startIndex, endIndex));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch waste stats:", error);
      setWasteData([]);
      setAverageWaste(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteStats(1);
  }, []);

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Food Waste Statistics</Title>
          <SubText>Monitor food waste percentage across all orders</SubText>

          <StatsContainer>
            <StatCard>
              <StatLabel>Average Waste Percentage</StatLabel>
              <StatValue>{averageWaste.toFixed(2)}%</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Records</StatLabel>
              <StatValue>{totalRecords}</StatValue>
            </StatCard>
          </StatsContainer>

          <TableContainer>
            <TableHeader>Waste Records</TableHeader>

            {isLoading ? (
              <LoadingContainer>Loading waste statistics...</LoadingContainer>
            ) : wasteData.length > 0 ? (
              <>
                <WasteTable>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Waste Percentage</th>
                      <th>Visual Representation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteData.map((record) => (
                      <tr key={record.foodWastePercentageId}>
                        <OrderId>#{record.orderId}</OrderId>
                        <WastePercentage>{record.wastePercentage.toFixed(2)}%</WastePercentage>
                        <td>
                          <ProgressBarContainer>
                            <ProgressBarFill percentage={record.wastePercentage}>
                              {record.wastePercentage > 10 ? `${record.wastePercentage.toFixed(1)}%` : ""}
                            </ProgressBarFill>
                          </ProgressBarContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </WasteTable>

                <PaginationContainer>
                  <PaginationButton
                    onClick={() => fetchWasteStats(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </PaginationButton>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    const isActive = pageNum === currentPage;
                    const isVisible = Math.abs(pageNum - currentPage) <= 2 || pageNum === 1 || pageNum === totalPages;

                    if (!isVisible) {
                      if (index === 2 || (index > 2 && Math.abs(pageNum - currentPage) === 3)) {
                        return <PaginationInfo key={`ellipsis-${index}`}>...</PaginationInfo>;
                      }
                      return null;
                    }

                    return (
                      <PaginationButton
                        key={pageNum}
                        isActive={isActive}
                        onClick={() => fetchWasteStats(pageNum)}
                      >
                        {pageNum}
                      </PaginationButton>
                    );
                  })}

                  <PaginationButton
                    onClick={() => fetchWasteStats(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </PaginationButton>

                  <PaginationInfo style={{ marginLeft: "16px" }}>
                    Page {currentPage} of {totalPages}
                  </PaginationInfo>
                </PaginationContainer>
              </>
            ) : (
              <EmptyContainer>No waste statistics available.</EmptyContainer>
            )}
          </TableContainer>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
