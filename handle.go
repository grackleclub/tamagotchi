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

func handleRoot(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		slog.Info("GET index")
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

// Custom file server to set correct MIME types
func customFileServer(fs http.FileSystem) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ext := filepath.Ext(r.URL.Path)
		mimeType := mime.TypeByExtension(ext)
		slog.Info("request for mime type", "ext", ext, "mimeType", mimeType)
		if mimeType != "" {
			w.Header().Set("Content-Type", mimeType)
		}
		http.FileServer(fs).ServeHTTP(w, r)
	})
}
