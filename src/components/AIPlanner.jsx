import { useState } from "react";

const AIPlanner = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  const handleGetAdvice = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setUserInput("");
    setError(null);

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
                content: `You are GoalMate, a friendly and thoughtful productivity assistant. When a user shares a goal (e.g., "I want to learn DSA"), respond like a helpful mentor — break it down clearly, but speak like a human, not a list generator.

                Encourage, guide, and give structure. Feel free to use small bullets or paragraphs, but keep the tone warm, motivating, and clear.

                Be specific, like ChatGPT or Claude would — give smart suggestions, ask reflective questions if needed, and personalize the tone like you're chatting with a friend who wants to get things done.

                Example:
                "Awesome! Learning DSA is a great step for cracking interviews and improving problem-solving. Here's how I'd help you structure it..."

                Some key principles to follow:
                1. Be conversational and natural - use contractions, casual language, and an enthusiastic tone
                2. Share personal-sounding perspectives ("I think", "I'd recommend")
                3. Add small encouragements throughout your response
                4. Ask thoughtful follow-up questions at the end
                5. Use emoji occasionally but not excessively 😊
                6. Make references to real-world examples when relevant`,
              },
              ...messages,
              userMessage,
            ],
            temperature: 0.7, // Higher temperature for more creative, human-like responses
            max_tokens: 1024, // Allow for longer responses
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices.length) {
        throw new Error("Invalid response from API");
      }

      const aiMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching from Groq:", error);
      setError(error.message || "Failed to get a response from the AI");
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col h-[600px]">
      <h2 className="text-xl font-semibold mb-4">AI Productivity Coach</h2>

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">👋</div>
            <h3 className="text-lg font-medium mb-2">Welcome to GoalMate</h3>
            <p className="text-gray-400 mb-4">
              I'm your AI productivity coach. How can I help you today?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <button
                onClick={() =>
                  setUserInput("How can I improve my time management?")
                }
                className="bg-gray-600 hover:bg-gray-500 rounded-lg p-2 text-left"
              >
                How can I improve my time management?
              </button>
              <button
                onClick={() => setUserInput("Help me plan my week effectively")}
                className="bg-gray-600 hover:bg-gray-500 rounded-lg p-2 text-left"
              >
                Help me plan my week effectively
              </button>
              <button
                onClick={() =>
                  setUserInput("Tips for maintaining work-life balance")
                }
                className="bg-gray-600 hover:bg-gray-500 rounded-lg p-2 text-left"
              >
                Tips for maintaining work-life balance
              </button>
              <button
                onClick={() =>
                  setUserInput("How do I stay focused on important tasks?")
                }
                className="bg-gray-600 hover:bg-gray-500 rounded-lg p-2 text-left"
              >
                How do I stay focused on important tasks?
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                    <span className="font-medium">GoalMate</span>
                  </div>
                )}
                <div
                  className="whitespace-pre-line markdown-content"
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content),
                  }}
                />
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl p-4 bg-gray-700 text-gray-100">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <span className="font-medium">GoalMate</span>
              </div>
              <div className="flex space-x-2 items-center h-6">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          className="w-full p-4 pr-14 bg-gray-700 rounded-xl text-white border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
          rows="3"
          placeholder="Ask me anything about productivity and planning..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGetAdvice();
            }
          }}
        ></textarea>
        <button
          className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          onClick={handleGetAdvice}
          disabled={loading || !userInput.trim()}
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Helper function to format the message with basic markdown-like formatting
const formatMessage = (text) => {
  if (!text) return "";

  // Convert markdown-style formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(/^# (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>') // H1
    .replace(/^## (.*$)/gm, '<h4 class="text-lg font-bold my-1">$1</h4>') // H2
    .replace(/^### (.*$)/gm, '<h5 class="font-bold my-1">$1</h5>') // H3
    .replace(
      /^\s*\n\* (.*)/gm,
      '<ul class="list-disc pl-5 my-2"><li>$1</li></ul>'
    ) // Unordered lists
    .replace(
      /^\s*\n\d\. (.*)/gm,
      '<ol class="list-decimal pl-5 my-2"><li>$1</li></ol>'
    ) // Ordered lists
    .replace(/\n/g, "<br>") // New lines
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" class="text-blue-400 hover:underline" target="_blank">$1</a>'
    ); // URLs
};

export default AIPlanner;
