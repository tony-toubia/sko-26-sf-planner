import { useState, useRef } from 'react';
import { Send, Upload, Sparkles, HelpCircle, Target, TrendingUp } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in real implementation, this would call an API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thanks for sharing that context. Based on what you've described, here's my analysis:

**Current Assessment:**
Your client appears to be at **Maturity Level 2 (Adopting)** - they're taking early successes and beginning to adopt new capabilities.

**Recommended Next Steps:**
1. **Build Baseline Subscriber Journeys** - Establish welcome, birthday, and re-engagement automations
2. **Scale Dynamic Content** - Move from static emails to personalized content
3. **Einstein Engagement Scoring** - Start leveraging AI to optimize engagement

**Key Questions to Explore:**
- Do they have purchase data integrated into their marketing platform?
- What channels are they currently using beyond email?
- How sophisticated is their current segmentation?

Would you like me to dive deeper into any of these recommendations?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `[Uploaded file: ${file.name}]`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Simulate processing
      setIsLoading(true);
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I've received "${file.name}". Let me analyze this document...

**Document Summary:**
This appears to be meeting notes discussing the client's current marketing capabilities and challenges.

**Key Insights Identified:**
• Client currently using batch email campaigns
• No journey automation in place
• Basic segmentation (demographic only)
• Interest in Einstein features but unclear on requirements

**Maturity Assessment: Level 1-2 (Siloed to Adopting)**

Based on this analysis, I recommend starting with **Phase 1: Unlock New Capabilities** by ensuring proper platform migration and data integrations are in place.

Would you like me to create a detailed roadmap for this client?`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-merkle-blue to-merkle-teal">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Maturity Assessment Assistant</h2>
            <p className="text-sm text-white/80">
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
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.md"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
            title="Upload document"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your client's situation or ask a question..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-merkle-blue focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-5 py-2.5 bg-merkle-blue text-white rounded-lg hover:bg-merkle-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
