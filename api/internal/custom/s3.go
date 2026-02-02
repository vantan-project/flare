package custom

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/vantan-project/flare/internal/env"
)

// custom.S3
type S3 struct {
	*s3.Client
	Bucket string
}

func NewS3() (*S3, error) {
	ctx := context.Background()
	accessKey := env.AWSAccessKeyID()
	secretKey := env.AWSSecretAccessKey()
	region := env.AWSRegion()
	if accessKey == "" || secretKey == "" || region == "" {
		return nil, errors.New("AWS credentials or region not set in environment variables")
	}

	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			accessKey,
			secretKey,
			"",
		)),
	)
	if err != nil {
		return nil, err
	}

	return &S3{
		Client: s3.NewFromConfig(cfg),
		Bucket: env.AWSBucket(),
	}, nil
}
