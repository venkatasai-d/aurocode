from transformers import AutoTokenizer, AutoModelForCausalLM
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_huggingface_access():
    token = os.getenv("HUGGINGFACE_TOKEN")
    if not token:
        print("Hugging Face token is missing.")
        return

    print(f"Hugging Face token: {token}")  # Print token for debugging

    try:
        print("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.3", use_auth_token=token)
        print("Tokenizer loaded successfully!")

        print("Loading model...")
        model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.3", use_auth_token=token)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_huggingface_access()