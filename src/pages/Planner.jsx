import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Planner = () => {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [progress, setProgress] = useState(0);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Check if user has used the planner before
  useEffect(() => {
    const savedSteps = localStorage.getItem("goalSteps");
    const savedMessages = localStorage.getItem("plannerMessages");

    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
      calculateProgress(JSON.parse(savedSteps));
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
      setHasInteracted(true);
    } else {
      // Add welcome message for first-time users
      setMessages([
        {
          role: "system",
          content:
            "Welcome to your AI Action Planner! Tell me what goal you'd like to achieve, and I'll help you break it down into actionable steps.",
        },
      ]);
    }
  }, []);

  // Save steps and messages to localStorage when they change
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem("goalSteps", JSON.stringify(steps));
    }
    if (messages.length > 0) {
      localStorage.setItem("plannerMessages", JSON.stringify(messages));
    }
  }, [steps, messages]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Calculate progress based on completed steps
  const calculateProgress = (stepsList) => {
    if (!stepsList || stepsList.length === 0) return 0;
    const completedSteps = stepsList.filter((step) => step.completed).length;
    setProgress(Math.round((completedSteps / stepsList.length) * 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setHasInteracted(true);
    setIsLoading(true);
    setError(null);

    // Add user message to chat
    const userMessage = { role: "user", content: goal };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Mock API call with simulated delay
      setTimeout(() => {
        generateSteps(goal);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError("Failed to generate steps. Please try again.");
      setIsLoading(false);
    }

    setGoal("");
  };

  const generateSteps = (userGoal) => {
    // Example response simulating AI-generated steps
    const aiResponse = {
      role: "assistant",
      content: `Great goal! Here's an action plan to help you achieve: "${userGoal}"`,
    };

    // Generate mock steps based on the goal
    const goalWords = userGoal.split(" ");
    const numSteps = Math.min(Math.max(goalWords.length, 3), 8);

    const priorities = ["High", "Medium", "Low"];
    const mockSteps = Array.from({ length: numSteps }, (_, i) => ({
      id: Date.now() + i,
      title: `Step ${i + 1}: ${goalWords[i % goalWords.length]} ${
        goalWords[(i + 1) % goalWords.length]
      }`,
      description: `This step involves working on ${goalWords[
        i % goalWords.length
      ].toLowerCase()} to progress toward your goal.`,
      priority: priorities[i % priorities.length],
      dueDate: new Date(Date.now() + (i + 1) * 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      completed: false,
    }));

    setSteps(mockSteps);
    calculateProgress(mockSteps);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const toggleStepCompletion = (stepId) => {
    const updatedSteps = steps.map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    setSteps(updatedSteps);
    calculateProgress(updatedSteps);
  };

  // Example buttons for user to try
  const exampleGoals = [
    "Learn JavaScript in 2 months",
    "Train for a 5K run",
    "Start a small online business",
  ];

  return (
    <div className="min-h-screen bg-[#2C3E50] flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden min-h-[80vh] flex flex-col">
          {/* Header with title and progress */}
          <div className="bg-gray-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-3 md:mb-0">
              AI Action Planner
            </h1>

            <div className="flex items-center space-x-2 text-gray-300">
              <span>Goal Progress:</span>
              <div className="w-48 bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-[#1ABC9C] h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-grow">
            {/* Chat/Input area */}
            <div className="w-full md:w-1/2 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 p-4">
              <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto mb-4 pr-1 space-y-4"
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-3 max-w-3/4 ${
                          message.role === "user"
                            ? "bg-[#1ABC9C] text-white"
                            : "bg-gray-700 text-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-3">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Enter your goal..."
                  className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !goal.trim()}
                  className={`bg-[#1ABC9C] text-white px-4 py-2 rounded-lg transition ${
                    isLoading || !goal.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#16A085]"
                  }`}
                >
                  Send
                </button>
              </form>

              {!hasInteracted && (
                <div className="mt-4">
                  <p className="text-gray-400 mb-2 text-sm">
                    Not sure where to start? Try one of these:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exampleGoals.map((exampleGoal, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setGoal(exampleGoal);
                          inputRef.current?.focus();
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm px-3 py-1 rounded-full transition"
                      >
                        {exampleGoal}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Steps/Task list area */}
            <div className="w-full md:w-1/2 bg-gray-800 p-4 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#1ABC9C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Action Steps
              </h2>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {steps.length > 0 ? (
                <div className="space-y-3">
                  {steps.map((step) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                        step.completed
                          ? "border-green-500 opacity-75"
                          : step.priority === "High"
                          ? "border-red-500"
                          : step.priority === "Medium"
                          ? "border-yellow-500"
                          : "border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="pt-1">
                            <input
                              type="checkbox"
                              checked={step.completed}
                              onChange={() => toggleStepCompletion(step.id)}
                              className="h-5 w-5 rounded border-gray-600 text-[#1ABC9C] focus:ring-[#1ABC9C]"
                            />
                          </div>
                          <div>
                            <h3
                              className={`font-medium ${
                                step.completed
                                  ? "line-through text-gray-400"
                                  : "text-white"
                              }`}
                            >
                              {step.title}
                            </h3>
                            <p
                              className={`text-sm mt-1 ${
                                step.completed
                                  ? "text-gray-500"
                                  : "text-gray-300"
                              }`}
                            >
                              {step.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-3 text-xs">
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  step.priority === "High"
                                    ? "bg-red-500/20 text-red-200"
                                    : step.priority === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-200"
                                    : "bg-blue-500/20 text-blue-200"
                                }`}
                              >
                                {step.priority}
                              </span>
                              <span className="text-gray-400">
                                Due: {step.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-24 h-24 bg-[#1ABC9C]/10 rounded-full flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-[#1ABC9C]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200 mb-2">
                    No steps yet
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    Enter your goal in the chat and I'll help you break it down
                    into achievable steps.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating help button */}
      <div className="fixed bottom-8 right-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#1ABC9C] text-white rounded-full p-4 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

export default Planner;
