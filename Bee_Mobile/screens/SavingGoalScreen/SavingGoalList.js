import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import { ProgressBar } from "react-native-paper";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import { fetchCategoryImage } from "../../services/Category";
import {
  fetchAllSavingGoalsByUser,
  deleteSavingGoal,
} from "../../services/SavingsGoalService/index";

export default function SavingGoalScreen({ navigation }) {
  const [savingGoals, setSavingGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavingGoals = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        const goals = await fetchAllSavingGoalsByUser(userId);

        const goalsWithImages = await Promise.all(
          goals.map(async (goal) => {
            const imageUrl = await fetchCategoryImage(goal.categoryId);
            return { ...goal, categoryImage: imageUrl };
          })
        );

        setSavingGoals(goalsWithImages);
      }
    } catch (error) {
      console.error("Error loading saving goals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSavingGoals();
    });

    return unsubscribe;
  }, [navigation]);

  const confirmDeleteGoal = (goalId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa mục tiêu tiết kiệm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => handleDeleteGoal(goalId),
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteSavingGoal(goalId);
      setSavingGoals(savingGoals.filter((goal) => goal._id !== goalId));
    } catch (error) {
      console.error("Error deleting saving goal:", error);
    }
  };

  const navigateToDetail = (goal) => {
    navigation.navigate("SavingGoalDetail", { goal });
  };

  const navigateToEdit = (goal) => {
    navigation.navigate("SavingGoalEdit", { goal });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`items-center p-4`}>
      <View style={tw`items-center justify-center`}>
        <Svg height="150" width="220">
          <Ellipse
            cx="110"
            cy="75"
            rx="100"
            ry="65"
            stroke="black"
            strokeWidth="5"
            fill="none"
          />
        </Svg>
        <Text style={tw`absolute top-13 text-base text-center`}>
          bạn cần tiết kiệm
        </Text>
        <Text style={tw`absolute top-18 text-base`}>3,000,000 đ</Text>
      </View>

      <View style={tw`flex-row justify-between w-full my-2 items-center`}>
        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-base`}>Tổng mục tiêu</Text>
          <Text style={tw`text-base font-bold mt-1`}>10M</Text>
        </View>

        <View style={tw`h-12 w-0.5 bg-black mx-4`} />

        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-base`}>Tổng đã tiết kiệm</Text>
          <Text style={tw`text-base font-bold mt-1`}>7M</Text>
        </View>
      </View>

      <TouchableOpacity
        style={tw`bg-purple-600 px-4 py-2 rounded-full`}
        onPress={() => navigation.navigate("SavingGoalAdd")}
      >
        <Text style={tw`text-white text-base font-bold`}>Thêm mục tiêu</Text>
      </TouchableOpacity>

      <View style={tw`w-full mt-3 pl-2 pr-2`}>
        {savingGoals.map((goal, index) => {
          const progress = goal.currentAmount / goal.targetAmount;
          const progressPercentage = Math.floor(progress * 100);

          let progressBarColor = "red";
          if (progress >= 0.8) {
            progressBarColor = "green";
          } else if (progress >= 0.5) {
            progressBarColor = "#FFF9C4";
          }

          let statusText = "";
          let statusColor = "";

          if (progress === 1) {
            statusText = "Hoàn thành";
            statusColor = "green";
          } else if (progress === 0) {
            statusText = "Chưa tiết kiệm";
            statusColor = "red";
          } else {
            statusText = `Còn lại ${100 - progressPercentage}%`;
            statusColor = "green";
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigateToDetail(goal)}
              style={tw`border rounded-lg p-4 mb-4 bg-white`}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <Image
                  source={{
                    uri: goal.categoryId?.image || "/path/to/default/image.png",
                  }}
                  style={tw`w-12 h-12 rounded-full mr-4`}
                />
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-lg`}>{goal.name}</Text>
                  <Text style={tw`text-gray-500`}>
                    {(goal.currentAmount || 0).toLocaleString()}đ -{" "}
                    {(goal.targetAmount || 0).toLocaleString()}đ
                  </Text>
                </View>
                <TouchableOpacity onPress={() => confirmDeleteGoal(goal._id)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>

              <ProgressBar
                progress={progress}
                color={progressBarColor}
                style={tw`h-2 rounded-full mt-2`}
              />

              <View style={tw`flex-row justify-between mt-1`}>
                <Text
                  style={[tw`text-xs text-gray-600`, { color: statusColor }]}
                >
                  {progressPercentage}%
                </Text>
                <Text
                  style={[tw`text-xs font-semibold`, { color: statusColor }]}
                >
                  {statusText}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
