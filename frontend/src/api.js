import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Adjust this if your backend is on a different URL/port

// Store interview in the backend (MongoDB)
export const storeInterview = async (interview) => {
  return await axios.post(`${API_URL}/interview`, interview, {
    headers: {
      "Content-Type": "application/json", // Ensure you're sending JSON data
    },
  });
};

// Send the "prompt" as JSON data
export const askOllama = async (prompt) => {
  return await axios.post(`${API_URL}/ask-ollama`, { prompt }); // Correct structure
};
