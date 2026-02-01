package env

import "os"

func OpenAIAPIKey() string { return os.Getenv("OPENAI_API_KEY") }
