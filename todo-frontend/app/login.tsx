import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { login } from "../src/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Link } from "expo-router";
import { Image } from 'react-native';
export default function LoginScreen() {
  const [usernameOrEmail, setUE] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const res = await login({
        username: usernameOrEmail,
        password,
      });

      await AsyncStorage.setItem("token", res.data.access_token);

      router.replace("/dashboard"); // navigate after login
    } catch (error) {
      Alert.alert("Error", error.response?.data?.detail || "Login failed");
    }
  }
const images = {
  logo: require('../assets/images/favicon.png'),
};
  return (
    <View style={{ 
        flex: 1, 
        padding: 20, 
      
        alignItems: "center"
      }}>
            <Image
      source={images.logo}
      style={{ width: 430, height: 400, justifyContent: 'center' }}
    />

      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Username or Email"
        value={usernameOrEmail}
        onChangeText={setUE}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />

      <Button title="Login" onPress={handleLogin} />

      <Link href="/signup" style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Don't have an account? Sign Up</Text>
      </Link>
    </View>
  );
}
