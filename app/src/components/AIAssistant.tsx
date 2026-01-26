import { useState, useRef, useCallback } from 'react';
import { Send, Upload, Sparkles, HelpCircle, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  {
    icon: Target,
    title: 'Assess Current State',
    prompt: 'Help me assess where my client currently stands on the maturity scale. They have basic email campaigns but no journey automation.',
  },
  {
    icon: TrendingUp,
    title: 'Plan Next Steps',
    prompt: 'My client is at maturity level 2. What capabilities should they prioritize next?',
  },
  {
    icon: HelpCircle,
    title: 'Explain a Capability',
    prompt: 'Explain what Einstein Engagement Scoring does and when a client should implement it.',
  },
];

export function AIAssistant() {
  const { selectedIndustry, assessment } = useAssessment();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your Maturity Assessment Assistant. I can help you:

• **Assess client maturity** - Share meeting notes, current capabilities, or describe their situation
• **Plan the roadmap** - Identify which capabilities to implement next based on current state
• **Explain capabilities** - Understand what each capability does and why it matters
• **Build business cases** - Articulate the value of specific capabilities to clients

You can also upload meeting notes or documents for me to analyze.

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendToAPI = useCallback(async (userContent: string, allMessages: Message[]) => {
    try {
      // Build message history for API (exclude initial assistant greeting)
      const apiMessages = allMessages
        .slice(1) // Skip initial greeting
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      // Add the new user message
      apiMessages.push({ role: 'user' as const, content: userContent });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          industry: selectedIndustry,
          marketingFoundation: assessment?.marketingFoundation,
          currentMaturityLevel: assessment?.globalInputs?.clientContext?.currentMarketingMaturity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      console.error('Chat API error:', err);
      throw err;
    }
  }, [selectedIndustry, assessment]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const currentMessages = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendToAPI(input, currentMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
      // Provide a fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment.

In the meantime, here are some general guidelines:

• **For maturity assessment**: Consider the client's current capabilities across Data & Identity, Journeys, Content & Channels, and Intelligence tracks
• **For next steps**: Focus on foundational capabilities before advancing to more sophisticated features
• **For capability explanations**: Each capability builds on prerequisites and enables specific business outcomes

Would you like to try your question again?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Read the file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target?.result as string;

        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `[Uploaded file: ${file.name}]\n\nContent:\n${fileContent.slice(0, 5000)}${fileContent.length > 5000 ? '\n...(truncated)' : ''}`,
          timestamp: new Date(),
        };

        const currentMessages = [...messages];
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
          const responseText = await sendToAPI(
            `Please analyze this document and provide insights about the client's current marketing maturity, capabilities, and recommended next steps:\n\n${fileContent.slice(0, 5000)}`,
            currentMessages
          );

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseText,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to analyze file');
          const fallbackMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I've received "${file.name}" but I'm having trouble connecting to the AI service to analyze it. Please try again in a moment.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, fallbackMessage]);
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-merkle-blue to-merkle-teal flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-white truncate">Maturity Assessment Assistant</h2>
            <p className="text-xs sm:text-sm text-white/80 truncate">
              Analyze client situations and plan capability roadmaps
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-merkle-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-2xl rounded-xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-merkle-blue text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line.startsWith('**') && line.endsWith('**') ? (
                      <strong>{line.slice(2, -2)}</strong>
                    ) : line.startsWith('• ') ? (
                      <span className="flex gap-2">
                        <span>•</span>
                        <span>{line.slice(2)}</span>
                      </span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-merkle-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts (shown when few messages) */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-500 mb-3">Suggested prompts:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SUGGESTED_PROMPTS.map((item, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(item.prompt)}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-merkle-blue hover:bg-merkle-blue/5 transition-colors text-left"
              >
                <item.icon className="w-5 h-5 text-merkle-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex gap-2 sm:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.md"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
            title="Upload document"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-amber-500 hover:text-amber-700"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
