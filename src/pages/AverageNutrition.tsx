import { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { apiRequest, API_ENDPOINTS, getStoredToken } from "../services/api";

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

interface ProvinceNutrition {
  province: string;
  averageNutrition: Nutrition | null;
}

interface SchoolNutrition {
  schoolId: number;
  schoolName: string;
  averageNutrition: Nutrition | null;
}

interface AverageNutritionResponse {
  orderDate: string;
  filterType: string;
  data: Nutrition | null;
  dataByProvince: ProvinceNutrition[] | null;
  dataBySchool: SchoolNutrition[] | null;
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

const DataContainer = styled.div`
  background: white;
  border-radius: 30px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 30px;
  color: black;
`;

const DataHeader = styled.div`
  background: #e5ffe6;
  border: 1px solid #8aa18d;
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 700;
  color: black;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const NutritionCard = styled.div`
  background: white;
  border: 2px solid #45a246;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(69, 162, 70, 0.15);
    transform: translateY(-2px);
  }
`;

const NutrientName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #214626;
`;

const NutrientValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #45a246;
`;

const NutrientUnit = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: 600;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

const ProgressBarFill = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${({ percentage }) => Math.min(percentage, 100)}%;
  background: ${({ color }) => color || "#45a246"};
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
`;

const PercentageText = styled.span<{ percentage: number }>`
  color: ${({ percentage }) => (percentage > 100 ? "#ff6b6b" : "#45a246")};
  font-weight: 600;
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

export default function AverageNutrition() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "province" | "school">("all");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchools] = useState<Array<{ id: number; name: string }>>([]);
  const [nutrition, setNutrition] = useState<Nutrition | null>(null);
  const [nutritionByProvince, setNutritionByProvince] = useState<ProvinceNutrition[] | null>(null);
  const [nutritionBySchool, setNutritionBySchool] = useState<SchoolNutrition[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataDate, setDataDate] = useState("");

  // Get today's date in dd:mm:yyyy format
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}:${String(today.getMonth() + 1).padStart(2, "0")}:${today.getFullYear()}`;
    setDataDate(formattedDate);
  }, []);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = getStoredToken();
      let endpoint = `${API_ENDPOINTS.FOOD_DEMAND.AVERAGE_NUTRITION}?order_date=${dataDate}&filter_type=${filterType}`;

      if (filterType === "province" && selectedProvince) {
        endpoint += `&province=${selectedProvince}`;
      } else if (filterType === "school" && selectedSchool) {
        endpoint += `&school_id=${selectedSchool}`;
      }

      const data = await apiRequest<AverageNutritionResponse>(endpoint, {
        method: "GET",
        token: token || undefined,
      });

      if (filterType === "all") {
        setNutrition(data.data);
        setNutritionByProvince(null);
        setNutritionBySchool(null);
      } else if (filterType === "province") {
        setNutrition(null);
        setNutritionByProvince(data.dataByProvince);
        setNutritionBySchool(null);
      } else if (filterType === "school") {
        setNutrition(null);
        setNutritionByProvince(null);
        setNutritionBySchool(data.dataBySchool);
      }
    } catch (error) {
      console.error("Failed to fetch nutrition data:", error);
      setNutrition(null);
      setNutritionByProvince(null);
      setNutritionBySchool(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = () => {
    if (filterType === "all") {
      fetchData();
    } else if (filterType === "province" && selectedProvince) {
      fetchData();
    } else if (filterType === "school" && selectedSchool) {
      fetchData();
    }
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as "all" | "province" | "school");
    setSelectedProvince("");
    setSelectedSchool("");
  };

  const getFilterDescription = () => {
    if (filterType === "all") {
      return "National (all schools across all provinces)";
    } else if (filterType === "province" && selectedProvince) {
      const provinceName = PROVINCES.find((p) => p.value === selectedProvince)?.label;
      return `Province: ${provinceName}`;
    } else if (filterType === "school" && selectedSchool) {
      const schoolName = schools.find((s) => s.id === parseInt(selectedSchool))?.name;
      return `School: ${schoolName}`;
    }
    return "Select filter criteria";
  };

  const renderNutritionData = () => {
    if (isLoading) {
      return <LoadingContainer>Loading nutrition data...</LoadingContainer>;
    }

    if (filterType === "all" && nutrition) {
      return <NutritionGridComponent nutrition={nutrition} />;
    } else if (filterType === "province" && nutritionByProvince) {
      if (selectedProvince) {
        const provinceData = nutritionByProvince.find((p) => p.province === selectedProvince);
        if (provinceData?.averageNutrition) {
          return <NutritionGridComponent nutrition={provinceData.averageNutrition} />;
        } else {
          return <EmptyContainer>No nutrition data available for this province.</EmptyContainer>;
        }
      }
    } else if (filterType === "school" && nutritionBySchool) {
      if (selectedSchool) {
        const schoolData = nutritionBySchool.find((s) => s.schoolId === parseInt(selectedSchool));
        if (schoolData?.averageNutrition) {
          return <NutritionGridComponent nutrition={schoolData.averageNutrition} />;
        } else {
          return <EmptyContainer>No nutrition data available for this school.</EmptyContainer>;
        }
      }
    }

    return <EmptyContainer>No nutrition data available. Try applying a filter.</EmptyContainer>;
  };

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Average Nutrition Analysis</Title>
          <SubText>View average nutrition data by different filters</SubText>

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

          <DataContainer>
            <DataHeader>Results for {getFilterDescription()} - {dataDate}</DataHeader>
            {renderNutritionData()}
          </DataContainer>
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}

