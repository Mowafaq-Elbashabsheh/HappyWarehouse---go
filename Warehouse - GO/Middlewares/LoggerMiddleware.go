package middlewares

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		filePath := GetFilePath()
		dirPath := filepath.Dir(filePath)

		if err := os.MkdirAll(dirPath, os.ModePerm); err != nil {
			fmt.Println("Failed to create log directory:", err)
			return
		}

		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			if file, err := os.Create(filePath); err == nil {
				file.WriteString("Log created on " + time.Now().Format("02-01-2006 15:04:05") + "\n")
				file.Close()
			}
		}

		lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(lrw, r)

		if lrw.statusCode >= 400 {
			logEntry := LogEvent{
				TraceID:        uuid.New().String(),
				Timestamp:      time.Now(),
				Message:        http.StatusText(lrw.statusCode),
				InnerException: lrw.body.String(),
			}

			logData, _ := json.Marshal(logEntry)

			file, err := os.OpenFile(filePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			if err == nil {
				defer file.Close()
				file.WriteString(string(logData) + "\n")
			} else {
				log.Println("Failed to write to log file:", err)
			}
		}
	})
}

func GetFilePath() string {
	date := "1" // := time.Now().Format("02-01-2006")
	baseDir, err := os.Getwd()
	if err != nil {
		fmt.Println("Error getting base directory:", err)
		return ""
	}

	logFilePath := filepath.Join(baseDir, "logs", fmt.Sprintf("log-%s.txt", date))

	return logFilePath
}

type LogEvent struct {
	TraceID        string    `json:"traceId,omitempty"`
	Timestamp      time.Time `json:"timestamp"`
	Message        string    `json:"message"`
	InnerException string    `json:"innerException,omitempty"`
}

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
	body       strings.Builder
}

// override writeheader to capture status code
func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func (lrw *loggingResponseWriter) Write(p []byte) (int, error) {
	lrw.body.Write(p)
	return lrw.ResponseWriter.Write(p)
}
