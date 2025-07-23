import React, { useState, useEffect, useRef } from 'react';
import { Send, BookOpen, MessageCircle, AlertCircle, Loader2, Search, FileText, HelpCircle } from 'lucide-react';

const ConstitutionQA = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [error, setError] = useState(null);
  const [showSources, setShowSources] = useState({});
  const messagesEndRef = useRef(null);

  // Sample questions for demonstration
  const sampleQuestions = [
    "What are the fundamental rights in the Constitution?",
    "What rights do I have as a Kenyan citizen?",
    "How is the President elected?",
    "What is the structure of Parliament?",
    "What are the functions of the Judiciary?",
    "What are my rights if I'm arrested?",
    "How can the Constitution be amended?",
    "What are the duties of citizens?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate system initialization
  useEffect(() => {
    const initializeSystem = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to initialize the QA system
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSystemReady(true);
        setMessages([{
          type: 'system',
          content: 'Constitution QA System is ready! Ask me anything about the Constitution of Kenya.',
          timestamp: new Date()
        }]);
      } catch (err) {
        setError('Failed to initialize the QA system');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSystem();
  }, []);

  // Simulate API call to the backend
  const askQuestion = async (question) => {
    try {
      // In a real implementation, this would be a fetch call to your FastAPI backend
      // const response = await fetch('/api/ask', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ question })
      // });
      // const data = await response.json();

      // Simulated response for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponses = {
        "fundamental rights": {
          answer: "The Constitution of Kenya guarantees fundamental rights and freedoms in Chapter Four (Bill of Rights). These include the right to life, liberty and security, freedom of expression, association, and assembly, right to privacy, right to property, and the right to a fair trial. Every person has inherent dignity and the right to have that dignity respected and protected.",
          sources: [
            {
              page: 15,
              content: "Every person has inherent dignity and the right to have that dignity respected and protected. The State shall not deny a person the emergency medical treatment...",
              document: "TheConstitutionOfKenya.pdf"
            },
            {
              page: 18,
              content: "Every person has the right to life. A person shall not be deprived of life intentionally, except to the extent authorised by this Constitution or other written law...",
              document: "TheConstitutionOfKenya.pdf"
            }
          ]
        },
        "default": {
          answer: "Based on the Constitution of Kenya, this topic is covered in detail. The Constitution provides comprehensive guidance on governance structures, citizen rights, and legal procedures. Please refer to the relevant chapters for specific provisions.",
          sources: [
            {
              page: 1,
              content: "This Constitution is the supreme law of the Republic and binds all persons and all State organs at both levels of government...",
              document: "TheConstitutionOfKenya.pdf"
            }
          ]
        }
      };

      const key = Object.keys(mockResponses).find(k => 
        question.toLowerCase().includes(k) && k !== 'default'
      ) || 'default';

      return mockResponses[key];
    } catch (error) {
      throw new Error('Failed to get response from the server');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askQuestion(inputMessage);
      
      const botMessage = {
        type: 'bot',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
        id: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (question) => {
    setInputMessage(question);
  };

  const toggleSources = (messageId) => {
    setShowSources(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isSystemReady && isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">Initializing Constitution QA System...</h2>
          <p className="text-gray-500">Loading vector store and language model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">System Error</h2>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Constitution QA System</h1>
              <p className="text-sm text-gray-600">Ask questions about the Constitution of Kenya</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Sample Questions */}
        {messages.length <= 1 && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Try asking about:</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQuestion(question)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start space-x-2">
                    <Search className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white rounded-xl shadow-sm mb-6 max-h-96 overflow-y-auto">
          <div className="p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-900'
                } rounded-lg p-4 space-y-2`}>
                  
                  {message.type !== 'user' && (
                    <div className="flex items-center space-x-2 mb-2">
                      {message.type === 'system' ? (
                        <BookOpen className="h-4 w-4" />
                      ) : message.type === 'error' ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <MessageCircle className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium">
                        {message.type === 'system' ? 'System' : 
                         message.type === 'error' ? 'Error' : 'Constitution AI'}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => toggleSources(message.id)}
                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="h-4 w-4" />
                        <span>
                          {showSources[message.id] ? 'Hide' : 'Show'} {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
                        </span>
                      </button>
                      
                      {showSources[message.id] && (
                        <div className="mt-3 space-y-2">
                          {message.sources.map((source, sourceIndex) => (
                            <div key={sourceIndex} className="bg-white p-3 rounded border text-sm">
                              <div className="font-medium text-gray-900 mb-1">
                                Page {source.page} - {source.document}
                              </div>
                              <div className="text-gray-700">
                                {source.content.length > 200 
                                  ? `${source.content.substring(0, 200)}...` 
                                  : source.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-2">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-gray-600">Searching the Constitution...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question about the Constitution of Kenya..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionQA;