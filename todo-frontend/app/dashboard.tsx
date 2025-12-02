import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [profile, setProfile] = useState<any>(null);

  // Load token from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://192.168.1.7:8000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchTasks();
    }
  }, [token]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://192.168.1.7:8000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask || !token) return;
    try {
      await axios.post(
        "http://192.168.1.7:8000/tasks",
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle task completion
  const toggleTask = async (id: number) => {
    if (!token) return;
    try {
      await axios.patch(
        `http://192.168.1.7:8000/tasks/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    if (!token) return;

    try {
      await axios.delete(`http://192.168.1.7:8000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };
  // Logout
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  return (
    <View style={{ 
        flex: 1, 
        padding: 20, 
        justifyContent: "center",
        alignItems: "center"
      }}>
      <View style={{ marginBottom: 20 }}>
        {profile && (
          <>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              Hey! {profile.username} 
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>{profile.email}</Text>
            <Text style={{ fontSize: 14, color: "#777" }}>
              Joined: {new Date(profile.created_at).toDateString()}
            </Text>
          </>
        )}
      </View>
      <Button title="Logout" onPress={logout} />

      {/* New Task Input */}
      <View style={{ marginVertical: 20 }}>
        <TextInput
          placeholder="New Task"
          value={newTask}
          onChangeText={setNewTask}
          style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>

      {/* Tasks List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 10,
              padding: 50,
              borderRadius: 10,
              backgroundColor:  item.completed ? "#d1ffd6" : "#f2f2f2",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Task info */}
            <TouchableOpacity
              onPress={() => toggleTask(item.id)}
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 5,
                  textDecorationLine: item.completed ? "line-through" : "none",
                }}
              >
                {item.title}
              </Text>
              {item.description && (
                <Text style={{ color: "#555" }}>{item.description}</Text>
              )}
              <Text
                style={{
                  marginTop: 10,
                  color: item.completed ? "green" : "red",
                }}
              >
                {item.completed ? "Completed" : "Pending"}
              </Text>
            </TouchableOpacity>

            {/* Delete button */}
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={{
                marginLeft: 300,
                marginTop: 40,
                padding: 8,
                backgroundColor: "#ff4d4d",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
