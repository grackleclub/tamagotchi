package main

import (
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

func main() {
	port, ok := os.LookupEnv(fmt.Sprintf(
		"%s_PORT", strings.ToUpper(serviceName),
	))
	if !ok {
		port = defaultPort
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", handleRoot)
	slog.Info("listen and serve", "address", fmt.Sprintf("http://localhost:%s", port))
	http.ListenAndServe(fmt.Sprintf(":%s", port), mux)
}
