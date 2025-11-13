import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import { FiSend, FiUser, FiMessageSquare } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your chatbot assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = { text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Send to chatbot API
      const response = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl ">
          {/* Chat Container */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-[70vh] mt-[90px] flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3/4 rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-indigo-600 rounded-tr-none"
                          : "bg-gray-700 rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div
                          className={`p-1 rounded-full ${
                            message.sender === "user"
                              ? "bg-indigo-500"
                              : "bg-gray-600"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <FiUser className="text-white" />
                          ) : (
                            <FiMessageSquare className="text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-full bg-gray-600">
                          <FiMessageSquare className="text-white" />
                        </div>
                        <div>
                          <ImSpinner8 className="animate-spin text-indigo-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your questions...."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className={`p-3 rounded-full ${
                    isLoading || !inputText.trim()
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isLoading ? (
                    <ImSpinner8 className="animate-spin" />
                  ) : (
                    <FiSend />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <button
                onClick={() => setInputText("Explain binary search trees")}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-xs"
              >
                Explain binary search trees
              </button>
              <button
                onClick={() =>
                  setInputText("What's the time complexity of quicksort?")
                }
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-xs"
              >
                Time complexity of quicksort
              </button>
              <button
                onClick={() =>
                  setInputText("How to prepare for coding interviews?")
                }
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-xs"
              >
                Coding interview prep
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
