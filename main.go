package main

import (
	"embed"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"
)

var (
	serviceName = "tamagotchi"
	defaultPort = "8006"
)

//go:embed static
var static embed.FS

func main() {
	port, ok := os.LookupEnv(fmt.Sprintf(
		"%s_PORT", strings.ToUpper(serviceName),
	))
	if !ok {
		port = defaultPort
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", handleRoot)

	staticFileServer := http.FileServer(http.Dir("static"))
	mux.Handle("/static/", http.StripPrefix("/static/", staticFileServer))

	slog.Info("listen and serve", "address", fmt.Sprintf("http://localhost:%s", port))
	http.ListenAndServe(fmt.Sprintf(":%s", port), mux)
}
