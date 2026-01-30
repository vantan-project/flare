package auth

import (
	"errors"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"github.com/vantan-project/flare/pkg/hash"
	"github.com/vantan-project/flare/pkg/jwt"
	"gorm.io/gorm"
)

type loginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type loginResponse struct {
	Status      string            `json:"status"`
	Message     string            `json:"message,omitempty"`
	FieldErrors map[string]string `json:"fieldErrors,omitempty"`
	AccessToken string            `json:"accessToken,omitempty"`
}

func Login(cc *custom.Context) error {
	var req loginRequest
	fieldErrors, err := cc.Validate(&req, map[string]map[string]string{
		"email": {
			"required": "メールアドレスは必須です。",
			"email":    "有効なメールアドレスを入力してください。",
		},
		"password": {"required": "パスワードは必須です。"},
	})

	if err != nil {
		return cc.JSON(500, loginResponse{
			Status:  "error",
			Message: "予期せぬエラーが発生しました。",
		})
	}
	if len(fieldErrors) > 0 {
		return cc.JSON(422, loginResponse{
			Status:      "validation",
			FieldErrors: fieldErrors,
		})
	}

	var user model.User
	if err := cc.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return cc.JSON(401, loginResponse{
				Status:  "error",
				Message: "メールアドレスまたはパスワードが正しくありません。",
			})
		}
		return cc.JSON(500, loginResponse{
			Status:  "error",
			Message: "サーバーエラーが発生しました。",
		})
	}

	// パスワードの検証
	if !hash.Check(user.Password, req.Password) {
		return cc.JSON(401, loginResponse{
			Status:  "error",
			Message: "メールアドレスまたはパスワードが正しくありません。",
		})
	}

	// JWTトークンの生成
	accessToken, err := jwt.Generate(user.ID, user.Email)
	if err != nil {
		return cc.JSON(500, loginResponse{
			Status:  "error",
			Message: "トークンの生成に失敗しました。",
		})
	}

	return cc.JSON(200, loginResponse{
		Status:      "success",
		Message:     "ログインに成功しました。",
		AccessToken: accessToken,
	})
}
