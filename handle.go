package main

import (
	"html/template"
	"log/slog"
	"net/http"
)

func handleRoot(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFS(static, "static/html/index.html")
	if err != nil {
		slog.Error("parse template", "error", err)
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, activities)
}
