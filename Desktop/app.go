package main

import (
	"archive/zip"
	"bytes"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	runtime.WindowSetSize(ctx, 800, 600)
	runtime.WindowSetMinSize(ctx, 800, 600)
	runtime.WindowSetMaxSize(ctx, 800, 600)
}

func (a *App) SelectOutputFolder() (string, error) {
	selected, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Output Directory",
	})
	if err != nil {
		return "", fmt.Errorf("failed to open directory dialog: %w", err)
	}
	return selected, nil
}

func (a *App) DecryptAndExtractCapsule(encryptedFilePath, outputDir, password string) error {
	decryptedData, err := a.DecryptFile(encryptedFilePath, password)
	if err != nil {
		return fmt.Errorf("decryption failed: %w", err)
	}

	// Write the decrypted data to a temporary ZIP file
	tempZipPath := filepath.Join(outputDir, "temp_decrypted.zip")
	if err := os.WriteFile(tempZipPath, decryptedData, 0644); err != nil {
		return fmt.Errorf("failed to write decrypted data: %w", err)
	}

	if err := a.ExtractZip(tempZipPath, outputDir); err != nil {
		return fmt.Errorf("extraction failed: %w", err)
	}

	os.Remove(tempZipPath)

	return nil
}

func (a *App) DecryptFile(encryptedFilePath, password string) ([]byte, error) {

	ciphertext, err := os.ReadFile(encryptedFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read encrypted file: %w", err)
	}

	// Check if the file is too small to contain IV, ciphertext, and timestamp
	if len(ciphertext) < aes.BlockSize+8 {
		return nil, errors.New("invalid encrypted file format")
	}

	// Extract the IV (first 16 bytes)
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	// Extract the unlock timestamp (last 8 bytes)
	unlockTimestamp := int64(binary.BigEndian.Uint64(ciphertext[len(ciphertext)-8:]))
	ciphertext = ciphertext[:len(ciphertext)-8]

	// Derive the key from the password using SHA-256
	key := sha256.Sum256([]byte(password))

	// Decrypt the data using AES-256-CBC
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return nil, fmt.Errorf("failed to create cipher: %w", err)
	}
	decrypter := cipher.NewCBCDecrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	decrypter.CryptBlocks(plaintext, ciphertext)

	// Remove PKCS7 padding
	plaintext, err = pkcs7Unpad(plaintext, aes.BlockSize)
	if err != nil {
		return nil, errors.New("incorrect password")
	}

	// Check if the file is still locked
	currentTime := time.Now().Unix()
	if currentTime < unlockTimestamp {
		timeRemaining := time.Until(time.Unix(unlockTimestamp, 0))
		return nil, fmt.Errorf("file is still locked. Time remaining: %s", formatDuration(timeRemaining))
	}

	return plaintext, nil
}

//  ex : 2 days, 3 hours, 5 minutes, 10 seconds
func formatDuration(d time.Duration) string {
	days := d / (24 * time.Hour)
	d -= days * 24 * time.Hour

	hours := d / time.Hour
	d -= hours * time.Hour

	minutes := d / time.Minute
	d -= minutes * time.Minute

	seconds := d / time.Second

	var result string
	if days > 0 {
		result += fmt.Sprintf("%d days, ", days)
	}
	if hours > 0 {
		result += fmt.Sprintf("%d hours, ", hours)
	}
	if minutes > 0 {
		result += fmt.Sprintf("%d minutes, ", minutes)
	}
	result += fmt.Sprintf("%d seconds", seconds)

	return result
}

//dialog screen
func (a *App) SelectEncryptedFile() (string, error) {
	selected, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Encrypted File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Encrypted Files (*.enc)",
				Pattern:     "*.enc",
			},
			{
				DisplayName: "All Files",
				Pattern:     "*.*",
			},
		},
	})
	if err != nil {
		return "", fmt.Errorf("failed to open file dialog: %w", err)
	}
	return selected, nil
}

func (a *App) ExtractZip(zipFilePath, outputDir string) error {
	zipReader, err := zip.OpenReader(zipFilePath)
	if err != nil {
		return fmt.Errorf("failed to open ZIP file: %w", err)
	}
	defer zipReader.Close()

	for _, file := range zipReader.File {
		filePath := filepath.Join(outputDir, file.Name)

		if file.FileInfo().IsDir() {
			if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
				return fmt.Errorf("failed to create directory: %w", err)
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
			return fmt.Errorf("failed to create parent directory: %w", err)
		}

		dstFile, err := os.Create(filePath)
		if err != nil {
			return fmt.Errorf("failed to create file: %w", err)
		}
		defer dstFile.Close()

		srcFile, err := file.Open()
		if err != nil {
			return fmt.Errorf("failed to open file in ZIP: %w", err)
		}
		defer srcFile.Close()

		if _, err := io.Copy(dstFile, srcFile); err != nil {
			return fmt.Errorf("failed to extract file: %w", err)
		}
	}

	return nil
}

