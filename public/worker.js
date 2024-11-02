/* eslint-disable no-restricted-globals */

// worker.js
self.addEventListener("message", (e) => {
  console.log("Worker received command:", e.data.command); // Log the received command

  if (e.data.command === "sum") {
    let sum = 0;
    // Calculate the sum of numbers from 0 to 1000000000
    for (let i = 0; i < 1000000000; i++) {
      sum += i;
    }

    console.log("Worker computed sum:", sum); // Log the computed sum
    // Send the result back to the main thread
    self.postMessage({ result: sum });
  } else {
    console.error("Unknown command received:", e.data.command); // Log an error for unknown commands
  }
});
