import { DEBUG, print } from "./config.js";

const activitiesPath = "/static/json/defaultActivities.json";
const categoriesPath = "/static/json/defaultCategories.json";
const DEFAULT_MAX_BYTES = 5242880

export function usage(maxBytes = DEFAULT_MAX_BYTES) {
    const totalBytes = new Blob(Object.values(localStorage)).size;
    const percentageUsed = (totalBytes / maxBytes) * 100;
    print(`localStorage usage calculated: ${totalBytes} bytes (${percentageUsed.toFixed(2)}% of capacity)`);
    return percentageUsed.toFixed(2); 
}

export function fetchDefaults() {
    const activitiesPromise = fetch(activitiesPath)
        .then(handleResponse)
        .then(processActivities)

    const categoriesPromise = fetch(categoriesPath)
        .then(handleResponse)
        .then(processCategories)
  
        return Promise.all([activitiesPromise, categoriesPromise])
        .catch(handleFetchError);
      }

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Failed to fetch defaults at ${activitiesPath}, ${categoriesPath}: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function processActivities(data) {
    if (!data) throw new Error("Invalid activities JSON");
    localStorage.setItem("defaultActivities", JSON.stringify(data));
    const records = JSON.parse(localStorage.getItem("records")) || [];
    if (records.length === 0 && data.activities) {
        localStorage.setItem("activities", JSON.stringify(Object.values(data.activities)));
    }
  }

function processCategories(data) {
    if (!data) throw new Error("Invalid categories JSON");
    if (data.categories) {
        localStorage.setItem("categories", JSON.stringify(data.categories));
    }
  }

function handleFetchError(error) {
    console.error("Error fetching or processing defaults:", error);
}