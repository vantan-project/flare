package hash

import "golang.org/x/crypto/bcrypt"

func Check(hash, input string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(input))
	return err == nil
}
