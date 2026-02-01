package custom

import (
	"fmt"

	"github.com/567-labs/instructor-go/pkg/instructor"
	"github.com/sashabaranov/go-openai"
	"github.com/vantan-project/flare/internal/env"
)

// custom.AI
type AI struct {
	*instructor.InstructorOpenAI
}

func NewAI() (*AI, error) {
	apiKey := env.OpenAIAPIKey()
	if apiKey == "" {
		return nil, fmt.Errorf("OpenAI API key is not set")
	}

	client := instructor.FromOpenAI(
		openai.NewClient(apiKey),
		instructor.WithMode(instructor.ModeJSON),
		instructor.WithMaxRetries(3),
	)

	return &AI{
		InstructorOpenAI: client,
	}, nil
}
