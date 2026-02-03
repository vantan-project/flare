package images

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"slices"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type uploadRequest struct {
	Image *multipart.FileHeader `form:"image" validate:"required"`
}

type uploadResponse struct {
	Status      string            `json:"status"`
	Message     string            `json:"message,omitempty"`
	ImageUrl    string            `json:"imageUrl,omitempty"`
	ImageId     uint              `json:"imageId,omitempty"`
	FieldErrors map[string]string `json:"fieldErrors,omitempty"`
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024

// スライスは定数にできなかった。
var IMAGE_TYPES = []string{
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
}

func generateFilename(ext string) string {
	bytes := make([]byte, 12)
	rand.Read(bytes)
	randomString := base64.URLEncoding.EncodeToString(bytes)
	timestamp := strconv.FormatInt(time.Now().Unix(), 10)
	return randomString + "-" + timestamp + ext
}

func Upload(cc *custom.Context) error {
	var req uploadRequest
	cc.BindValidate(&req, map[string]map[string]string{
		"image": {
			"required": "画像は必須です。",
		},
	})

	if req.Image.Size > MAX_IMAGE_SIZE {
		return cc.JSON(422, uploadResponse{
			Status: "validation",
			FieldErrors: map[string]string{
				"image": "画像のサイズが大きすぎます。",
			},
		})
	}

	imageType := req.Image.Header.Get("Content-Type")
	fmt.Println(imageType)
	if !slices.Contains(IMAGE_TYPES, imageType) {
		return cc.JSON(422, uploadResponse{
			Status: "validation",
			FieldErrors: map[string]string{
				"image": "画像はJPEG, JPG, PNG, GIFのいずれかの形式でアップロードしてください。",
			},
		})
	}

	f, err := req.Image.Open()
	if err != nil {
		return cc.JSON(500, uploadResponse{
			Status:  "error",
			Message: "画像のアップロードに失敗しました。",
		})
	}
	defer f.Close()

	ext := filepath.Ext(req.Image.Filename)
	filename := generateFilename(ext)
	path := "images/" + filename

	_, err = cc.Storage.PutObject(context.Background(), &s3.PutObjectInput{
		Bucket:      &cc.Storage.Bucket,
		Key:         &path,
		Body:        f,
		ContentType: &imageType,
	})
	if err != nil {
		return cc.JSON(500, uploadResponse{
			Status:  "error",
			Message: "画像のアップロードに失敗しました。",
		})
	}

	image := model.Image{
		URL:  "https://" + cc.Storage.Bucket + ".s3.amazonaws.com/" + path,
		Path: "images",
	}

	if err := cc.DB.Create(&image).Error; err != nil {
		return cc.JSON(500, uploadResponse{
			Status:  "error",
			Message: "画像の登録に失敗しました。",
		})
	}

	return cc.JSON(200, uploadResponse{
		Status:   "success",
		Message:  "画像のアップロードに成功しました。",
		ImageUrl: image.URL,
		ImageId:  image.ID,
	})
}
