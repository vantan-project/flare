package hash

import "golang.org/x/crypto/bcrypt"

func Make(input string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(input), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}
