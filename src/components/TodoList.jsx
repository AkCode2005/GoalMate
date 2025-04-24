import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processingVoice, setProcessingVoice] = useState(false);

  const recognitionRef = useRef(null);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  // New state for voice status messages
  const [voiceStatus, setVoiceStatus] = useState("");
  const [error, setError] = useState(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        setVoiceStatus("Listening...");
      };

      recognitionRef.current.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript;
        console.log("Transcript:", transcriptText);
        setTranscript(transcriptText);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) {
          console.log("Processing transcript:", transcript);
          processVoiceCommand(transcript);
        } else {
          setVoiceStatus("No speech detected. Try again.");
          setTimeout(() => setVoiceStatus(""), 3000);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setError(`Speech recognition error: ${event.error}`);
        setTimeout(() => setError(null), 5000);
      };
    } else {
      setError("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    setTranscript("");

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            setError(
              "Could not start speech recognition. Please refresh the page."
            );
          }
        }, 100);
      }
    }
  };

  const processVoiceCommand = async (command) => {
    console.log("Processing command:", command);
    setProcessingVoice(true);
    setVoiceStatus(`Processing: "${command}"`);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [
              {
                role: "system",
                content:
                  "You are a smart assistant for a to-do app. Convert the following user voice instruction into JSON with this format: { action: 'add' | 'complete' | 'delete', task: 'task name' }. Always extract an action and task even if you have to make an educated guess.",
              },
              { role: "user", content: command },
            ],
            temperature: 0.2,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      const content = data.choices[0].message.content;

      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      console.log("JSON match:", jsonMatch);

      if (jsonMatch) {
        try {
          const parsedAction = JSON.parse(jsonMatch[0]);
          console.log("Parsed action:", parsedAction);
          handleTaskAction(parsedAction);
        } catch (e) {
          console.error("Failed to parse JSON from response", e);
          setVoiceStatus("Could not understand the command. Please try again.");
          setTimeout(() => setVoiceStatus(""), 3000);
        }
      } else {
        console.log("No JSON found in:", content);
        setVoiceStatus("Could not understand the command. Please try again.");
        setTimeout(() => setVoiceStatus(""), 3000);
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      setVoiceStatus("Error processing voice command. Please try again.");
      setTimeout(() => setVoiceStatus(""), 3000);
    } finally {
      setProcessingVoice(false);
    }
  };

  // Enhanced action handler
  const handleTaskAction = (action) => {
    console.log("Handling action:", action);

    if (!action || !action.action || !action.task) {
      setVoiceStatus("Invalid command format. Please try again.");
      setTimeout(() => setVoiceStatus(""), 3000);
      return;
    }

    switch (action.action.toLowerCase()) {
      case "add":
        setNewTask(action.task);
        setVoiceStatus(`Added "${action.task}" to your task list.`);

        setTimeout(() => {
          if (action.task.trim()) {
            const task = {
              id: Date.now(),
              text: action.task,
              completed: false,
              date: dueDate || null,
              priority: priority,
              createdAt: new Date().toISOString(),
            };
            setTasks((prev) => [...prev, task]);
            setNewTask("");
          }
        }, 500);

        setTimeout(() => setVoiceStatus(""), 3000);
        break;

      case "complete":
        const tasksToComplete = tasks.filter((task) =>
          task.text.toLowerCase().includes(action.task.toLowerCase())
        );

        if (tasksToComplete.length > 0) {
          tasksToComplete.forEach((task) => toggleComplete(task.id));
          setVoiceStatus(`Marked "${action.task}" as completed`);
        } else {
          setVoiceStatus(`Could not find a task containing "${action.task}"`);
        }
        setTimeout(() => setVoiceStatus(""), 3000);
        break;

      case "delete":
        const tasksToDelete = tasks.filter((task) =>
          task.text.toLowerCase().includes(action.task.toLowerCase())
        );

        if (tasksToDelete.length > 0) {
          tasksToDelete.forEach((task) => deleteTask(task.id));
          setVoiceStatus(`Deleted task containing "${action.task}"`);
        } else {
          setVoiceStatus(`Could not find a task containing "${action.task}"`);
        }
        setTimeout(() => setVoiceStatus(""), 3000);
        break;

      default:
        setVoiceStatus(`Unknown action: ${action.action}`);
        setTimeout(() => setVoiceStatus(""), 3000);
    }
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      date: dueDate || null,
      priority: priority,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setDueDate("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Sort tasks: incomplete first, then by priority, then by date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by priority
    const priorityValue = { high: 3, medium: 2, low: 1 };
    if (priorityValue[a.priority] !== priorityValue[b.priority]) {
      return priorityValue[b.priority] - priorityValue[a.priority];
    }

    // Then by due date if available
    if (a.date && b.date) {
      return new Date(a.date) - new Date(b.date);
    }

    // Finally by creation date
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if date is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today && date.toDateString() !== today.toDateString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Smart Task Manager</h2>

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Add Task Form */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex mb-4 items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full p-3 bg-gray-600 rounded-lg text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="What do you need to do?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
            />
          </div>

          {/* Voice Control Button with enhanced feedback */}
          <div>
            <button
              className={`p-3 rounded-lg flex items-center justify-center transition-all relative ${
                isListening
                  ? "bg-red-600 hover:bg-red-700 animate-pulse"
                  : processingVoice
                  ? "bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={toggleListening}
              disabled={processingVoice}
              title={
                isListening ? "Listening..." : "Use voice to control tasks"
              }
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
                  d={
                    isListening
                      ? "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      : "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  }
                />
              </svg>

              {/* Small listening indicator */}
              {isListening && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Voice Feedback Display */}
        {(isListening || transcript || voiceStatus) && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              isListening
                ? "bg-gray-600 border border-red-500 animate-pulse"
                : voiceStatus
                ? "bg-gray-600 border border-blue-500"
                : "bg-gray-600"
            }`}
          >
            <p className="text-gray-200 flex items-center">
              {isListening && (
                <>
                  <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-2"></span>
                  <span>
                    Listening... Say a command like "Add buy milk" or "Complete
                    morning exercise"
                  </span>
                </>
              )}
              {!isListening && transcript && processingVoice && (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing: "{transcript}"</span>
                </>
              )}
              {!isListening && !processingVoice && voiceStatus && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
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
                  <span>{voiceStatus}</span>
                </>
              )}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              className="w-full p-2 bg-white rounded-lg text-gray-700 border border-gray-300 focus:border-blue-500 focus:outline-none"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Priority
            </label>
            <select
              className="w-full p-2 bg-white rounded-lg text-gray-700 border border-gray-300 focus:border-blue-500 focus:outline-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
              onClick={addTask}
              disabled={!newTask.trim()}
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Voice Command Help */}
        <div className="text-sm text-gray-600 mt-4 bg-blue-50 p-3 rounded border border-blue-100">
          <p className="font-medium mb-1">Voice Commands:</p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <li className="flex items-center gap-1">
              <span className="text-blue-500">•</span>
              "Add [task description]"
            </li>
            <li className="flex items-center gap-1">
              <span className="text-blue-500">•</span>
              "Complete [task description]"
            </li>
            <li className="flex items-center gap-1">
              <span className="text-blue-500">•</span>
              "Delete [task description]"
            </li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Features that make you shine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-5 rounded-lg">
            <div className="text-blue-600 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Automation</h3>
            <p className="text-gray-600">
              Automate your tasks with voice commands and AI-powered task
              management
            </p>
          </div>

          <div className="bg-purple-50 p-5 rounded-lg">
            <div className="text-purple-600 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Advanced Security</h3>
            <p className="text-gray-600">
              Your tasks are securely stored in local storage and never shared
            </p>
          </div>

          <div className="bg-green-50 p-5 rounded-lg">
            <div className="text-green-600 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Task Prioritization</h3>
            <p className="text-gray-600">
              Organize tasks by priority, due date, and completion status
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-3 px-4 ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setFilter("all")}
        >
          All Tasks
        </button>
        <button
          className={`flex-1 py-3 px-4 ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`flex-1 py-3 px-4 ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200 bg-gray-50 text-gray-800">
          Your Tasks
        </h2>

        {sortedTasks.length === 0 ? (
          <div className="text-gray-500 text-center py-12 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-300 mb-4"
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
            <p className="text-lg">
              No tasks found. Add some tasks to get started!
            </p>
            <p className="mt-2">Try using voice commands or the form above.</p>
          </div>
        ) : (
          <AnimatePresence>
            <ul className="divide-y divide-gray-200">
              {sortedTasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    task.completed ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span
                          className={`block font-medium ${
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          {task.text}
                        </span>

                        <div className="flex mt-2 flex-wrap gap-2">
                          {task.date && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                isOverdue(task.date) && !task.completed
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {isOverdue(task.date) && !task.completed
                                ? "Overdue: "
                                : ""}
                              {formatDate(task.date)}
                            </span>
                          )}

                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium
                              ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}

        {/* Task Statistics */}
        {tasks.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600 flex flex-wrap gap-3">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-blue-600"
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
                {tasks.filter((t) => !t.completed).length} remaining
              </span>

              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {tasks.filter((t) => t.completed).length} completed
              </span>

              {tasks.some(
                (t) => t.date && isOverdue(t.date) && !t.completed
              ) && (
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {
                    tasks.filter(
                      (t) => t.date && isOverdue(t.date) && !t.completed
                    ).length
                  }{" "}
                  overdue
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-8 bg-gray-50 rounded-b-lg py-6 px-8 border-t border-gray-200">
        <div className="text-center">
          <h3 className="font-bold text-xl text-gray-800 mb-4">
            The Ultimate Task Management Solution
          </h3>
          <p className="text-gray-600 mb-4">
            Organize your tasks with voice commands, priority levels, and due
            dates
          </p>

          <button
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium transition-colors"
            onClick={toggleListening}
          >
            Try Voice Commands
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
