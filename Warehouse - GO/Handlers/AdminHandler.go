package handlers

import (
	"bufio"
	"encoding/json"
	"net/http"
	"os"
	"strings"

	middlewares "github.com/mowafaq-elbashabsheh/gowarehouse/Middlewares"
)

func GetLogsHandler(w http.ResponseWriter, r *http.Request) {
	filePath := middlewares.GetFilePath()
	var logs []middlewares.LogEvent

	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "Cannot open the file", http.StatusInternalServerError)
		return
	}

	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		if strings.TrimSpace(line) == "" || strings.Contains(line, "Log created on") {
			continue
		}

		var log middlewares.LogEvent
		if err := json.Unmarshal([]byte(line), &log); err != nil {
			http.Error(w, "Error deserializing log", http.StatusInternalServerError)
			return
		}

		logs = append(logs, log)
	}

	if err := scanner.Err(); err != nil {
		http.Error(w, "something went wrong"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}
