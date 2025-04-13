export function logCreate() {
    event.preventDefault();
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    const activityName = document.getElementById("logItem").value.trim();
    console.log(`logging activity: ${activityName}`);
    logs.push(
        {
            activity: activityName,
            date: new Date().toISOString(),
        }
    )
    localStorage.setItem("log", JSON.stringify(logs));
    document.getElementById("logCreate").reset();
}

export function logList() {
    console.log("Displaying log entries...");
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    console.log(logs);
}

export function logDelete() {
    console.log("Deleting log entry...");
    // TODO delete any "expired" log entries when storage is low
    // and alert user if exceeing storage limit with non-expired activities
}

export function logInterpret() {
    console.log("Interpreting log entries...");
    // TODO interpret log entries and display results
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    for (let log of logs) {
        console.log(`Activity: ${log.activity}, Date: ${log.date}`);
    }
}