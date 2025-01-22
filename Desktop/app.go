package main

import (
	"archive/zip"
	"bytes"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"io"
	"os"

	"path/filepath"

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

func (a *App) SelectOutputFolder() (string, error) {
	selected, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Output Directory",
	})
	if err != nil {
		return "", fmt.Errorf("failed to open directory dialog: %w", err)
	}
	return selected, nil
}

func (a *App) DecryptFile(encryptedFilePath, outputZipPath, password string) error {
  
    encFile, err := os.Open(encryptedFilePath)
    if err != nil {
        return fmt.Errorf("failed to open encrypted file: %w", err)
    }
    defer encFile.Close()

    // Read the IV (first 16 bytes)
    iv := make([]byte, aes.BlockSize)
    if _, err := io.ReadFull(encFile, iv); err != nil {
        return fmt.Errorf("failed to read IV: %w", err)
    }

 //then we read the full file
    encrypted, err := io.ReadAll(encFile)
    if err != nil {
        return fmt.Errorf("failed to read encrypted data: %w", err)
    }

	//checking hash
    hasher := sha256.New()
    hasher.Write([]byte(password))
    key := hasher.Sum(nil)

   //?????
    block, err := aes.NewCipher(key)
    if err != nil {
        return fmt.Errorf("failed to create cipher: %w", err)
    }

    decrypter := cipher.NewCBCDecrypter(block, iv)

    decrypted := make([]byte, len(encrypted))
    decrypter.CryptBlocks(decrypted, encrypted)

    // Remove PKCS7 padding ????
    paddingLen := int(decrypted[len(decrypted)-1])
    if paddingLen > aes.BlockSize || paddingLen == 0 {
        return fmt.Errorf("Invalid Password")
    }

    // Verify padding
    for i := len(decrypted) - paddingLen; i < len(decrypted); i++ {
        if decrypted[i] != byte(paddingLen) {
            return fmt.Errorf("invalid padding")
        }
    }

    // Remove padding
    decrypted = decrypted[:len(decrypted)-paddingLen]

    // Write decrypted data to file
    if err := os.WriteFile(outputZipPath, decrypted, 0644); err != nil {
        return fmt.Errorf("failed to write decrypted data: %w", err)
    }

    return nil
}

func (a *App) DecryptAndExtractCapsule(encryptedFilePath, outputDir, password string) error {
	// Notify frontend that decryption is starting
	runtime.EventsEmit(a.ctx, "decryption-status", "Starting decryption...")

	tempZipPath := filepath.Join(outputDir, "temp_decrypted.zip")

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	runtime.EventsEmit(a.ctx, "decryption-status", "Decrypting file...")
	if err := a.DecryptFile(encryptedFilePath, tempZipPath, password); err != nil {
		return fmt.Errorf("Decryption Failed: %w", err)
	}

	//checks if zip is valid or exists
if _, err := zip.OpenReader(tempZipPath); err != nil {
    os.Remove(tempZipPath)
    return fmt.Errorf("decrypted file is not a valid ZIP archive: %w", err)
}

	runtime.EventsEmit(a.ctx, "decryption-status", "Extracting files...")
	// Extract the ZIP file
	if err := a.ExtractZip(tempZipPath, outputDir); err != nil {
		os.Remove(tempZipPath) // Clean up temp file even if extraction fails
		return fmt.Errorf("extraction failed: %w", err)
	}

	// not working , we have to close the app in order to delete the zip
	// if err := os.Remove(tempZipPath); err != nil {
	// 	return fmt.Errorf("failed to clean up temporary file: %w", err)
	// }
	
	runtime.EventsEmit(a.ctx, "decryption-status", "Complete!")
	return nil
}

