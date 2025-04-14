// create a log entry and place in localStorage
export function logCreate() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/event
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
        console.log(`logged: ${log.activity} @ ${log.date}`);
    }

    const activites = JSON.parse(localStorage.getItem("activities")) || [];
    for (let activity of activites) {
        console.log(`Activity: ${activity.name}`);
        for (let category of activity.categories) {
            console.log(`  - ${category.category}: ${category.points}`);
        }
    }
}

function hoursBetween(startTimestamp, endTimestamp) {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);

    const durationMs = endDate - startDate;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    return { hours };
}
