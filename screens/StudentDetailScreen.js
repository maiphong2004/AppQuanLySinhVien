// screens/StudentDetailScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useStudents } from "../data/StudentContext";
import CustomButton from "../components/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const { deleteStudent } = useStudents();

  const handleDelete = () => {
    Alert.alert(
      "Xóa Sinh Viên",
      `Bạn có chắc chắn muốn xóa sinh viên ${student.ten} (${student.maSV}) không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => {
            deleteStudent(student.id);
            navigation.goBack();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Không cần header riêng ở đây vì Navigator đã có title */}
      {/* <Text style={styles.header}>Chi Tiết Sinh Viên</Text> */}

      {/* Khu vực Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.detailAvatarContainer}>
          {student.avatarUrl ? (
            <Image
              source={{ uri: student.avatarUrl }}
              style={styles.detailAvatar}
            />
          ) : (
            <MaterialIcons name="account-circle" size={100} color="#bdc3c7" />
          )}
        </View>
        <Text style={styles.studentName}>{student.ten}</Text>
        <Text style={styles.studentId}>{student.maSV}</Text>
      </View>

      {/* Phần thông tin chi tiết */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lớp:</Text>
          <Text style={styles.infoValue}>{student.lop}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Điểm Trung Bình:</Text>
          <Text style={styles.infoValue}>{student.diemTB}</Text>
        </View>
        {/* Thêm các trường thông tin khác nếu có */}
      </View>

      {/* Nút hành động */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Sửa"
          onPress={() =>
            navigation.navigate("AddStudent", { student: student })
          }
          color="#3498db" // Màu xanh dương
          iconName="edit"
          iconFamily="MaterialIcons"
        />

        <CustomButton
          title="Xóa Sinh Viên"
          onPress={handleDelete}
          color="#e74c3c" // Màu đỏ
          iconName="delete"
          iconFamily="MaterialIcons"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1", // Nền tổng thể
    padding: 20, // Padding chung cho màn hình
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30, // Tăng khoảng cách với card thông tin
    paddingTop: 10,
    backgroundColor: "#ffffff", // Nền trắng cho phần avatar
    borderRadius: 10,
    paddingBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailAvatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3, // Viền dày hơn
    borderColor: "#3498db", // Màu viền avatar
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  detailAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60, // Đảm bảo ảnh cũng tròn
  },
  studentName: {
    fontSize: 26, // Lớn hơn
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  studentId: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30, // Khoảng cách với nút
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Đẩy label và value ra hai bên
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1, // Đường phân cách
    borderBottomColor: "#ecf0f1", // Màu đường phân cách
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600", // Semi-bold
    color: "#333333",
  },
  infoValue: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "auto", // Đẩy các nút xuống cuối màn hình
  },
});

export default StudentDetailScreen;
