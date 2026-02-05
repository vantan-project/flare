package custom

import (
	"fmt"

	"github.com/sashabaranov/go-openai"
	"github.com/vantan-project/flare/internal/env"
)

// custom.AI
type AI struct {
	*openai.Client
}

func NewAI() (*AI, error) {
	apiKey := env.OpenAIAPIKey()
	if apiKey == "" {
		return nil, fmt.Errorf("OpenAI API key is not set")
	}

	return &AI{Client: openai.NewClient(apiKey)}, nil
}