func (d *App) ExtractZip(zipFilePath string, outputDir string) error {
    zipReader, err := zip.OpenReader(zipFilePath)
    if err != nil {
        return fmt.Errorf("failed to open ZIP file: %w", err)
    }
    defer zipReader.Close() // Ensure the ZIP reader is closed

    // Extract files to the output directory
    for _, file := range zipReader.File {
        filePath := filepath.Join(outputDir, file.Name)

        if file.FileInfo().IsDir() {
            if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
                return fmt.Errorf("failed to create directory %s: %w", filePath, err)
            }
        } else {
            // Create the file
            if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
                return fmt.Errorf("failed to create parent directory for %s: %w", filePath, err)
            }

            dstFile, err := os.Create(filePath)
            if err != nil {
                return fmt.Errorf("failed to create file %s: %w", filePath, err)
            }

            srcFile, err := file.Open()
            if err != nil {
                dstFile.Close() 
                return fmt.Errorf("failed to open file in ZIP %s: %w", file.Name, err)
            }

           
            if _, err := io.Copy(dstFile, srcFile); err != nil {
                dstFile.Close() 
                srcFile.Close()
                return fmt.Errorf("failed to extract file %s: %w", file.Name, err)
            }

            // Explicitly close the files
            dstFile.Close()
            srcFile.Close()
        }
    }

    return nil
}

func (a *App) CreateZip(filePaths []string, outputDir string) (string, error) {

	zipFilePath := filepath.Join(outputDir, "archive.zip")
	zipFile, err := os.Create(zipFilePath)
	if err != nil {
		return "", err
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	// Add each file to the ZIP archive
	for _, filePath := range filePaths {
		file, err := os.Open(filePath)
		if err != nil {
			return "", err
		}
		defer file.Close()

		fileInfo, err := file.Stat()
		if err != nil {
			return "", err
		}

		header, err := zip.FileInfoHeader(fileInfo)
		if err != nil {
			return "", err
		}

		header.Name = filepath.Base(filePath)

		writer, err := zipWriter.CreateHeader(header)
		if err != nil {
			return "", err
		}

		if _, err := io.Copy(writer, file); err != nil {
			return "", err
		}
	}

	return zipFilePath, nil
}

func (a *App) EncryptFile(filePath string, password string, outputDir string) (string, error) {
	// Read the input file
	inputFile, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer inputFile.Close()

	// Generate a 32-byte key from the password
	key := sha256.Sum256([]byte(password))

	// Generate a random 16-byte IV
	iv := make([]byte, aes.BlockSize)
	if _, err := rand.Read(iv); err != nil {
		return "", err
	}

	// Create the AES cipher block
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", err
	}

	// Read the file data
	plaintext, err := io.ReadAll(inputFile)
	if err != nil {
		return "", err
	}

	// Add PKCS7 padding
	plaintext = pkcs7Pad(plaintext, aes.BlockSize)

	// Create the output file
	encryptedFileName := filepath.Base(filePath) + ".enc"
	encryptedFilePath := filepath.Join(outputDir, encryptedFileName)
	outputFile, err := os.Create(encryptedFilePath)
	if err != nil {
		return "", err
	}
	defer outputFile.Close()

	// Write the IV to the output file
	if _, err := outputFile.Write(iv); err != nil {
		return "", err
	}

	// Create the AES-CBC encrypter
	encrypter := cipher.NewCBCEncrypter(block, iv)

	// Encrypt the data
	ciphertext := make([]byte, len(plaintext))
	encrypter.CryptBlocks(ciphertext, plaintext)

	// Write the encrypted data to the output file
	if _, err := outputFile.Write(ciphertext); err != nil {
		return "", err
	}

	return encryptedFilePath, nil
}

// pkcs7Pad adds PKCS7 padding to the data. ???
func pkcs7Pad(data []byte, blockSize int) []byte {
	padding := blockSize - (len(data) % blockSize)
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(data, padText...)
}

// EncryptFiles creates a ZIP archive of the selected files and encrypts it.
func (a *App) EncryptFiles(filePaths []string, password string, outputDir string) (string, error) {
	zipFilePath, err := a.CreateZip(filePaths, outputDir)
	if err != nil {
		return "", err
	}

	encryptedFilePath, err := a.EncryptFile(zipFilePath, password, outputDir)
	if err != nil {
		return "", err
	}

	os.Remove(zipFilePath)

	return encryptedFilePath, nil
}

func (a *App) SelectFiles() ([]string, error) {
	filePaths, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Files to Encrypt",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "All Files",
				Pattern:     "*.*",
			},
		},
	})
	if err != nil {
		return nil, err
	}

	return filePaths, nil
}

func (a *App) GetCurrentDirectory() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	return dir, nil
}