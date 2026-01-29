package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/joho/godotenv"
	"github.com/vantan-project/flare/database/seeder"
	"github.com/vantan-project/flare/internal/custom"
)

//go:generate go build -o ../../seed .
func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	if len(os.Args) != 3 {
		FatalLog()
	}

	db, err := custom.NewGorm()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	command := os.Args[1]
	filename := os.Args[2]

	switch command {
	case "create":
		if err := createSeederFile(filename); err != nil {
			log.Fatal(err)
		}
	case "run":
		if err := seeder.Seed(db, filename); err != nil {
			log.Fatal(err)
		}
	default:
		FatalLog()
	}
}

func createSeederFile(filename string) error {
	dir := "database/seeder"

	// ファイル名から関数名を生成（スネークケース → キャメルケース）
	funcName := snakeToCamel(filename)

	// ファイルパスを生成
	filepath := filepath.Join(dir, filename+".go")

	// ファイルが既に存在する場合はエラー
	if _, err := os.Stat(filepath); err == nil {
		return fmt.Errorf("ファイル %s は既に存在します", filepath)
	}

	// テンプレートを定義
	tmpl := `package seeder

import (
	"github.com/vantan-project/flare/internal/database"
)

func {{.FuncName}}(orm *database.ORM) error {
	return nil
}

func init() {
	Register("{{.Filename}}", {{.FuncName}})
}
`

	// テンプレートをパース
	t, err := template.New("seeder").Parse(tmpl)
	if err != nil {
		return fmt.Errorf("テンプレートのパースに失敗しました: %w", err)
	}

	// ファイルを作成
	file, err := os.Create(filepath)
	if err != nil {
		return fmt.Errorf("ファイルの作成に失敗しました: %w", err)
	}
	defer file.Close()

	// テンプレートを実行してファイルに書き込み
	data := map[string]string{
		"FuncName": funcName,
		"Filename": filename,
	}
	if err := t.Execute(file, data); err != nil {
		return fmt.Errorf("ファイルへの書き込みに失敗しました: %w", err)
	}

	fmt.Printf("シーダーファイルを作成しました: %s\n", filepath)
	return nil
}

func snakeToCamel(s string) string {
	parts := strings.Split(s, "_")
	for i, part := range parts {
		if len(part) > 0 {
			parts[i] = strings.ToUpper(part[:1]) + part[1:]
		}
	}
	return strings.Join(parts, "")
}

func FatalLog() {
	log.Fatal(`無効なコマンドです。以下のいずれかのコマンドを指定してください:

  - ./seed create [file_name]
  - ./seed run [file_name]
	`)
}
