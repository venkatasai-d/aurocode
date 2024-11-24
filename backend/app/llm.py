import requests
import json

class OllamaModel:
    def __init__(self):
        # Replace with the actual Ollama API URL if available
        self.api_url = "http://127.0.0.1:11434/api/generate"  # Example API endpoint

    def generate_question(self, prompt):
        try:
            print(f"Sending prompt to Ollama: {prompt}")
            f = open('F:\Kode\Projects\CGP_InterviewBot\\backend\\app\input.json', 'r')
            data = json.load(f)
            data['prompt'] = prompt
            response = requests.post(self.api_url, json=data)
            response.raise_for_status()  # Check for HTTP errors
            dictionary = json.loads(response.text)
            f.close()

            print(f"Ollama response: {dictionary['response']}")
            return dictionary['response']  # Replace with correct key
        except Exception as e:
            print(f"Error calling Ollama API: {e}")
            return f"Error: {e}"

# Create an instance of the OllamaModel
ollama_model = OllamaModel()

def get_ollama_response(prompt):
    return ollama_model.generate_question(prompt)
