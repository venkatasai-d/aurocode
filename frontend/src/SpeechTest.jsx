import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function SpeechTest() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser doesn't support speech recognition.</div>;
  }

  return (
    <div>
      <h1>Speech Recognition Test</h1>
      <button onClick={handleStartListening}>Start Listening</button>
      <button onClick={handleStopListening}>Stop Listening</button>

      <p>Listening: {listening ? "Yes" : "No"}</p>
      <p>Transcript: {transcript}</p>

      <button onClick={resetTranscript}>Reset Transcript</button>
    </div>
  );
}

export default SpeechTest;
