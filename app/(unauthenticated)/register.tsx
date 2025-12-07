import { Link } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function register() {

  const handleSignUp = () => {
  };

  return (
    <View className="flex-1 justify-center px-5 bg-base">
      <Text className="text-2xl font-semibold text-text-base text-center ">Emergency Fund</Text>
      <Text className="text-lg mb-8 text-center text-text-secondary">Start building your safety net today</Text>

      <View className="w-full bg-white rounded-xl p-5 shadow-xl">
        <TextInput
          className="bg-form-input p-3 rounded-xl mb-4 border border-border-form-input"
          placeholder="Full Name"
          placeholderTextColor="#888"
        />

        <TextInput
          className="bg-form-input p-3 rounded-xl mb-4 border border-border-form-input"
          placeholder="Email Address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="bg-form-input p-3 rounded-xl mb-4 border border-border-form-input"
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />

        <TextInput
          className="bg-form-input p-3 rounded-xl mb-4 border border-border-form-input"
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
        />

        <TouchableOpacity className="bg-button-base p-4 rounded-lg items-center mb-4" onPress={handleSignUp}>
          <Text className="text-white font-semibold text-lg">Create Account</Text>
        </TouchableOpacity>

        <Text className="text-center text-text-secondary">
          Already have an account?{" "}
          <Link href="/" className="text-text-link font-semibold">
            Login
          </Link>
        </Text>
      </View>

      <View className="mt-5 bg-white flex flex-row justify-around p-4 rounded-xl shadow-md">
        <View className="flex-1 items-center just-center">
          <Text className="text-center text-sm font-semibold text-text-base">💰 Track</Text>
        </View>
        <View className="flex-1 items-center just-center">
          <Text className="text-center text-sm font-semibold text-text-base">☔ Save</Text>
        </View>
        <View className="flex-1 items-center just-center">
          <Text className="text-center text-sm font-semibold text-text-base">📈 Grow</Text>
        </View>
      </View>
    </View>
  );
}