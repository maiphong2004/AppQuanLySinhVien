// screens/AddStudentScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView, // <-- Import KeyboardAvoidingView
  Platform, // <-- Import Platform để xử lý khác nhau cho iOS/Android
} from "react-native";
import { useStudents } from "../data/StudentContext";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { showMessage } from "react-native-flash-message";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const AddStudentScreen = ({ navigation, route }) => {
  const { addStudent, updateStudent, students } = useStudents();
  const studentToEdit = route.params?.student || null;

  const [maSV, setMaSV] = useState(studentToEdit ? studentToEdit.maSV : "");
  const [ten, setTen] = useState(studentToEdit ? studentToEdit.ten : "");
  const [lop, setLop] = useState(studentToEdit ? studentToEdit.lop : "");
  const [diemTB, setDiemTB] = useState(
    studentToEdit ? String(studentToEdit.diemTB) : ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    studentToEdit ? studentToEdit.avatarUrl : null
  );

  const [errors, setErrors] = useState({});

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showMessage({
        message: "Quyền truy cập bị từ chối",
        description: "Cần quyền truy cập thư viện ảnh để chọn avatar.",
        type: "warning",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!maSV.trim()) {
      newErrors.maSV = "Mã Sinh Viên không được để trống.";
      isValid = false;
    } else if (!studentToEdit || studentToEdit.maSV !== maSV.trim()) {
      const isMaSVExisted = students.some(
        (s) => s.maSV === maSV.trim() && s.id !== studentToEdit?.id
      );
      if (isMaSVExisted) {
        newErrors.maSV = "Mã Sinh Viên đã tồn tại.";
        isValid = false;
      }
    }

    if (!ten.trim()) {
      newErrors.ten = "Tên Sinh Viên không được để trống.";
      isValid = false;
    }

    if (!lop.trim()) {
      newErrors.lop = "Lớp không được để trống.";
      isValid = false;
    }

    if (!diemTB.trim()) {
      newErrors.diemTB = "Điểm Trung Bình không được để trống.";
      isValid = false;
    } else {
      const parsedDiemTB = parseFloat(diemTB);
      if (isNaN(parsedDiemTB) || parsedDiemTB < 0 || parsedDiemTB > 10) {
        newErrors.diemTB = "Điểm phải là số từ 0 đến 10.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validate()) {
      showMessage({
        message: "Lỗi nhập liệu",
        description: "Vui lòng kiểm tra lại thông tin.",
        type: "danger",
      });
      return;
    }

    const studentData = {
      id: studentToEdit ? studentToEdit.id : "",
      maSV: maSV.trim(),
      ten: ten.trim(),
      lop: lop.trim(),
      diemTB: parseFloat(diemTB),
      avatarUrl: avatarUrl,
    };

    if (studentToEdit) {
      updateStudent(studentData);
    } else {
      addStudent(studentData);
    }
    navigation.goBack();
  };

  return (
    // Bọc toàn bộ nội dung bằng KeyboardAvoidingView
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer} // Đảm bảo KeyboardAvoidingView chiếm toàn bộ không gian
      behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' cho iOS, 'height' cho Android
      // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -StatusBar.currentHeight} // Điều chỉnh offset nếu cần
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>
          {studentToEdit ? "Chỉnh Sửa Sinh Viên" : "Thêm Sinh Viên Mới"}
        </Text>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <MaterialIcons name="camera-alt" size={50} color="#ccc" />
          )}
          <Text style={styles.selectAvatarText}>Chọn ảnh đại diện</Text>
        </TouchableOpacity>
        <InputField
          label="Mã Sinh Viên:"
          value={maSV}
          onChangeText={(text) => {
            setMaSV(text);
            setErrors((prevErrors) => ({ ...prevErrors, maSV: null }));
          }}
          placeholder="VD: SV004"
          editable={!studentToEdit}
        />
        {errors.maSV && <Text style={styles.errorText}>{errors.maSV}</Text>}
        <InputField
          label="Tên Sinh Viên:"
          value={ten}
          onChangeText={(text) => {
            setTen(text);
            setErrors((prevErrors) => ({ ...prevErrors, ten: null }));
          }}
          placeholder="VD: Phạm Thị D"
        />
        {errors.ten && <Text style={styles.errorText}>{errors.ten}</Text>}
        <InputField
          label="Lớp:"
          value={lop}
          onChangeText={(text) => {
            setLop(text);
            setErrors((prevErrors) => ({ ...prevErrors, lop: null }));
          }}
          placeholder="VD: KTPM2"
        />
        {errors.lop && <Text style={styles.errorText}>{errors.lop}</Text>}
        <InputField
          label="Điểm Trung Bình:"
          value={diemTB}
          onChangeText={(text) => {
            setDiemTB(text);
            setErrors((prevErrors) => ({ ...prevErrors, diemTB: null }));
          }}
          placeholder="VD: 8.9"
          keyboardType="numeric"
        />
        {errors.diemTB && <Text style={styles.errorText}>{errors.diemTB}</Text>}
        <CustomButton
          title={studentToEdit ? "Cập Nhật" : "Lưu Sinh Viên"}
          onPress={handleSave}
          color="#007bff"
          iconName={studentToEdit ? "save" : "add"}
          iconFamily="MaterialIcons"
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    // Style cho KeyboardAvoidingView
    flex: 1,
    backgroundColor: "#f5f5f5", // Đảm bảo nền khớp với ScrollView
  },
  scrollViewContent: {
    // Style cho contentContainerStyle của ScrollView
    flexGrow: 1, // Quan trọng để ScrollView có thể cuộn
    padding: 20,
    justifyContent: "flex-start", // Căn chỉnh nội dung lên đầu
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
    marginTop: -10,
  },
  saveButton: {
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 75,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  selectAvatarText: {
    position: "absolute",
    bottom: 10,
    fontSize: 12,
    color: "#555",
  },
});

export default AddStudentScreen;
