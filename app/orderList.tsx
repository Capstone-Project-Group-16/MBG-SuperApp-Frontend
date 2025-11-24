import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OrderList() {
  const [viewLevel, setViewLevel] = useState<"school" | "class" | "student">("school");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Dummy data
  const schools = [
    { id: 1, name: "SMAN 1 DEPOK", totalOrders: 320, status: "Incomplete" },
    { id: 2, name: "SMAN 2 BEKASI", totalOrders: 275, status: "Complete" },
    { id: 3, name: "SMPN 5 JAKARTA", totalOrders: 410, status: "Incomplete" },
  ];

  const classes = [
    { id: 1, name: "X IPA 1", totalOrders: 36, status: "Incomplete" },
    { id: 2, name: "X IPA 2", totalOrders: 35, status: "Complete" },
    { id: 3, name: "X IPS 1", totalOrders: 32, status: "Incomplete" },
  ];

  const students = [
    { id: 1, name: "A", food: "Nasi Ayam Teriyaki", status: "Delivered" },
    { id: 2, name: "B", food: "Nasi Ikan Fillet", status: "Pending" },
    { id: 3, name: "C", food: "Nasi Ayam Rica", status: "Delivered" },
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
              item.status === "Complete" ? styles.complete : styles.incomplete,
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      );
    } else if (viewLevel === "class") {
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
              item.status === "Complete" ? styles.complete : styles.incomplete,
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.food}</Text>
          <Text
            style={[
              styles.status,
              item.status === "Delivered" ? styles.complete : styles.incomplete,
            ]}
          >
            {item.status}
          </Text>
        </View>
      );
    }
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
          {viewLevel === "school" && "School Order List"}
          {viewLevel === "class" && selectedSchool?.name}
          {viewLevel === "student" && selectedClass?.name}
        </Text>
      </View>

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

      {/* Table Content */}
      <FlatList
        data={
          viewLevel === "school"
            ? schools
            : viewLevel === "class"
            ? classes
            : students
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF7",
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
    fontSize: 20,
    fontWeight: "600",
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
  },
  status: {
    flex: 1,
    textAlign: "center",
    borderRadius: 20,
    paddingVertical: 4,
    overflow: "hidden",
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