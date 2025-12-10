import { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { apiRequest, API_ENDPOINTS, getStoredToken } from "../services/api";

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

interface School {
  id: number;
  name: string;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #214626;
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 2px solid #45a246;
  border-radius: 10px;
  background: white;
  color: black;
  font-size: 14px;
  cursor: pointer;
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: #214626;
    box-shadow: 0 0 0 3px rgba(69, 162, 70, 0.12);
  }
`;

const FilterButton = styled.button`
  padding: 10px 24px;
  background: #45a246;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #388642;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LeaderboardContainer = styled.div`
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 30px;
  color: black;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 16px;
    background: #e5ffe6;
    border-bottom: 2px solid #8aa18d;
    font-weight: 700;
    color: #214626;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    color: black;
  }

  tr:hover {
    background: #f9f9f9;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const RankCell = styled.td`
  font-weight: 700;
  font-size: 18px;
  color: #45a246;
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StudentAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f0f0;
`;

const StudentNamePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #45a246;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
`;

const StudentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StudentName = styled.div`
  font-weight: 700;
  color: #214626;
`;

const StudentSchool = styled.div`
  font-size: 12px;
  color: #999;
`;

const ExpPoints = styled.td`
  font-weight: 700;
  font-size: 18px;
  color: #45a246;
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
  background: ${({ isActive }) => (isActive ? "#45a246" : "white")};
  color: ${({ isActive }) => (isActive ? "white" : "#45a246")};
  border: 2px solid #45a246;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  min-width: 36px;

  &:hover {
    background: ${({ isActive }) => (isActive ? "#388642" : "#f0f0f0")};
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

const PROVINCES = [
  { value: "ACEH", label: "Aceh" },
  { value: "BALI", label: "Bali" },
  { value: "BANTEN", label: "Banten" },
  { value: "BENGKULU", label: "Bengkulu" },
  { value: "DI_YOGYAKARTA", label: "DI Yogyakarta" },
  { value: "DKI_JAKARTA", label: "DKI Jakarta" },
  { value: "GORONTALO", label: "Gorontalo" },
  { value: "JAMBI", label: "Jambi" },
  { value: "JAWA_BARAT", label: "Jawa Barat" },
  { value: "JAWA_TENGAH", label: "Jawa Tengah" },
  { value: "JAWA_TIMUR", label: "Jawa Timur" },
  { value: "KALIMANTAN_BARAT", label: "Kalimantan Barat" },
  { value: "KALIMANTAN_SELATAN", label: "Kalimantan Selatan" },
  { value: "KALIMANTAN_TENGAH", label: "Kalimantan Tengah" },
  { value: "KALIMANTAN_TIMUR", label: "Kalimantan Timur" },
  { value: "KALIMANTAN_UTARA", label: "Kalimantan Utara" },
];

export default function Leaderboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "province" | "school">("all");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const itemsPerPage = 10;
  const maxItems = 1000;

  // Fetch schools when filter type is "school"
  useEffect(() => {
    if (filterType === "school") {
      // TODO: Fetch schools from backend
      setSchools([
        { id: 1, name: "SMAN 1 Jakarta" },
        { id: 2, name: "SMAN 2 Jakarta" },
        { id: 3, name: "SMAN 1 Depok" },
        { id: 4, name: "SMAN 2 Depok" },
      ]);
    }
  }, [filterType]);

  const fetchLeaderboard = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const token = getStoredToken();
      let endpoint = `${API_ENDPOINTS.LEADERBOARD.GET}?filter_type=${filterType}&limit=${maxItems}`;

      if (filterType === "province" && selectedProvince) {
        endpoint += `&province=${selectedProvince}`;
      } else if (filterType === "school" && selectedSchool) {
        endpoint += `&school_id=${selectedSchool}`;
      }

      const data = await apiRequest<LeaderboardResponse>(endpoint, {
        method: "GET",
        token: token || undefined,
      });

      const allData = data.leaderboard || [];
      setTotalEntries(Math.min(allData.length, maxItems));
      
      // Paginate the data
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setLeaderboard(allData.slice(startIndex, endIndex));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    if (filterType === "all") {
      fetchLeaderboard(1);
    } else if (filterType === "province" && selectedProvince) {
      fetchLeaderboard(1);
    } else if (filterType === "school" && selectedSchool) {
      fetchLeaderboard(1);
    }
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as "all" | "province" | "school");
    setSelectedProvince("");
    setSelectedSchool("");
    setCurrentPage(1);
  };

  const getFilterDescription = () => {
    if (filterType === "all") {
      return "National (all students)";
    } else if (filterType === "province" && selectedProvince) {
      const provinceName = PROVINCES.find((p) => p.value === selectedProvince)?.label;
      return `Province: ${provinceName}`;
    } else if (filterType === "school" && selectedSchool) {
      const schoolName = schools.find((s) => s.id === parseInt(selectedSchool))?.name;
      return `School: ${schoolName}`;
    }
    return "Select filter criteria";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Student Leaderboard</Title>
          <SubText>View top students by different filters</SubText>

          <FilterContainer>
            <FilterGroup>
              <FilterLabel>Filter Type</FilterLabel>
              <FilterSelect value={filterType} onChange={handleFilterTypeChange}>
                <option value="all">National</option>
                <option value="province">By Province</option>
                <option value="school">By School</option>
              </FilterSelect>
            </FilterGroup>

            {filterType === "province" && (
              <FilterGroup>
                <FilterLabel>Province</FilterLabel>
                <FilterSelect
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map((province) => (
                    <option key={province.value} value={province.value}>
                      {province.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}

            {filterType === "school" && (
              <FilterGroup>
                <FilterLabel>School</FilterLabel>
                <FilterSelect
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}

            <FilterButton onClick={handleApplyFilter}>Apply Filter</FilterButton>
          </FilterContainer>

          <LeaderboardContainer>
            {isLoading ? (
              <LoadingContainer>Loading leaderboard data...</LoadingContainer>
            ) : leaderboard.length > 0 ? (
              <>
                <LeaderboardTable>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Student</th>
                      <th>School</th>
                      <th>EXP Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr key={entry.studentProfileId}>
                        <RankCell>{entry.rank}</RankCell>
                        <td>
                          <StudentInfo>
                            {entry.userProfilePictureLink ? (
                              <StudentAvatar src={entry.userProfilePictureLink} alt={entry.userFullName} />
                            ) : (
                              <StudentNamePlaceholder>{getInitials(entry.userFullName)}</StudentNamePlaceholder>
                            )}
                            <StudentDetails>
                              <StudentName>{entry.userFullName}</StudentName>
                            </StudentDetails>
                          </StudentInfo>
                        </td>
                        <td>{entry.schoolName}</td>
                        <ExpPoints>{entry.expPoints.toLocaleString()}</ExpPoints>
                      </tr>
                    ))}
                  </tbody>
                </LeaderboardTable>

                <PaginationContainer>
                  <PaginationButton
                    onClick={() => fetchLeaderboard(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </PaginationButton>

                  {Array.from({ length: Math.ceil(totalEntries / itemsPerPage) }).map((_, index) => {
                    const pageNum = index + 1;
                    const isActive = pageNum === currentPage;
                    const isVisible = Math.abs(pageNum - currentPage) <= 2 || pageNum === 1 || pageNum === Math.ceil(totalEntries / itemsPerPage);

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
                        onClick={() => fetchLeaderboard(pageNum)}
                      >
                        {pageNum}
                      </PaginationButton>
                    );
                  })}

                  <PaginationButton
                    onClick={() => fetchLeaderboard(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalEntries / itemsPerPage)}
                  >
                    Next →
                  </PaginationButton>

                  <PaginationInfo style={{ marginLeft: "16px" }}>
                    Page {currentPage} of {Math.ceil(totalEntries / itemsPerPage)}
                  </PaginationInfo>
                </PaginationContainer>
              </>
            ) : (
              <EmptyContainer>No leaderboard data available. Try applying a filter.</EmptyContainer>
            )}
          </LeaderboardContainer>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
