import BottomNav from "@/components/bottomNavigation";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem, ListRenderItemInfo, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getProvinces, getSchools, getStudentsBySchool } from "../lib/api";

// data types
type Province = {
  province: string;
  locationId: number;
};

type School = {
  schoolId: number;
  schoolName: string;
  schoolLocationId?: number;
};

type SchoolDisplay = {
  id: number;
  name: string;
  city?: string | undefined;
  totalOrders: number;
  status: "Complete" | "Incomplete";
};

type StudentApi = {
  userId: number;
  schoolId: number;
  userFullName: string;
  // data sementara yang dibutuhkan
};

type StudentDisplay = {
  id: number;
  name: string;
  schoolId?: number;
  food?: string;
  status: "Complete" | "Incomplete";
};

const FilterContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.filterContainer}>{children}</View>
);

const PickerContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.pickerContainer}>{children}</View>
);


export default function OrderList() {
  const params = useLocalSearchParams();

  // viewLevel param handling
  const initialLevel = (params.viewLevel as
    | "school"
    | "class"
    | "student"
    | undefined) ?? "school";

  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [viewLevel, setViewLevel] = useState<
    "school" | "class" | "student"
  >(initialLevel);

  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<string[]>(["All"]);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<StudentDisplay[]>([]);

  // displayed list after filtered
  const [filteredSchools, setFilteredSchools] = useState<SchoolDisplay[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentDisplay[]>(
    []
  );

  useEffect(() => {
    async function loadData() {
      try {
        const provData = await getProvinces();
        const schoolDataRaw = await getSchools();

        const schoolData = schoolDataRaw as School[];

        setProvinces(provData);
        setCities(["All", ...provData.map((p) => p.province)]);

        setSchools(
          schoolData.map((s) => ({
            schoolId: s.schoolId,
            schoolName: s.schoolName,
            schoolLocationId: s.schoolLocationId,
          }))
        );
      } catch (err) {
        console.error("Load Error:", err);
      }
    }
    loadData();
  }, []);

  async function loadStudents(schoolId: number) {
    try {
      const data: StudentApi[] = await getStudentsBySchool(schoolId);

      const mapped: StudentDisplay[] = data.map((st) => ({
        id: st.userId,
        name: st.userFullName,
        schoolId: st.schoolId,
        food: "-", // placeholder (backend belum kirim food, murid belum order)
        status: "Incomplete",
      }));

      setStudents(mapped);
      setFilteredStudents(mapped);
    } catch (err) {
      console.error("Student load error:", err);
      setStudents([]);
      setFilteredStudents([]);
    }
  }

/* total order harusnya keitung dari berapa murid dan pesanan makanan yang ter-assign,
    tapi untuk sekarang dibuatnya berdasarkan jumlah murid di sekolah yang dipilih */
  const calculateSchoolOrders = (schoolId: number) => {
    return students.filter((s) => s.schoolId === schoolId).length;
  };

  const applyFilters = () => {
    const schoolDisplays: SchoolDisplay[] = schools
      .map((s) => {
        const matchedProvince = provinces.find(
          (p) => p.locationId === s.schoolLocationId
        );
        return {
          id: s.schoolId,
          name: s.schoolName,
          city: matchedProvince?.province,
          totalOrders: calculateSchoolOrders(s.schoolId),
          status: "Incomplete" as "Incomplete",
        };
      })
      .filter((sd) => {
        const matchCity = selectedCity === "All" || sd.city === selectedCity;
        const matchSchool =
          selectedSchoolId === null || sd.id === selectedSchoolId;
        const matchStatus =
          selectedStatus === "All" || sd.status === selectedStatus;
        return matchCity && matchSchool && matchStatus;
      });

    setFilteredSchools(schoolDisplays);

    const fStudents = students.filter(
      (st) => selectedStatus === "All" || st.status === selectedStatus
    );
    setFilteredStudents(fStudents);

    if (selectedSchoolId !== null) {
      const has = students.some((st) => st.schoolId === selectedSchoolId);
      if (!has) {
        loadStudents(selectedSchoolId);
      }
      setViewLevel("student");
    } else {
      setViewLevel("school");
    }
  };


  const handleBack = () => {
    if (viewLevel === "student") {
      setViewLevel("school");
      setSelectedSchoolId(null);
    } else {
      setViewLevel("school");
      setSelectedSchoolId(null);
    }
  };

  const renderSchoolItem: ListRenderItem<SchoolDisplay> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          setSelectedSchoolId(item.id);
          loadStudents(item.id);
          setViewLevel("student");
        }}
      >
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.totalOrders}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Complete" ? styles.complete : styles.incomplete,
          ]}
        >
          {item.status}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStudentItem: ListRenderItem<StudentDisplay> = ({ item }) => {
  const hasOrder = item.food && item.food !== "-";

  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.food ?? "-"}</Text>

      {/* STATUS COLUMN */}
      {hasOrder ? (
        <TouchableOpacity
          onPress={() => {
            // Navigate to plateScan.tsx
            router.push({
              pathname: "/plateScan",
              params: { studentId: item.id, food: item.food },
            });
          }}
          style={{ flex: 1 }}
        >
          <Text
            style={[
              styles.status,
              { color: "#2F5D2B", textDecorationLine: "underline" }
            ]}
          >
            Assign Delivery
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={[styles.status]}>-</Text>
      )}
    </View>
  );
};


  const listData = viewLevel === "school" ? filteredSchools : filteredStudents;
  const listRender =
    viewLevel === "school" ? renderSchoolItem : renderStudentItem;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        {viewLevel !== "school" && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft color="#2F5D2B" size={22} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>MBG Order List</Text>
      </View>

      {/* FILTER UI */}
      <FilterContainer>
        <Text style={styles.filterTitle}>FILTER BY:</Text>

        {/* City */}
        <PickerContainer>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(v) => {
              setSelectedCity(String(v));
              // reset selected school when city changes
              setSelectedSchoolId(null);
            }}
          >
            {cities.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </PickerContainer>

        {/* School (value is schoolId or null) */}
        <PickerContainer>
          <Picker
            selectedValue={selectedSchoolId}
            onValueChange={(v) =>
              setSelectedSchoolId(v === null ? null : Number(v))
            }
          >
            <Picker.Item label="All Schools" value={null} />
            {schools
              .filter((s) => selectedCity === "All" || provinces.find(p => p.locationId === s.schoolLocationId)?.province === selectedCity)
              .map((s) => (
                <Picker.Item
                  key={s.schoolId}
                  label={s.schoolName}
                  value={s.schoolId}
                />
              ))}
          </Picker>
        </PickerContainer>

        {/* Status */}
        <PickerContainer>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(v) => setSelectedStatus(String(v))}
          >
            <Picker.Item label="All Status" value="All" />
            <Picker.Item label="Complete" value="Complete" />
            <Picker.Item label="Incomplete" value="Incomplete" />
          </Picker>
        </PickerContainer>

        <TouchableOpacity style={styles.loadButton} onPress={applyFilters}>
          <Text style={styles.loadLabel}>Load</Text>
        </TouchableOpacity>
      </FilterContainer>

      {/* TABLE HEADER */}
      <View style={styles.tableHeader}>
        {viewLevel === "school" && (
          <>
            <Text style={styles.headerCell}>School Name</Text>
            <Text style={styles.headerCell}>Total Orders</Text>
            <Text style={styles.headerCell}>Status</Text>
          </>
        )}
        {viewLevel === "student" && (
          <>
            <Text style={styles.headerCell}>Student Name</Text>
            <Text style={styles.headerCell}>Food</Text>
            <Text style={styles.headerCell}>Status</Text>
          </>
        )}
      </View>

      {/* TABLE CONTENT */}
      <FlatList<SchoolDisplay | StudentDisplay>
        data={listData}
        keyExtractor={(item) => String(item.id)}
        renderItem={(info: ListRenderItemInfo<SchoolDisplay | StudentDisplay>) => {
          if (viewLevel === "school") {
            return renderSchoolItem(info as ListRenderItemInfo<SchoolDisplay>);
          } else {
            return renderStudentItem(info as ListRenderItemInfo<StudentDisplay>);
          }
        }}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ textAlign: "center", color: "#777" }}>
              No data to display.
            </Text>
          </View>
        }
      />

      <BottomNav />
    </View>
  );
}

// styled-components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff8f0ff",
    padding: 16,
  },
  filterContainer: {
    backgroundColor: "#C1E5C066",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: "#C1E5C0",
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 40,
    fontWeight: "600",
    fontFamily: "Fredoka-Bold",
    color: "#2F5D2B",
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: "Fredoka-Regular",
    color: "#2F5D2B",
  },
  loadButton: {
    backgroundColor: "#2F5D2B",
    paddingVertical: 10,
    borderRadius: 10,
  },
  loadLabel: {
    textAlign: "center",
    fontFamily: "Fredoka-Bold",
    fontSize: 16,
    color: "white",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#C1E5C066",
    borderRadius: 10,
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#2F5D2B",
    textAlign: "center",
    fontFamily: "Fredoka-Medium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    marginVertical: 3,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#2F5D2B",
    fontFamily: "Fredoka-Regular",
  },
  status: {
    flex: 1,
    textAlign: "center",
    borderRadius: 20,
    paddingVertical: 4,
    overflow: "hidden",
    fontFamily: "Fredoka-Regular",
  },
  complete: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  incomplete: {
    backgroundColor: "#FFF9C4",
    color: "#F57F17",
  },
});