import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_ENDPOINTS, apiRequest, getStoredToken } from "../services/api";

// layout utama
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

const SubtitleBox = styled.div`
  flex: 1;
  min-height: 40px;
  background: #b1d2b2;
  border: 1px solid #8aa18d;
  border-radius: 5px;

  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 15px;

  color: black;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
`;

const DropdownRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  width: 130px;
  height: 33px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 30px;
  border: 2px solid #45a246;
  padding: 6px 14px;
  font-size: 14px;
  color: black;
  cursor: pointer;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23454a4f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(69, 162, 70, 0.12);
  }
`;

const TableCardWrapper = styled.div`
  flex: 1;
  height: auto;
  position: relative;
  margin-top: 20px;
`;

const CardOuter = styled.div`
  flex: 1;
  min-height: 120px;
  background: white;
  border-radius: 10px;
  border: 2px rgba(69, 162, 70, 0.5) solid;
  position: relative;
  padding: 16px;
`;

const CardHeader = styled.div`
  flex: 1;
  background: #b1d2b2;
  border-top-left-radius: 5px;
  border-top-right-radius: 10px;
  border: 1px #8aa18d solid;

  display: flex;
  align-items: center;
  padding-left: 15px;

  font-size: 20px;
  font-weight: 700;
  color: black;
`;

const PlateItem = styled.div<{ status: string }>`
  height: 80px;
  background: ${(props) => {
    switch (props.status) {
      case "READY_TO_USE":
        return "#e5ffe6";
      case "BEING_USED":
        return "#fff3e0";
      case "MISSING":
        return "#ffebee";
      case "DECOMMISSIONED":
        return "#f5f5f5";
      default:
        return "#e5ffe6";
    }
  }};
  border-radius: 10px;
  border: 1px #8aa18d solid;

  margin: 12px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(69, 162, 70, 0.2);
    transform: translateY(-2px);
  }
`;

const PlateTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: black;
`;

const PlateSubtitle = styled.div`
  margin-top: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #999;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  border: 1px solid #ff6b6b;
  border-radius: 10px;
  padding: 15px;
  color: #ff6b6b;
  margin-bottom: 20px;
`;

interface Plate {
  plateId: number;
  orderId: number | null;
  plateCode: string;
  plateStatus: string;
}

export default function Tracker() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [plates, setPlates] = useState<Plate[]>([]);
  const [filteredPlates, setFilteredPlates] = useState<Plate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const token = getStoredToken();
        const data = await apiRequest<Plate[]>(
          `${API_ENDPOINTS.PLATE.LIST}?skip=0&limit=1000`,
          { method: "GET", token: token || undefined }
        );
        setPlates(data);
        setFilteredPlates(data);
      } catch (err) {
        console.error("Failed to fetch plates:", err);
        setError("Failed to load plates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlates();
  }, []);

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    setCurrentPage(1);

    if (status === "") {
      setFilteredPlates(plates);
    } else {
      setFilteredPlates(plates.filter((p) => p.plateStatus === status));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      READY_TO_USE: "#45a246",
      BEING_USED: "#FFC447",
      MISSING: "#ff6b6b",
      DECOMMISSIONED: "#999",
    };
    return colors[status] || "#999";
  };

  const paginatedPlates = filteredPlates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPlates.length / itemsPerPage);

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Distribution Tracker</Title>
          <SubtitleBox>
            Click on any plate to view its distribution status and complete history.
            Filter plates by their current status using the dropdown below.
          </SubtitleBox>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <DropdownRow>
            <Select value={statusFilter} onChange={handleStatusFilter}>
              <option value="">All Statuses</option>
              <option value="READY_TO_USE">Ready to Use</option>
              <option value="BEING_USED">Being Used</option>
              <option value="MISSING">Missing</option>
              <option value="DECOMMISSIONED">Decommissioned</option>
            </Select>
          </DropdownRow>

          {loading ? (
            <LoadingMessage>Loading plates...</LoadingMessage>
          ) : filteredPlates.length === 0 ? (
            <LoadingMessage>No plates found</LoadingMessage>
          ) : (
            <>
              <TableCardWrapper>
                <CardOuter>
                  <CardHeader>All Plates ({filteredPlates.length})</CardHeader>

                  {paginatedPlates.map((plate) => (
                    <PlateItem
                      key={plate.plateId}
                      status={plate.plateStatus}
                      onClick={() => navigate(`/distribution-detail/${plate.plateId}`)}
                    >
                      <PlateTitle>{plate.plateCode}</PlateTitle>
                      <PlateSubtitle>
                        Status: <span style={{ color: getStatusColor(plate.plateStatus), fontWeight: 600 }}>
                          {plate.plateStatus.replace(/_/g, " ")}
                        </span>
                        {plate.orderId && ` • Order #${plate.orderId}`}
                      </PlateSubtitle>
                    </PlateItem>
                  ))}

                  {totalPages > 1 && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{
                          margin: "0 5px",
                          padding: "6px 12px",
                          background: currentPage === 1 ? "#ddd" : "#45a246",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        Previous
                      </button>
                      <span style={{ margin: "0 10px" }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                          margin: "0 5px",
                          padding: "6px 12px",
                          background: currentPage === totalPages ? "#ddd" : "#45a246",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </CardOuter>
              </TableCardWrapper>
            </>
          )}
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
