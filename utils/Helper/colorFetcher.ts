export const colorFetcher = (type: string) => {
  if (type == "Story") {
    return "#86efac";
  } else if (type == "Task") {
    return "#93c5fd";
  } else {
    return "#fca5a5";
  }
};