func (a *App) EncryptFiles(filePaths []string, password string, unlockTime time.Time, outputDir string) (string, error) {
	
	if err := a.ValidatePassword(password); err != nil {
		return "", fmt.Errorf("invalid password: %w", err)
	}

	// Create a ZIP archive
	zipFilePath := filepath.Join(outputDir, "archive.zip")
	if err := a.CreateZip(filePaths, zipFilePath); err != nil {
		return "", fmt.Errorf("failed to create ZIP archive: %w", err)
	}

	encryptedFilePath, err := a.EncryptFile(zipFilePath, password, unlockTime, outputDir)
	if err != nil {
		return "", fmt.Errorf("failed to encrypt file: %w", err)
	}

	os.Remove(zipFilePath)

	return encryptedFilePath, nil
}

//annoyting
func (a *App) ValidatePassword(password string) error {
	// Example: Check if the password is at least 8 characters long
	// if len(password) < 8 {
	// 	return fmt.Errorf("password must be at least 8 characters long")
	// }

	// // Example: Check if the password contains at least one number
	// hasNumber := false
	// for _, char := range password {
	// 	if unicode.IsDigit(char) {
	// 		hasNumber = true
	// 		break
	// 	}
	// }
	// if !hasNumber {
	// 	return fmt.Errorf("password must contain at least one number")
	// }

	// // Example: Check if the password contains at least one special character
	// hasSpecial := false
	// specialChars := "!@#$%^&*()_+{}[]:;<>,.?/~`"
	// for _, char := range password {
	// 	if strings.ContainsRune(specialChars, char) {
	// 		hasSpecial = true
	// 		break
	// 	}
	// }
	// if !hasSpecial {
	// 	return fmt.Errorf("password must contain at least one special character")
	// }

	return nil
}

func (a *App) EncryptFile(filePath, password string, unlockTime time.Time, outputDir string) (string, error) {
	plaintext, err := os.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	iv := make([]byte, aes.BlockSize)
	if _, err := rand.Read(iv); err != nil {
		return "", fmt.Errorf("failed to generate IV: %w", err)
	}

	// Derive the key from the password using SHA-256
	key := sha256.Sum256([]byte(password))

	// Pad the plaintext using PKCS7
	plaintext = pkcs7Pad(plaintext, aes.BlockSize)

	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", fmt.Errorf("failed to create cipher: %w", err)
	}
	ciphertext := make([]byte, len(plaintext))
	encrypter := cipher.NewCBCEncrypter(block, iv)
	encrypter.CryptBlocks(ciphertext, plaintext)

	encryptedFileName := filepath.Base(filePath) + ".enc"
	encryptedFilePath := filepath.Join(outputDir, encryptedFileName)
	outputFile, err := os.Create(encryptedFilePath)
	if err != nil {
		return "", fmt.Errorf("failed to create output file: %w", err)
	}
	defer outputFile.Close()

	// Write the IV, ciphertext, and unlock timestamp to the output file
	if _, err := outputFile.Write(iv); err != nil {
		return "", fmt.Errorf("failed to write IV: %w", err)
	}
	if _, err := outputFile.Write(ciphertext); err != nil {
		return "", fmt.Errorf("failed to write ciphertext: %w", err)
	}
	if err := binary.Write(outputFile, binary.BigEndian, unlockTime.Unix()); err != nil {
		return "", fmt.Errorf("failed to write unlock timestamp: %w", err)
	}

	return encryptedFilePath, nil
}

func pkcs7Pad(data []byte, blockSize int) []byte {
	padding := blockSize - (len(data) % blockSize)
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(data, padText...)
}

func pkcs7Unpad(data []byte, blockSize int) ([]byte, error) {
	if len(data) == 0 {
		return nil, errors.New("data is empty")
	}
	padding := int(data[len(data)-1])
	if padding > blockSize || padding == 0 {
		return nil, errors.New("invalid padding")
	}
	for i := len(data) - padding; i < len(data); i++ {
		if data[i] != byte(padding) {
			return nil, errors.New("invalid padding")
		}
	}
	return data[:len(data)-padding], nil
}

func (a *App) CreateZip(filePaths []string, outputPath string) error {
	zipFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create ZIP file: %w", err)
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	for _, filePath := range filePaths {
		file, err := os.Open(filePath)
		if err != nil {
			return fmt.Errorf("failed to open file: %w", err)
		}
		defer file.Close()

		fileInfo, err := file.Stat()
		if err != nil {
			return fmt.Errorf("failed to get file info: %w", err)
		}

		header, err := zip.FileInfoHeader(fileInfo)
		if err != nil {
			return fmt.Errorf("failed to create ZIP header: %w", err)
		}
		header.Name = filepath.Base(filePath)

		writer, err := zipWriter.CreateHeader(header)
		if err != nil {
			return fmt.Errorf("failed to create ZIP entry: %w", err)
		}

		if _, err := io.Copy(writer, file); err != nil {
			return fmt.Errorf("failed to write file to ZIP: %w", err)
		}
	}

	return nil
}

func (a *App) SelectFiles() ([]string, error) {
	selected, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Files to Encrypt",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "All Files",
				Pattern:     "*.*",
			},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to open file dialog: %w", err)
	}
	return selected, nil
}

func (a *App) GetCurrentDirectory() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("failed to get current directory: %w", err)
	}
	return dir, nil
}