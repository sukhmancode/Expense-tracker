export function formatDate(dateString:Date |  string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-us", {
        year:"numeric",
        month:"long",
        day:"numeric"
    })
}

