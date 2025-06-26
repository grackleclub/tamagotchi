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
        .then(handleResponce)
        .then(processDefaults)
        .catch(handleFetchError);
}

function handleResponce(response) {
    if (!response.ok) {
        throw new Error(`Failed to fetch defaults at ${defaultPath}: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function processDefaults(data) {
    if (!data) {
      throw new Error("Invalid JSON structure: Expected non-empty object.");
    }
    localStorage.setItem("defaults", JSON.stringify(data));
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    if (logs.length === 0) {
        if (data.activities) {
            localStorage.setItem("activities", JSON.stringify(Object.values(data.activities)));
        }
        if (data.categories) {
            localStorage.setItem("categories", JSON.stringify(data.categories));
        }
        if (DEBUG) console.log("Defaults loaded for first-time user:", data);
    } else if (DEBUG) {
        console.log("Logs in place, not overwriting with defaults:");
    }
    if (DEBUG) console.log("Defaults processed and stored in localStorage:", data);
}

function handleFetchError(error) {
    console.error("Error fetching or processing defaults:", error);
}