package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/joho/godotenv"
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/env"
)

//go:generate go build -o ../../migrate .
func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	if len(os.Args) < 2 {
		FatalLog()
	}

	orm, err := custom.NewGorm()
	if err != nil {
		log.Fatal(err)
	}
	defer orm.Close()

	dsn := orm.DSN
	dir := "database/migration"
	command := os.Args[1]

	// MySQLのデータベース名を取得
	dbName := env.DBDatabase()

	switch command {
	case "create":
		if len(os.Args) != 3 {
			FatalLog()
		}
		cmd := exec.Command("migrate", "create", "-ext", "sql", "-dir", dir, "-seq", fmt.Sprintf("create_%s_table", os.Args[2]))
		execCommand(cmd)
		log.Println("マイグレーションファイルが作成されました。")
	case "up":
		if len(os.Args) != 2 {
			FatalLog()
		}
		cmd := exec.Command("migrate", "-path", dir, "-database", fmt.Sprintf("mysql://%s", dsn), "-verbose", "up")
		execCommand(cmd)
		log.Println("マイグレーションが完了しました。")
	case "down":
		if len(os.Args) != 2 {
			FatalLog()
		}
		cmd := exec.Command("migrate", "-path", dir, "-database", fmt.Sprintf("mysql://%s", dsn), "-verbose", "down", "-all")
		execCommand(cmd)
		log.Println("ロールバックが完了しました。")
	case "reset":
		if len(os.Args) != 2 {
			FatalLog()
		}
		// MySQLの場合: データベースを削除して再作成
		orm.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %s;", dbName))
		orm.Exec(fmt.Sprintf("CREATE DATABASE %s CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", dbName))
		orm.Exec(fmt.Sprintf("USE %s;", dbName))
		log.Println("リセットが完了しました。")
	case "fresh":
		if len(os.Args) != 2 {
			FatalLog()
		}
		// MySQLの場合: データベースを削除して再作成
		orm.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %s;", dbName))
		orm.Exec(fmt.Sprintf("CREATE DATABASE %s CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", dbName))
		orm.Exec(fmt.Sprintf("USE %s;", dbName))
		cmd := exec.Command("migrate", "-path", dir, "-database", fmt.Sprintf("mysql://%s", dsn), "-verbose", "up")
		execCommand(cmd)
		log.Println("フレッシュが完了しました。")
	default:
		FatalLog()
	}
}

func execCommand(cmd *exec.Cmd) {
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	fmt.Println(cmd.String())
	if err := cmd.Run(); err != nil {
		log.Fatal(err)
		FatalLog()
	}
}

func FatalLog() {
	log.Fatal(`無効なコマンドです。以下のいずれかのコマンドを指定してください:

  - ./migrate create [table_name]
  - ./migrate up
  - ./migrate down
  - ./migrate reset
  - ./migrate fresh`)
}
