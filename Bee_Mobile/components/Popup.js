import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import tw from 'twrnc'; // Import Tailwind CSS

export default function CustomDeleteModal({ isVisible, onConfirm, onCancel, message }) {
  const scaleValue = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleValue, {
        toValue: 1, 
        useNativeDriver: true,
        tension: 20,
        friction: 6,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, scaleValue]);

  if (!isVisible) {
    return null; 
  }

  return (
    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 absolute top-0 bottom-0 left-0 right-0`}>
      <Animated.View style={[tw`w-80 p-6 bg-white rounded-lg shadow-lg`, { transform: [{ scale: scaleValue }] }]}>
        <Text style={tw`text-lg mb-4 font-semibold text-center text-gray-800`}>{message}</Text>
        <View style={tw`flex-row justify-center`}>
          <TouchableOpacity style={tw`px-4 py-2 bg-gray-300 rounded-md mr-3`} onPress={onCancel}>
            <Text style={tw`text-gray-700 font-bold`}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`px-4 py-2 bg-red-600 rounded-md`} onPress={onConfirm}>
            <Text style={tw`text-white font-bold`}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
