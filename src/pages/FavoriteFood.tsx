import { useState, useEffect } from "react";
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

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const FoodCard = styled.div`
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

const FoodRank = styled.div`
  font-size: 12px;
  font-weight: 700;
  background: #e5ffe6;
  color: #214626;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
`;

const FoodName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #214626;
  word-break: break-word;
`;

const FoodInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #555;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  strong {
    color: #214626;
  }
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
  margin-top: 30px;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  border: 2px solid ${(props) => (props.isActive ? "#214626" : "#45a246")};
  border-radius: 8px;
  background: ${(props) => (props.isActive ? "#214626" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#214626")};
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => (props.isActive ? "#214626" : "#e5ffe6")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin: 20px 0;
  text-align: center;
  font-weight: 600;
`;

const NutritionSection = styled.div`
  background: white;
  border-radius: 20px;
  border: 2px solid rgba(69, 162, 70, 0.5);
  padding: 25px;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const NutritionHeader = styled.div`
  background: #e5ffe6;
  border: 1px solid #8aa18d;
  border-radius: 20px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 700;
  color: black;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const NutritionCard = styled.div`
  background: #f9fff9;
  border: 1px solid #45a246;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NutritionLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  text-transform: capitalize;
`;

const NutritionValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #214626;
`;

const NutritionUnit = styled.span`
  font-size: 12px;
  color: #888;
  margin-left: 4px;
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

export default function FavoriteFood() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "province" | "school">("all");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchools] = useState<Array<{ id: number; name: string }>>([]);
  const [mostOrderedFood, setMostOrderedFood] = useState<MostOrderedFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataDate, setDataDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nutrition, setNutrition] = useState<Nutrition | null>(null);
  const [nutritionByProvince, setNutritionByProvince] = useState<ProvinceNutrition[] | null>(null);
  const [nutritionBySchool, setNutritionBySchool] = useState<SchoolNutrition[] | null>(null);
  const itemsPerPage = 10;

  // Get today's date in dd:mm:yyyy format
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}:${String(today.getMonth() + 1).padStart(2, "0")}:${today.getFullYear()}`;
    setDataDate(formattedDate);
  }, []);

  // Fetch schools when filter type is "school" (placeholder - would need backend endpoint)
  useEffect(() => {
    if (filterType === "school") {
      // TODO: Fetch schools from backend
      // For now, using placeholder data
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
      let endpoint = `${API_ENDPOINTS.FOOD_DEMAND.MOST_ORDERED}?order_date=${dataDate}&filter_type=${filterType}`;
      let nutritionEndpoint = `${API_ENDPOINTS.FOOD_DEMAND.AVERAGE_NUTRITION}?order_date=${dataDate}&filter_type=${filterType}`;

      if (filterType === "province" && selectedProvince) {
        endpoint += `&province=${selectedProvince}`;
        nutritionEndpoint += `&province=${selectedProvince}`;
      } else if (filterType === "school" && selectedSchool) {
        endpoint += `&school_id=${selectedSchool}`;
        nutritionEndpoint += `&school_id=${selectedSchool}`;
      }

      // Fetch both most ordered food and nutrition data in parallel
      const [foodData, nutritionData] = await Promise.all([
        apiRequest<MostOrderedFoodResponse>(endpoint, {
          method: "GET",
          token: token || undefined,
        }),
        apiRequest<AverageNutritionResponse>(nutritionEndpoint, {
          method: "GET",
          token: token || undefined,
        }),
      ]);

      setMostOrderedFood(foodData.mostOrderedFood.slice(0, 1000));
      setCurrentPage(1);

      // Set nutrition data based on filter type
      if (filterType === "all") {
        setNutrition(nutritionData.data);
        setNutritionByProvince(null);
        setNutritionBySchool(null);
      } else if (filterType === "province") {
        setNutrition(null);
        setNutritionByProvince(nutritionData.dataByProvince);
        setNutritionBySchool(null);
      } else if (filterType === "school") {
        setNutrition(null);
        setNutritionByProvince(null);
        setNutritionBySchool(nutritionData.dataBySchool);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setMostOrderedFood([]);
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

  const renderNutritionSection = () => {
    let nutritionData: Nutrition | null = null;
    let nutritionTitle = "";

    if (filterType === "all" && nutrition) {
      nutritionData = nutrition;
      nutritionTitle = "Average Nutrition (National)";
    } else if (filterType === "province" && nutritionByProvince && selectedProvince) {
      const provinceData = nutritionByProvince.find((p) => p.province === selectedProvince);
      nutritionData = provinceData?.averageNutrition || null;
      const provinceName = PROVINCES.find((p) => p.value === selectedProvince)?.label;
      nutritionTitle = `Average Nutrition (${provinceName})`;
    } else if (filterType === "school" && nutritionBySchool && selectedSchool) {
      const schoolData = nutritionBySchool.find((s) => s.schoolId === parseInt(selectedSchool));
      nutritionData = schoolData?.averageNutrition || null;
      const schoolName = schools.find((s) => s.id === parseInt(selectedSchool))?.name;
      nutritionTitle = `Average Nutrition (${schoolName})`;
    }

    if (!nutritionData) {
      return null;
    }

    const nutritionItems = [
      { label: "Calories", value: nutritionData.calories, unit: "kcal" },
      { label: "Protein", value: nutritionData.protein, unit: "g" },
      { label: "Fat", value: nutritionData.fat, unit: "g" },
      { label: "Carbohydrates", value: nutritionData.carbohydrates, unit: "g" },
      { label: "Fiber", value: nutritionData.fiber, unit: "g" },
      { label: "Sodium", value: nutritionData.sodium, unit: "mg" },
      { label: "Potassium", value: nutritionData.potassium, unit: "mg" },
      { label: "Calcium", value: nutritionData.calcium, unit: "mg" },
      { label: "Iron", value: nutritionData.iron, unit: "mg" },
      { label: "Vitamin A", value: nutritionData.vitaminA, unit: "mcg" },
      { label: "Vitamin C", value: nutritionData.vitaminC, unit: "mg" },
      { label: "Vitamin D", value: nutritionData.vitaminD, unit: "mcg" },
      { label: "Magnesium", value: nutritionData.magnesium, unit: "mg" },
    ];

    return (
      <NutritionSection>
        <NutritionHeader>{nutritionTitle}</NutritionHeader>
        <NutritionGrid>
          {nutritionItems.map((item) => (
            <NutritionCard key={item.label}>
              <NutritionLabel>{item.label}</NutritionLabel>
              <NutritionValue>
                {item.value.toFixed(2)}
                <NutritionUnit>{item.unit}</NutritionUnit>
              </NutritionValue>
            </NutritionCard>
          ))}
        </NutritionGrid>
      </NutritionSection>
    );
  };

  return (
    <PageWrapper>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          <Title>Favorite Food Analysis</Title>
          <SubText>Analyze the most ordered food by different filters</SubText>

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

            {isLoading ? (
              <LoadingContainer>Loading food data...</LoadingContainer>
            ) : mostOrderedFood.length > 0 ? (
              <>
                <PaginationInfo>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, mostOrderedFood.length)} of{" "}
                  {mostOrderedFood.length} items
                </PaginationInfo>

                <FoodGrid>
                  {mostOrderedFood
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((food) => (
                      <FoodCard key={food.foodId}>
                        <FoodRank>Rank #{food.rank}</FoodRank>
                        <FoodName>{food.foodName}</FoodName>
                        <FoodInfo>
                          <InfoRow>
                            <strong>Total Orders:</strong>
                            <span>{food.totalOrders}</span>
                          </InfoRow>
                          <InfoRow>
                            <strong>Price:</strong>
                            <span>Rp {food.foodPrice.toLocaleString("id-ID")}</span>
                          </InfoRow>
                          <InfoRow>
                            <strong>Catering ID:</strong>
                            <span>{food.cateringId}</span>
                          </InfoRow>
                        </FoodInfo>
                      </FoodCard>
                    ))}
                </FoodGrid>

                <PaginationContainer>
                  <PaginationButton
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </PaginationButton>

                  {Array.from(
                    { length: Math.ceil(mostOrderedFood.length / itemsPerPage) },
                    (_, i) => i + 1
                  )
                    .filter((page) => {
                      const totalPages = Math.ceil(mostOrderedFood.length / itemsPerPage);
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      );
                    })
                    .map((page, index, arr) => (
                      <div key={page}>
                        {index > 0 && arr[index - 1] !== page - 1 && (
                          <span style={{ padding: "0 4px", color: "#999" }}>...</span>
                        )}
                        <PaginationButton
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationButton>
                      </div>
                    ))}

                  <PaginationButton
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(mostOrderedFood.length / itemsPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(mostOrderedFood.length / itemsPerPage)
                    }
                  >
                    Next
                  </PaginationButton>
                  <PaginationButton
                    onClick={() =>
                      setCurrentPage(Math.ceil(mostOrderedFood.length / itemsPerPage))
                    }
                    disabled={
                      currentPage === Math.ceil(mostOrderedFood.length / itemsPerPage)
                    }
                  >
                    Last
                  </PaginationButton>
                </PaginationContainer>
              </>
            ) : (
              <EmptyContainer>
                {mostOrderedFood.length === 0 && !isLoading
                  ? "No food data available. Try applying a filter."
                  : ""}
              </EmptyContainer>
            )}
          </DataContainer>

          {renderNutritionSection()}
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
