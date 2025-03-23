package main

import (
	"net/http"
)

func handleRoot(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/html/index.html")
}
