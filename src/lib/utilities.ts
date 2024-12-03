export const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pattern for email validation
export const passwordRegexPattern: RegExp =
  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}/; // Regex pattern for password validation

const timestamp = Date.now(); // Get the current timestamp in milliseconds
const date = new Date(timestamp); // Create a Date object using the timestamp

// Extract the date components
const year = date.getFullYear();
const month = date.getMonth() + 1; // Months are 0-indexed
const day = date.getDate();
const hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();

// Format the date as a string (e.g., "DD-MM-YYYY")
export const formattedDate = `${day.toString().padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year}`;

// Format the time as a string (e.g., "HH-MM-SS")
export const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
