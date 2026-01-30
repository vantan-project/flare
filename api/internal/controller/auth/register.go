package auth

import (
	"errors"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"github.com/vantan-project/flare/pkg/hash"
	"github.com/vantan-project/flare/pkg/jwt"
	"gorm.io/gorm"
)

type registerRequest struct {
	Name     string `json:"name" validate:"required,max=20"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type registerResponse struct {
	Status      string            `json:"status"`
	Message     string            `json:"message,omitempty"`
	FieldErrors map[string]string `json:"fieldErrors,omitempty"`
	AccessToken string            `json:"accessToken,omitempty"`
}

func Register(cc *custom.Context) error {
	var req registerRequest
	// ここのバリデーションでreqの中身に入力されたデータを入れている。
	fieldErrors, err := cc.Validate(&req, map[string]map[string]string{
		"name": {
			"required": "ユーザー名は必須です。",
			"max":      "ユーザー名は20文字以内で入力してください。",
		},
		"email": {
			"required": "メールアドレスは必須です。",
			"email":    "有効なメールアドレスを入力してください。",
		},
		"password": {
			"required": "パスワードは必須です。",
		},
	})
	// バリデーションの操作に失敗
	if err != nil {
		// structでStatusをstatusにしてるから出力時にはstatusで出力される。
		return cc.JSON(500, registerResponse{
			Status:  "error",
			Message: "予期せぬエラーが発生しました。",
		})
	}
	// バリデーションエラー
	if len(fieldErrors) > 0 {
		return cc.JSON(422, registerResponse{
			Status:      "Validation",
			FieldErrors: fieldErrors,
		})
	}

	// パスワードのハッシュ化
	hashedPassword, err := hash.Make(req.Password)
	if err != nil {
		return cc.JSON(500, registerResponse{
			Status:  "error",
			Message: "予期せぬエラーが発生しました。",
		})
	}

	var user model.User
	var profile model.Profile

	// ユーザ作成
	err = cc.DB.Transaction(func(tx *gorm.DB) error {
		// ユーザーテーブル
		user = model.User{
			Email:    req.Email,
			Password: hashedPassword,
		}
		if err := tx.Create(&user).Error; err != nil {
			return err
		}

		// プロフィールテーブル
		profile = model.Profile{
			Name:   req.Name,
			UserID: user.ID,
		}
		if err := tx.Create(&profile).Error; err != nil {
			return err
		}

		// 成功したらnil返す
		return nil
	})

	if err != nil {
		// メールアドレスが重複している場合
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return cc.JSON(400, registerResponse{
				Status:  "error",
				Message: "メールアドレスがすでに使用されています。",
			})
		}
		return cc.JSON(500, registerResponse{
			Status:  "error",
			Message: "予期せぬエラーが発生しました。",
		})
	}

	// JWTトークンの生成
	accessToken, err := jwt.Generate(user.ID, user.Email)
	if err != nil {
		return cc.JSON(500, registerResponse{
			Status:  "error",
			Message: "予期せぬエラーが発生しました。",
		})
	}

	return cc.JSON(200, registerResponse{
		Status:      "success",
		Message:     "ユーザー登録に成功しました。",
		AccessToken: accessToken,
	})
}
