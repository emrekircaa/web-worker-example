import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(0);
  const [isNormalSumming, setIsNormalSumming] = useState(false);
  const [isWorkerSumming, setIsWorkerSumming] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    // Create a new worker
    const newWorker = new Worker("worker.js");

    // Set up the onmessage listener
    newWorker.onmessage = (e) => {
      console.log("Worker response received:", e.data); // Log the received response
      // setWorkerSum(e.data.result);
      setIsWorkerSumming(false);
    };

    // Log any errors from the worker
    newWorker.onerror = (error) => {
      console.error("Worker error:", error);
      setIsWorkerSumming(false);
    };

    // Save the worker instance
    setWorker(newWorker);

    // Clean up the worker on component unmount
    return () => {
      newWorker.terminate();
    };
  }, []);

  const handleNormalSum = () => {
    setIsNormalSumming(true); // Set to true immediately
    setTimeout(() => {
      let sum = 0;
      for (let i = 0; i < 1000000000; i++) {
        sum += i;
      }
      console.log("Normal sum:", sum); // Log the sum
      // setNormalSum(sum); // Optional: Store the sum if needed
      setIsNormalSumming(false); // Set to false after computation
    }, 0); // Schedule the computation for the next event loop tick
  };

  const handleWorkerSum = () => {
    if (worker) {
      setIsWorkerSumming(true);
      console.log("Sending command to worker..."); // Log the command being sent
      worker.postMessage({ command: "sum" });
    } else {
      console.error("Worker is not initialized."); // Log if the worker is not ready
    }
  };

  return (
    <div className="container">
      <div className="button-container">
        <div className="button-row">
          <button onClick={handleNormalSum} disabled={isNormalSumming}>
            {isNormalSumming ? "Summing..." : "Normal Sum"}
          </button>
          <button
            onClick={handleWorkerSum}
            disabled={isWorkerSumming || !worker}
          >
            {isWorkerSumming ? "Summing..." : "Worker Sum"}
          </button>
        </div>
        <button
          onClick={() => setCount((c) => c + 1)}
          disabled={isNormalSumming}
        >
          Count: {count}
        </button>

        <p className="footer-text">
          Notice how the count button is disabled during normal sum but not
          during worker sum.
        </p>
      </div>
    </div>
  );
}
