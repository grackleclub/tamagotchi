export function usage() {
    const totalBytes = new Blob(Object.values(localStorage)).size; // Calculate total size of all stored data
    const maxBytes = 5242880; // Approximate max capacity of localStorage (5 MB in bytes)
    const percentageUsed = (totalBytes / maxBytes) * 100;

    console.log(`LocalStorage Usage: ${totalBytes} bytes (${percentageUsed.toFixed(2)}% of capacity)`);
    return percentageUsed.toFixed(2); // Return the percentage as a string with 2 decimal places
}
  