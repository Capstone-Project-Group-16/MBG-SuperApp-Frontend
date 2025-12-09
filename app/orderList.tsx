import BottomNav from "@/components/bottomNavigation";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


const FilterContainer = ({ children }: any) => (
  <View
    style={{
      backgroundColor: "#C1E5C066",
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
      gap: 10,
    }}
  >
    {children}
  </View>
);

const PickerContainer = ({ children }: any) => (
  <View
    style={{
      backgroundColor: "white",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#A5D6A7",
      overflow: "hidden",
    }}
  >
    {children}
  </View>
);

// styled components
export default function OrderList() {
  const params = useLocalSearchParams();
  const initialLevel = params.viewLevel as
    | "school"
    | "class"
    | "student"
    | undefined;
  const initialSchoolName = params.schoolName as string | undefined;

  const [selectedCity, setSelectedCity] = useState("All");
  const [viewLevel, setViewLevel] = useState<
    "school" | "class" | "student"
  >(initialLevel ?? "school");

  const [selectedSchool, setSelectedSchool] = useState<any>(
    initialSchoolName ? { name: initialSchoolName } : null
  );
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);

  // Dummy data
  const schools = [
    {
      id: 1,
      name: "SMAN 1 DEPOK",
      city: "Depok",
      totalOrders: 320,
      status: "Incomplete",
    },
    {
      id: 2,
      name: "SMAN 2 BEKASI",
      city: "Bekasi",
      totalOrders: 275,
      status: "Complete",
    },
    {
      id: 3,
      name: "SMAN 5 JAKARTA",
      city: "Jakarta",
      totalOrders: 410,
      status: "Incomplete",
    },
  ];

  const classes = [
    { id: 1, name: "X IPA 1", totalOrders: 36, status: "Incomplete" },
    { id: 2, name: "X IPA 2", totalOrders: 35, status: "Complete" },
    { id: 3, name: "X IPS 1", totalOrders: 32, status: "Incomplete" },
  ];

  const students = [
    { id: 1, name: "A", food: "Nasi Ayam Teriyaki", status: "Incomplete" },
    { id: 2, name: "B", food: "Nasi Ikan Fillet", status: "Complete" },
    { id: 3, name: "C", food: "Nasi Ayam Rica", status: "Incomplete" },
  ];


  const handleBack = () => {
    if (viewLevel === "student") {
      setViewLevel("class");
      setSelectedClass(null);
    } else if (viewLevel === "class") {
      setViewLevel("school");
      setSelectedSchool(null);
    }
  };

  const applyFilters = () => {
    const fSchools = schools.filter((item) => {
      const matchCity = selectedCity === "All" || item.city === selectedCity;

      const matchSchool =
        selectedSchool === "All" ||
        selectedSchool?.name === item.name ||
        selectedSchool === null;

      const matchStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchCity && matchSchool && matchStatus;
    });

    const fClasses = classes.filter((item) => {
      const matchStatus =
        selectedStatus === "All" || item.status === selectedStatus;
      return matchStatus;
    });

    const fStudents = students.filter((item) => {
      const matchStatus =
        selectedStatus === "All" || item.status === selectedStatus;
      return matchStatus;
    });

    setFilteredSchools(fSchools);
    setFilteredClasses(fClasses);
    setFilteredStudents(fStudents);
  };

  const renderItem = ({ item }: { item: any }) => {
    if (viewLevel === "school") {
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            setSelectedSchool(item);
            setViewLevel("class");
          }}
        >
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.totalOrders}</Text>
          <Text
            style={[
              styles.status,
              item.status === "Complete"
                ? styles.complete
                : styles.incomplete,
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      );
    }

    if (viewLevel === "class") {
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            setSelectedClass(item);
            setViewLevel("student");
          }}
        >
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.totalOrders}</Text>
          <Text
            style={[
              styles.status,
              item.status === "Complete"
                ? styles.complete
                : styles.incomplete,
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.food}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Delivered"
              ? styles.complete
              : styles.incomplete,
          ]}
        >
          {item.status}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        {viewLevel !== "school" && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft color="#2F5D2B" size={22} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>
          {viewLevel === "school" && "MBG Order List"}
          {viewLevel === "class" && selectedSchool?.name}
          {viewLevel === "student" && selectedClass?.name}
        </Text>
      </View>

      <FilterContainer>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Fredoka-Regular",
            color: "#2F5D2B",
            marginBottom: 4,
          }}
        >
          FILTER BY:
        </Text>

        <PickerContainer>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(v) => {
              setSelectedCity(v);
              setSelectedSchool("All");
            }}
          >
            <Picker.Item label="All Cities" value="All" />
            <Picker.Item label="Depok" value="Depok" />
            <Picker.Item label="Bekasi" value="Bekasi" />
            <Picker.Item label="Jakarta" value="Jakarta" />
          </Picker>
        </PickerContainer>

        <PickerContainer>
          <Picker
            selectedValue={selectedSchool}
            onValueChange={(v) => setSelectedSchool(v)}
          >
            <Picker.Item label="All Schools" value="All" />
            {schools
              .filter(
                (s) => selectedCity === "All" || s.city === selectedCity
              )
              .map((s) => (
                <Picker.Item key={s.id} label={s.name} value={s} />
              ))}
          </Picker>
        </PickerContainer>

        <PickerContainer>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(v) => setSelectedStatus(v)}
          >
            <Picker.Item label="All Status" value="All" />
            <Picker.Item label="Complete" value="Complete" />
            <Picker.Item label="Incomplete" value="Incomplete" />
          </Picker>
        </PickerContainer>

        {/* LOAD BUTTON */}
        <TouchableOpacity
          style={{
            backgroundColor: "#2F5D2B",
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={applyFilters}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Fredoka-Bold",
              fontSize: 16,
              color: "white",
            }}
          >
            Load
          </Text>
        </TouchableOpacity>
      </FilterContainer>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        {viewLevel === "school" && (
          <>
            <Text style={styles.headerCell}>School Name</Text>
            <Text style={styles.headerCell}>Total Orders</Text>
            <Text style={styles.headerCell}>Status</Text>
          </>
        )}
        {viewLevel === "class" && (
          <>
            <Text style={styles.headerCell}>Class Name</Text>
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
      <FlatList
        data={
          viewLevel === "school"
            ? filteredSchools
            : viewLevel === "class"
            ? filteredClasses
            : filteredStudents
        }
        keyExtractor={(it) => it.id.toString()}
        renderItem={renderItem}
      />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff8f0ff",
    padding: 16,
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
