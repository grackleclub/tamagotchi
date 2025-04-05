package main

import (
	"html/template"
	"log/slog"
	"net/http"
	"time"
)

type page struct {
	Activities       []Activity
	PointsByActivity map[string]int
	PointsByCategory map[category]int
}

// type health struct {}

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

		for _, category := range categories {
			cookie, err := r.Cookie(string(category))
			if err != nil {
				slog.Error("get cookie", "error", err)
				continue
			}
			slog.Info("cookie",
				"category", category,
				"value", cookie.Value,
				"expires", cookie.Expires,
			)
		}

		// TODO check the user's session or db
		entries := sampleEntries(10) // TODO remove mock
		data := newPage(entries)
		tmpl.Execute(w, data)
	case http.MethodPost:
		err := r.ParseForm()
		if err != nil {
			slog.Error("parse form", "error", err)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
		activityName := r.FormValue("activity")

		slog.Info("POST activity", "name", activityName)
		http.SetCookie(w, &http.Cookie{})

		// TODO add entry to user

		tmpl, err := template.ParseFS(static, "static/html/index.html")
		if err != nil {
			slog.Error("parse template", "error", err)
			http.Error(w, "server error", http.StatusInternalServerError)
			return
		}

		// TODO check the user's session or db
		entries := sampleEntries(10)
		data := newPage(entries)
		tmpl.Execute(w, data)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

}

func newPage(entries []entry) page {
	return page{
		Activities:       activities,
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
