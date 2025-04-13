export function logCreate() {
    event.preventDefault();
    const selectedActivity = document.getElementById("logItem").value;
    console.log(`Selected activity: ${selectedActivity}`);
    // const activities = JSON.parse(localStorage.getItem("activities")) || [];
    console.log("Select Activity Form Submitted");    
}

export function logList() {
    console.log("Displaying log entries...");
}

export function logDelete() {
    console.log("Deleting log entry...");
    // TODO delete any "expired" log entries when storage is low
    // and alert user if exceeing storage limit with non-expired activities
}