interface NutritionGridComponentProps {
  nutrition: Nutrition;
}

const NutritionGridComponent: React.FC<NutritionGridComponentProps> = ({ nutrition }) => {
  // Recommended daily values (for adults)
  const recommendedValues: { [key: string]: number } = {
    calories: 2000,
    protein: 50,
    fat: 70,
    carbohydrates: 300,
    fiber: 25,
    sodium: 2300,
    potassium: 3500,
    calcium: 1000,
    iron: 18,
    vitaminA: 900,
    vitaminC: 90,
    vitaminD: 20,
    magnesium: 400,
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80 && percentage <= 120) return "#45a246"; // Good
    if (percentage < 80) return "#ffa500"; // Low
    return "#ff6b6b"; // High
  };

  const nutrients = [
    { key: "calories", name: "Calories", value: nutrition.calories, unit: "kcal" },
    { key: "protein", name: "Protein", value: nutrition.protein, unit: "g" },
    { key: "fat", name: "Fat", value: nutrition.fat, unit: "g" },
    { key: "carbohydrates", name: "Carbohydrates", value: nutrition.carbohydrates, unit: "g" },
    { key: "fiber", name: "Fiber", value: nutrition.fiber, unit: "g" },
    { key: "sodium", name: "Sodium", value: nutrition.sodium, unit: "mg" },
    { key: "potassium", name: "Potassium", value: nutrition.potassium, unit: "mg" },
    { key: "calcium", name: "Calcium", value: nutrition.calcium, unit: "mg" },
    { key: "iron", name: "Iron", value: nutrition.iron, unit: "mg" },
    { key: "vitaminA", name: "Vitamin A", value: nutrition.vitaminA, unit: "mcg" },
    { key: "vitaminC", name: "Vitamin C", value: nutrition.vitaminC, unit: "mg" },
    { key: "vitaminD", name: "Vitamin D", value: nutrition.vitaminD, unit: "mcg" },
    { key: "magnesium", name: "Magnesium", value: nutrition.magnesium, unit: "mg" },
  ];

  return (
    <NutritionGrid>
      {nutrients.map((nutrient) => {
        const percentage = (nutrient.value / recommendedValues[nutrient.key]) * 100;
        const progressColor = getProgressColor(percentage);

        return (
          <NutritionCard key={nutrient.key}>
            <NutrientName>{nutrient.name}</NutrientName>
            <NutrientValue>
              {nutrient.value.toFixed(2)} <NutrientUnit>{nutrient.unit}</NutrientUnit>
            </NutrientValue>
            <ProgressBarContainer>
              <ProgressBarBackground>
                <ProgressBarFill percentage={percentage} color={progressColor} />
              </ProgressBarBackground>
              <ProgressLabel>
                <span>Recommended: {recommendedValues[nutrient.key]} {nutrient.unit}</span>
                <PercentageText percentage={percentage}>{percentage.toFixed(0)}%</PercentageText>
              </ProgressLabel>
            </ProgressBarContainer>
          </NutritionCard>
        );
      })}
    </NutritionGrid>
  );
};
