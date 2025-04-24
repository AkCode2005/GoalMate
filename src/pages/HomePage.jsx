import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AIPlanner from "../components/AIPlanner";
import TodoList from "../components/TodoList";

const HomePage = () => {
  // Hardcoded tasks for today
  const todayTasks = [
    {
      id: 1,
      title: "Complete project proposal",
      time: "9:00 AM",
      status: "pending",
    },
    { id: 2, title: "Team meeting", time: "11:00 AM", status: "pending" },
    {
      id: 3,
      title: "Review documentation",
      time: "2:00 PM",
      status: "completed",
    },
    { id: 4, title: "Exercise session", time: "5:00 PM", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">
            Welcome to your dashboard - TESTING UPDATE
          </h1>
          <p className="text-gray-400 mt-2">
            Here's what's on your plate today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Today's Tasks Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-400">{task.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.status === "completed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {task.status}
                    </span>
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      className="h-5 w-5 rounded border-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Goal Progress Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Goal Progress</h2>
            <div className="space-y-6">
              {/* Project Completion */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Project Completion</span>
                  <span className="text-gray-400">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              {/* Learning Goals */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Learning Goals</span>
                  <span className="text-gray-400">40%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>

              {/* Fitness Goals */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Fitness Goals</span>
                  <span className="text-gray-400">80%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Planner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <AIPlanner />
        </motion.div>

        {/* TodoList Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <TodoList />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
