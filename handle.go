package main

import (
	"html/template"
	"log/slog"
	"mime"
	"net/http"
	"path/filepath"
)

var greeting string = "Hello, person!"

type page struct {
	Title string
}

// handleRoot handles the root URL and serves the index page
func handleRoot(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		slog.Info("GET index", "path", r.URL.Path)
		tmpl, err := template.ParseFS(static, "static/html/index.html")
		if err != nil {
			slog.Error("parse template", "error", err)
			http.Error(w, "server error", http.StatusInternalServerError)
			return
		}
		data := page{
			Title: greeting,
		}
		tmpl.Execute(w, data)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// handleStatic ensures correct content headers are set, based on MIME types
func handleStatic(fs http.FileSystem) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ext := filepath.Ext(r.URL.Path)
		if ext == "test" {
			slog.Warn(
				"rejecting request for test file",
				"path", r.URL.Path,
			)
			http.Error(w, "forbidden", http.StatusForbidden)
		}
		mimeType := mime.TypeByExtension(ext)
		slog.Info("request for mime type", "ext", ext, "mimeType", mimeType)
		if mimeType != "" {
			w.Header().Set("Content-Type", mimeType)
		}
		http.FileServer(fs).ServeHTTP(w, r)
	})
}
