import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Link } from "expo-router";
import { signup } from "../src/api/auth";
import { router } from "expo-router";
import { Image } from 'react-native';
export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
  try {
    const res = await signup({ username, email, password });

    Alert.alert("Success", "Account created!");

    // Redirect AFTER alert shows
    setTimeout(() => {
      router.replace("/login");
    }, 500);

  } catch (error) {
    Alert.alert("Error", error.response?.data?.detail || "Signup failed");
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
      
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Create Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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

      <Button title="Sign Up" onPress={handleSignup} color="#ffd200" />

      <Link href="/login" style={{ marginTop: 20 }}>
        <Text style={{ color: "blue", marginTop: 10 }}>Already have an account? Login</Text>
      </Link>
    </View>
  );
}
