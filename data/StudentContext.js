// data/StudentContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"; // <-- Import ActivityIndicator và StyleSheet
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

// 1. Tạo Context
const StudentContext = createContext();

// Khóa AsyncStorage để lưu trữ dữ liệu sinh viên
const ASYNC_STORAGE_KEY = "@students_data";

// Dữ liệu mẫu ban đầu
const initialStudents = [
  {
    id: "1",
    maSV: "SV001",
    ten: "Nguyễn Văn A",
    lop: "KTPM1",
    diemTB: 8.5,
    avatarUrl: null,
  },
  {
    id: "2",
    maSV: "SV002",
    ten: "Trần Thị B",
    lop: "HTTT2",
    diemTB: 7.8,
    avatarUrl: null,
  },
  {
    id: "3",
    maSV: "SV003",
    ten: "Lê Văn C",
    lop: "KTPM1",
    diemTB: 9.1,
    avatarUrl: null,
  },
  {
    id: "4",
    maSV: "SV004",
    ten: "Phạm Thị D",
    lop: "KTPM2",
    diemTB: 7.2,
    avatarUrl: null,
  },
  {
    id: "5",
    maSV: "SV005",
    ten: "Hoàng Văn E",
    lop: "HTTT1",
    diemTB: 8.0,
    avatarUrl: null,
  },
];

// 2. Tạo Provider Component
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const storedStudents = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (storedStudents !== null) {
          setStudents(JSON.parse(storedStudents));
        } else {
          setStudents(initialStudents);
          await AsyncStorage.setItem(
            ASYNC_STORAGE_KEY,
            JSON.stringify(initialStudents)
          );
        }
      } catch (error) {
        console.error("Failed to load students from AsyncStorage", error);
        showMessage({
          message: "Lỗi",
          description: "Không thể tải dữ liệu sinh viên.",
          type: "danger",
        });
        setStudents(initialStudents);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveStudents = async () => {
        try {
          await AsyncStorage.setItem(
            ASYNC_STORAGE_KEY,
            JSON.stringify(students)
          );
        } catch (error) {
          console.error("Failed to save students to AsyncStorage", error);
          showMessage({
            message: "Lỗi lưu dữ liệu",
            description: "Không thể lưu thay đổi vào bộ nhớ.",
            type: "danger",
          });
        }
      };
      saveStudents();
    }
  }, [students, isLoading]);

  const addStudent = (newStudent) => {
    const isMaSVExisted = students.some((s) => s.maSV === newStudent.maSV);
    if (isMaSVExisted) {
      showMessage({
        message: "Lỗi",
        description: "Mã sinh viên đã tồn tại. Vui lòng nhập mã khác.",
        type: "warning",
      });
      return false;
    }

    setStudents((currentStudents) => [
      ...currentStudents,
      { ...newStudent, id: Date.now().toString() },
    ]);
    showMessage({
      message: "Thành công",
      description: "Sinh viên đã được thêm.",
      type: "success",
    });
    return true;
  };

  const updateStudent = (updatedStudent) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    showMessage({
      message: "Thành công",
      description: "Thông tin sinh viên đã được cập nhật.",
      type: "success",
    });
  };

  const deleteStudent = (studentId) => {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId)
    );
    showMessage({
      message: "Thành công",
      description: "Sinh viên đã được xóa.",
      type: "success",
    });
  };

  // Đảm bảo hàm clearAllStudents được định nghĩa ở đây hoặc tương tự
  const clearAllStudents = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_STORAGE_KEY);
      setStudents(initialStudents);
      showMessage({
        message: "Thành công",
        description:
          "Đã xóa tất cả dữ liệu sinh viên và khôi phục về trạng thái ban đầu.",
        type: "info",
      });
    } catch (error) {
      console.error("Failed to clear all students from AsyncStorage", error);
      showMessage({
        message: "Lỗi",
        description: "Không thể xóa dữ liệu sinh viên.",
        type: "danger",
      });
    }
  };

  // Màn hình tải
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        clearAllStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Thêm StyleSheet cho màn hình loading
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1", // Nền màu xám nhạt như các màn hình khác
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d", // Màu văn bản xám
  },
});

export const useStudents = () => {
  return useContext(StudentContext);
};
