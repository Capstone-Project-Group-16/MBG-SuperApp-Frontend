import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_ENDPOINTS, apiRequest, getStoredToken } from "../services/api";

// Layout
const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #FEF7FF;
  display: flex;
  flex-direction: column;
  color: black;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 35px;
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  margin-left: 20px;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 16px;
  color: black;
`;

const BackButton = styled.button`
  width: fit-content;
  padding: 8px 16px;
  background: #45a246;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;

  &:hover {
    background: #388642;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 25px;
  margin-bottom: 20px;
`;

const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatusItem = styled.div`
  background: #f0f0f0;
  border-radius: 10px;
  padding: 15px;
  border-left: 4px solid #45a246;
`;

const StatusLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const StatusValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #214626;
`;

const Timeline = styled.div`
  position: relative;
  padding: 20px 0 20px 40px;

  &::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #45a246;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 25px;
  padding-bottom: 15px;

  &::before {
    content: "";
    position: absolute;
    left: -35px;
    top: 5px;
    width: 12px;
    height: 12px;
    background: #45a246;
    border-radius: 50%;
    border: 3px solid white;
  }

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const TimelineTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
`;

const TimelineStatus = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #214626;
  margin-bottom: 5px;
`;

const TimelineRole = styled.div`
  font-size: 13px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #ffe5e5;
  border: 1px solid #ff6b6b;
  border-radius: 10px;
  padding: 15px;
  color: #ff6b6b;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #999;
`;

interface Plate {
  plateId: number;
  orderId: number | null;
  plateCode: string;
  plateStatus: string;
}

interface DistributionStatus {
  requestedDate: string;
  plateDistributionStatus: string;
}

interface Distribution {
  plateDistributionId: number;
  plateId: number;
  plateCode: string;
  orderId: number | null;
  plateDistributionScanTime: string;
  plateDistributionScanDate: string;
  plateDistributionScanRole: string;
  plateDistributionScanRoleId: number;
  plateDistributionStatus: string;
}

interface DistributionHistory {
  requestedDate: string;
  plateId: number;
  distributions: Distribution[];
}

export default function DistributionDetail() {
  const { plateId } = useParams<{ plateId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plate, setPlate] = useState<Plate | null>(null);
  const [currentStatus, setCurrentStatus] = useState<DistributionStatus | null>(null);
  const [history, setHistory] = useState<DistributionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getStoredToken();
        const today = new Date();
        const orderDate = `${String(today.getDate()).padStart(2, "0")}:${String(today.getMonth() + 1).padStart(2, "0")}:${today.getFullYear()}`;

        if (!plateId) {
          setError("Plate ID is missing");
          setLoading(false);
          return;
        }

        // Fetch plate details
        const platesData = await apiRequest<Plate[]>(
          `${API_ENDPOINTS.PLATE.LIST}?skip=0&limit=1000`,
          { method: "GET", token: token || undefined }
        );
        const foundPlate = platesData.find((p: Plate) => p.plateId === parseInt(plateId));
        if (foundPlate) {
          setPlate(foundPlate);
        }

        // Fetch current distribution status
        const statusData = await apiRequest<DistributionStatus>(
          API_ENDPOINTS.PLATE.GET_STATUS,
          {
            method: "POST",
            token: token || undefined,
            body: JSON.stringify({
              plateId: parseInt(plateId),
              requestedDate: orderDate,
            }),
          }
        );
        setCurrentStatus(statusData);

        // Fetch distribution history
        const historyData = await apiRequest<DistributionHistory>(
          API_ENDPOINTS.PLATE.GET_HISTORY,
          {
            method: "POST",
            token: token || undefined,
            body: JSON.stringify({
              plateId: parseInt(plateId),
              requestedDate: orderDate,
            }),
          }
        );
        setHistory(historyData);
      } catch (err) {
        console.error("Failed to fetch distribution data:", err);
        setError("Failed to load distribution details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plateId]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      BEING_PREPARED: "#999",
      READY_TO_SEND: "#FFC447",
      ON_DELIVERY: "#67D4FF",
      ARRIVED_AT_SCHOOL: "#45a246",
      FINISHED_EATING: "#45a246",
      RETURNING_TO_CATERING: "#FFC447",
      RETURNED_TO_CATERING: "#C070FF",
    };
    return colors[status] || "#999";
  };

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <MainContent>
          <BackButton onClick={() => navigate("/tracker")}>← Back to Tracker</BackButton>
          <Title>Plate Distribution Details</Title>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {loading ? (
            <LoadingMessage>Loading distribution data...</LoadingMessage>
          ) : (
            <>
              {plate && (
                <Card>
                  <StatusContainer>
                    <StatusItem>
                      <StatusLabel>Plate Code</StatusLabel>
                      <StatusValue>{plate.plateCode}</StatusValue>
                    </StatusItem>
                    <StatusItem>
                      <StatusLabel>Plate Status</StatusLabel>
                      <StatusValue>{plate.plateStatus}</StatusValue>
                    </StatusItem>
                    <StatusItem>
                      <StatusLabel>Order ID</StatusLabel>
                      <StatusValue>{plate.orderId ? `#${plate.orderId}` : "Not Assigned"}</StatusValue>
                    </StatusItem>
                    {currentStatus && (
                      <StatusItem>
                        <StatusLabel>Current Distribution Status</StatusLabel>
                        <StatusValue style={{ color: getStatusColor(currentStatus.plateDistributionStatus) }}>
                          {currentStatus.plateDistributionStatus.replace(/_/g, " ")}
                        </StatusValue>
                      </StatusItem>
                    )}
                  </StatusContainer>
                </Card>
              )}

              {history && history.distributions.length > 0 ? (
                <Card>
                  <h3 style={{ marginBottom: "20px", color: "#214626" }}>Distribution Timeline</h3>
                  <Timeline>
                    {history.distributions.map((dist) => (
                      <TimelineItem key={dist.plateDistributionId}>
                        <TimelineTime>
                          {dist.plateDistributionScanDate} at {dist.plateDistributionScanTime}
                        </TimelineTime>
                        <TimelineStatus style={{ color: getStatusColor(dist.plateDistributionStatus) }}>
                          {dist.plateDistributionStatus.replace(/_/g, " ")}
                        </TimelineStatus>
                        <TimelineRole>Scanned by: {dist.plateDistributionScanRole}</TimelineRole>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Card>
              ) : (
                <Card>
                  <p style={{ color: "#999", textAlign: "center" }}>No distribution history available for today</p>
                </Card>
              )}
            </>
          )}
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
