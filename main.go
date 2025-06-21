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

//go:embed static/html/* static/css/* static/js/* static/json/*
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
	mux.Handle("/static/", handleStatic(http.FS(static)))
	slog.Info("listen and serve", "address", fmt.Sprintf("http://localhost:%s", port))
	err := http.ListenAndServe(fmt.Sprintf(":%s", port), mux)
	if err != nil {
		slog.Error("error starting server", "error", err)
	}
}
