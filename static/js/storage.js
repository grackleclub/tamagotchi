import { DEBUG } from "./config.js";

const defaultPath = "/static/json/defaults.json";

export function usage() {
    const totalBytes = new Blob(Object.values(localStorage)).size;
    const maxBytes = 5242880;
    const percentageUsed = (totalBytes / maxBytes) * 100;
    if (DEBUG) console.log(`localStorage usage calculated: ${totalBytes} bytes (${percentageUsed.toFixed(2)}% of capacity)`);
    return percentageUsed.toFixed(2); // Return the percentage as a string with 2 decimal places
}

export function fetchDefaults() {
    fetch(defaultPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch defaults at ${defaultPath}: ${response.status} ${response.statusText}`);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            if (data) {
                // TODO add each item to localStorage if len(logs) > 0 (first time user)
                // TODO don't use defaults
                localStorage.setItem("defaults", JSON.stringify(data));
                if (DEBUG) console.log("Defaults successfully fetched and stored in localStorage:", data);
            } else {
                throw new Error("Invalid JSON structure: Expected a non-empty array.");
            }
        })
        .catch(error => {
            console.error("Error fetching or processing defaults.json:", error);
        });
}
