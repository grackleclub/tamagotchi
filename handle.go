package main

import (
	"html/template"
	"log/slog"
	"net/http"
	"time"
)

type page struct {
	Activities       []Activity
	Categories       []category
	PointsByActivity map[string]int
	PointsByCategory map[category]int
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
		// TODO check the user's session or db
		entries := sampleEntries(10) // TODO remove mock
		data := newPage(entries)
		tmpl.Execute(w, data)

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

}

func newPage(entries []entry) page {
	return page{
		Activities:       activities,
		Categories:       categories,
		PointsByActivity: pointsByActivity(entries),
		PointsByCategory: pointsByCategory(entries),
	}
}

func sampleEntries(qty int) []entry {
	entries := make([]entry, qty)
	for i := 0; i < qty; i++ {
		entries[i] = entry{
			time:     time.Now().Add(time.Duration(i) * time.Hour),
			activity: activities[i%len(activities)],
		}
	}
	return entries
}
