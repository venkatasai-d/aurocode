import React, { useState } from "react";
import { askOllama, storeInterview } from "./api";

function App() {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [interviewId, setInterviewId] = useState(null); // Store MongoDB ID here
  const [history, setHistory] = useState([]); // Store Q&A history

  const handleSubmit = async () => {
    const interview = {
      interviewee_name: name,
      responses: history, // Push Q&A history
    };

    try {
      const response = await storeInterview(interview);
      alert("Interview submitted successfully!");
      setInterviewId(response.data.id); // Store the generated MongoDB ID
    } catch (error) {
      console.error("Error submitting the interview:", error);
    }
  };

  const fetchOllamaQuestion = async () => {
    try {
      const context = history.map((entry) => ({
        question: entry.question,
        answer: entry.answer,
      }));

      const response = await askOllama({
        interview_id: interviewId, // Send the MongoDB ID
        context,
        prompt: "Generate the next question based on this context.",
      });

      const newQuestion = response.data.question;
      setCurrentQuestion(newQuestion);
      setQuestions([...questions, newQuestion]);
    } catch (error) {
      console.error("Error fetching question from Ollama:", error);
    }
  };

  const saveAnswer = () => {
    setHistory([
      ...history,
      { question: currentQuestion, answer: currentAnswer },
    ]);
    setCurrentQuestion(""); // Clear the question for the next one
    setCurrentAnswer(""); // Clear the answer field
  };

  return (
    <div className="App">
      <h1>Interview Bot</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={fetchOllamaQuestion}>Ask Ollama</button>

      <div>
        <h3>Question:</h3>
        <p>{currentQuestion}</p>
      </div>

      <textarea
        placeholder="Type your answer here"
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
      />

      <button onClick={saveAnswer}>Save Answer</button>

      <button onClick={handleSubmit}>Submit Interview</button>

      <div>
        <h3>Interview History:</h3>
        {history.map((entry, index) => (
          <div key={index}>
            <p>
              <strong>Q:</strong> {entry.question}
            </p>
            <p>
              <strong>A:</strong> {entry.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

//////////////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import { askOllama, storeInterview } from "./api"; // Import the API methods
// import "./App.css"; // Import CSS for styling

// function App() {
//   const [name, setName] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [currentAnswer, setCurrentAnswer] = useState("");
//   const { transcript, resetTranscript, listening } = useSpeechRecognition(); // Include listening state
//   const [llamaResponse, setLlamaResponse] = useState("");

//   let listenFlag = false;

//   // Function to fetch a question from the LLM (LLama) backend
//   const fetchOllamaQuestion = async () => {
//     try {
//       const response = await askOllama(
//         "Ask me a short interview question in Java"
//       );
//       setCurrentQuestion(response.data.question);
//       setQuestions([...questions, response.data.question]);
//       setLlamaResponse(response.data.question); // Update to Ollama response
//     } catch (error) {
//       console.error("Error fetching question from Ollama:", error);
//       setLlamaResponse("Error: Unable to fetch question from Ollama");
//     }
//   };

//   const toggleListening = () => {
//     if (listening) {
//       SpeechRecognition.stopListening();
//       setCurrentAnswer(transcript); // Set the current transcript as the answer
//       resetTranscript(); // Reset the transcript after stopping
//     } else {
//       SpeechRecognition.startListening({ continuous: true });
//     }
//   };

//   // Function to submit the interview responses to the backend
//   const handleSubmit = async () => {
//     const interview = {
//       interviewee_name: name,
//       responses: questions.map((q) => ({ question: q, answer: currentAnswer })),
//     };
//     console.log("Submitting interview data:", interview);
//     try {
//       await storeInterview(interview); // This will call the backend and store the interview
//       alert("Interview submitted!");
//     } catch (error) {
//       console.error("Error submitting the interview:", error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Interview Bot</h1>

//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <button onClick={fetchOllamaQuestion}>Ask Ollama</button>
//       <br></br>

//       {llamaResponse && (
//         <div>
//           <h3>LLama Response:</h3>
//           <p>{llamaResponse}</p> {/* Display the response here */}
//         </div>
//       )}

//       {/* Toggle listening button */}
//       <button onClick={toggleListening}>
//         {listening ? "Stop Listening" : "Start Answering"}
//       </button>

//       <p>
//         <strong>Your Answer:</strong> {transcript}
//       </p>

//       <button className="submit-btn" onClick={handleSubmit}>
//         Submit Interview
//       </button>
//     </div>
//   );
// }

// export default App;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useRef } from "react";
// import { askOllama, storeInterview } from "./api"; // Import the API methods
// import "./App.css"; // Import CSS for styling

// function App() {
//   const [name, setName] = useState("");
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [transcript, setTranscript] = useState(""); // To store the transcript in real-time
//   const [llamaResponse, setLlamaResponse] = useState("");
//   const [recording, setRecording] = useState(false); // Track recording state
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const socketRef = useRef(null); // Ref for WebSocket connection

//   // Function to fetch a question from the LLM (Ollama) backend
//   const fetchOllamaQuestion = async () => {
//     try {
//       const response = await askOllama("Ask me a question about programming");
//       setCurrentQuestion(response.data.question);
//       setQuestions([...questions, response.data.question]);
//       setLlamaResponse(response.data.question);
//     } catch (error) {
//       console.error("Error fetching question from Ollama:", error);
//       setLlamaResponse("Error: Unable to fetch question from Ollama");
//     }
//   };

//   // Function to handle recording start/stop
//   const toggleRecording = () => {
//     if (recording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   const startRecording = () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices
//         .getUserMedia({ audio: true })
//         .then((stream) => {
//           const mediaRecorder = new MediaRecorder(stream);
//           mediaRecorderRef.current = mediaRecorder;
//           audioChunksRef.current = [];

//           // Set up WebSocket connection to backend
//           socketRef.current = new WebSocket("ws://localhost:8000/ws/live-stt");

//           socketRef.current.onopen = () => {
//             console.log("WebSocket connection opened");
//           };

//           socketRef.current.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.partial) {
//               setTranscript(data.partial); // Update the transcript in real-time
//             } else if (data.text) {
//               setTranscript(data.text); // Set final transcript when complete
//             }
//           };

//           mediaRecorder.ondataavailable = (event) => {
//             audioChunksRef.current.push(event.data);
//             if (socketRef.current.readyState === WebSocket.OPEN) {
//               socketRef.current.send(event.data); // Send audio chunks to WebSocket
//             }
//           };

//           mediaRecorder.start(200); // Send audio chunks every 200ms
//           setRecording(true);
//         })
//         .catch((error) => {
//           console.error("Error accessing microphone:", error);
//         });
//     }
//   };

//   const stopRecording = () => {
//     const mediaRecorder = mediaRecorderRef.current;
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       mediaRecorder.onstop = () => {
//         if (socketRef.current) {
//           socketRef.current.close(); // Close WebSocket connection
//         }
//         setRecording(false);
//       };
//     }
//   };

//   // Function to submit the interview responses to the backend
//   const handleSubmit = async () => {
//     const interview = {
//       interviewee_name: name,
//       responses: questions.map((q) => ({ question: q, answer: transcript })),
//     };
//     console.log("Submitting interview data:", interview);
//     try {
//       await storeInterview(interview); // This will call the backend and store the interview
//       alert("Interview submitted!");
//     } catch (error) {
//       console.error("Error submitting the interview:", error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Interview Bot</h1>

//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <button onClick={fetchOllamaQuestion}>Ask Ollama</button>

//       {llamaResponse && (
//         <div>
//           <h3>Ollama Response:</h3>
//           <p>{llamaResponse}</p>
//         </div>
//       )}

//       {/* <p>
//         <strong>Question:</strong> {currentQuestion}
//       </p> */}
//       <br></br>
//       {/* Toggle recording button */}
//       <button onClick={toggleRecording}>
//         {recording ? "Stop Recording" : "Start Answering"}
//       </button>

//       <p>
//         <strong>Your Answer (Real-Time Transcript):</strong> {transcript}
//       </p>

//       <button onClick={handleSubmit}>Submit Interview</button>
//     </div>
//   );
// }

// export default App;
