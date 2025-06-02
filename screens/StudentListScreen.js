// screens/StudentListScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert, // <-- Import Alert cho hộp thoại xác nhận
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useStudents } from "../data/StudentContext";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

// Cập nhật StudentItem để hiển thị avatar
const StudentItem = ({ student, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    {student.avatarUrl ? (
      <Image source={{ uri: student.avatarUrl }} style={styles.itemAvatarImage} />
    ) : (
      <View style={styles.itemAvatarPlaceholder}>
        <MaterialIcons name="account-circle" size={40} color="#7f8c8d" />
      </View>
    )}
    <View style={styles.itemInfo}>
      <Text style={styles.title}>{student.ten}</Text>
      <Text style={styles.details}>Mã SV: {student.maSV} - Lớp: {student.lop}</Text>
    </View>
  </TouchableOpacity>
);

const StudentListScreen = ({ navigation }) => {
  const { students, clearAllStudents } = useStudents(); // <-- Lấy clearAllStudents từ Context
  const [searchText, setSearchText] = useState("");
  const [sortCriteria, setSortCriteria] = useState("ten");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.ten.toLowerCase().includes(searchText.toLowerCase()) ||
        student.maSV.toLowerCase().includes(searchText.toLowerCase()) ||
        student.lop.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [students, searchText]);

  const sortedStudents = useMemo(() => {
    const sortableStudents = [...filteredStudents];

    sortableStudents.sort((a, b) => {
      let valA, valB;

      if (sortCriteria === "diemTB") {
        valA = a.diemTB;
        valB = b.diemTB;
      } else if (sortCriteria === "maSV") {
        valA = a.maSV;
        valB = b.maSV;
      } else {
        valA = a.ten;
        valB = b.ten;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sortableStudents;
  }, [filteredStudents, sortCriteria, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Hàm xử lý khi nhấn nút xóa tất cả
  const handleClearAll = () => {
    Alert.alert(
      "Xác nhận xóa tất cả",
      "Bạn có chắc chắn muốn xóa tất cả dữ liệu sinh viên và khôi phục về dữ liệu mẫu ban đầu không? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: clearAllStudents, style: "destructive" }, // Gọi hàm clearAllStudents
      ]
    );
  };

  const renderItem = ({ item }) => (
    <StudentItem
      student={item}
      onPress={() => navigation.navigate("StudentDetail", { student: item })}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh Sách Sinh Viên</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm sinh viên (Tên, Mã SV, Lớp)..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sắp xếp theo:</Text>
        <Picker
          selectedValue={sortCriteria}
          style={styles.picker}
          onValueChange={(itemValue) => setSortCriteria(itemValue)}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Tên" value="ten" />
          <Picker.Item label="Mã Sinh Viên" value="maSV" />
          <Picker.Item label="Điểm Trung Bình" value="diemTB" />
        </Picker>
        <TouchableOpacity
          onPress={toggleSortOrder}
          style={styles.sortOrderButton}
        >
          <AntDesign
            name={sortOrder === "asc" ? "arrowup" : "arrowdown"}
            size={24}
            color="#007bff"
          />
        </TouchableOpacity>
      </View>

      {sortedStudents.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            {searchText || sortCriteria !== "ten" || sortOrder !== "asc"
              ? "Không tìm thấy sinh viên nào khớp với từ khóa."
              : "Chưa có sinh viên nào. Hãy thêm mới!"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedStudents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Nút thêm sinh viên */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddStudent")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Nút xóa tất cả dữ liệu (cho phát triển) */}
      <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
        <MaterialIcons name="delete-sweep" size={24} color="white" />
        <Text style={styles.clearAllButtonText}>Xóa tất cả</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1", // Nền tổng thể nhạt hơn
    paddingTop: 0, // Đã có padding của header
  },
  listContentContainer: {
    // Style mới cho FlatList
    paddingBottom: 80, // Để nút thêm không che mất item cuối
    paddingTop: 10, // Một chút khoảng trống trên đầu danh sách
  },
  header: {
    fontSize: 28, // Kích thước lớn hơn
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20, // Giảm marginVertical thành marginBottom
    color: "#333333", // Màu văn bản đậm hơn
  },
  searchBar: {
    backgroundColor: "#ffffff", // Nền trắng
    borderWidth: 1,
    borderColor: "#bdc3c7", // Màu border mềm mại hơn
    borderRadius: 8,
    padding: 12, // Tăng padding
    marginHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    color: "#333333", // Màu chữ nhập vào
    elevation: 2, // Tăng shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 15,
    backgroundColor: "#ffffff", // Nền trắng
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bdc3c7", // Màu border mềm mại hơn
    paddingVertical: 5,
    elevation: 2, // Tăng shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sortLabel: {
    fontSize: 15,
    color: "#7f8c8d", // Màu văn bản chi tiết
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    height: 40,
    color: "#333333", // Màu chữ picker
  },
  pickerItem: {
    height: 40,
  },
  sortOrderButton: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 18,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAvatarPlaceholder: { // Style mới cho placeholder icon
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center', // Căn giữa nội dung (icon)
    alignItems: 'center',    // Căn giữa nội dung (icon)
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  itemAvatarImage: { // Style riêng cho Image component
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  itemInfo: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#333333",
  },
  details: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#2980b9", // Màu xanh đậm hơn
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 6, // Tăng shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  clearAllButton: {
    backgroundColor: "#e74c3c", // Màu đỏ nổi bật hơn
    paddingVertical: 10, // Điều chỉnh padding
    paddingHorizontal: 15,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clearAllButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8, // Tăng khoảng cách
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    color: "#7f8c8d", // Màu văn bản chi tiết
    paddingHorizontal: 20,
  },
});

export default StudentListScreen;
