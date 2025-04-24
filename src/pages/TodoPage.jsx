import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("todoTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    const dueDate = newTaskDueDate || today;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: newTaskPriority,
      dueDate: dueDate,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setNewTaskPriority("Medium");
    setNewTaskDueDate("");
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

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Filter tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Get counts for summary
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High" && !task.completed
  ).length;

  // Check if any tasks are overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter((task) => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  return (
    <div className="min-h-screen bg-[#2C3E50] flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Todo Manager</h1>
          </div>

          <div className="p-6">
            {/* Task Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-500">
                  {completedTasks}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-red-500">
                  {highPriorityTasks}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {overdueTasks}
                </p>
              </motion.div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />

                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Task
                </motion.button>
              </div>
            </form>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === "all"
                      ? "bg-[#1ABC9C] text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === "active"
                      ? "bg-[#1ABC9C] text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === "completed"
                      ? "bg-[#1ABC9C] text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Completed
                </button>
              </div>

              <div className="flex w-full md:w-auto">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {tasks.some((task) => task.completed) && (
                  <button
                    onClick={clearCompletedTasks}
                    className="ml-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Clear Completed
                  </button>
                )}
              </div>
            </div>

            {/* Task List */}
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task) => {
                    // Check if task is overdue
                    const taskDate = new Date(task.dueDate);
                    taskDate.setHours(0, 0, 0, 0);
                    const isOverdue = !task.completed && taskDate < today;

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        layout
                        className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
                          task.completed
                            ? "border-green-500 opacity-80"
                            : isOverdue
                            ? "border-yellow-500"
                            : task.priority === "High"
                            ? "border-red-500"
                            : task.priority === "Medium"
                            ? "border-blue-500"
                            : "border-gray-500"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="pt-1">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(task.id)}
                                className="h-5 w-5 rounded border-gray-600 text-[#1ABC9C] focus:ring-[#1ABC9C]"
                              />
                            </div>
                            <div>
                              <h3
                                className={`font-medium ${
                                  task.completed
                                    ? "line-through text-gray-400"
                                    : "text-white"
                                }`}
                              >
                                {task.text}
                              </h3>
                              <div className="flex flex-wrap items-center mt-2 space-x-3 text-xs">
                                <span
                                  className={`px-2 py-1 rounded-full ${
                                    task.priority === "High"
                                      ? "bg-red-500/20 text-red-200"
                                      : task.priority === "Medium"
                                      ? "bg-blue-500/20 text-blue-200"
                                      : "bg-gray-500/20 text-gray-200"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                                <span
                                  className={`${
                                    isOverdue
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  Due: {task.dueDate}
                                  {isOverdue && " (Overdue)"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">
                  {searchQuery
                    ? "No matching tasks found"
                    : filter === "completed"
                    ? "No completed tasks yet"
                    : filter === "active"
                    ? "No active tasks - time to add some!"
                    : "Your todo list is empty"}
                </h3>
                <p className="text-gray-400 max-w-sm">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Add a new task to get started with your productivity journey"}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Floating action button for mobile */}
      <div className="md:hidden fixed bottom-8 right-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#1ABC9C] text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          onClick={() => document.querySelector('input[type="text"]').focus()}
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

export default TodoPage;
