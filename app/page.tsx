'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: 'bot' | 'user'; text: string }[]>([
    { type: 'bot', text: 'Hi! I\'m SoluGrow Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'user', text: input }]);
      setInput('');
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: 'Thanks for your question! Our team will get back to you shortly.' }]);
      }, 500);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">SoluGrow</h1>
          <div className="hidden md:flex gap-8 text-base">
            <a href="#home" className="hover:text-white/80 transition">Home</a>
            <a href="#services" className="hover:text-white/80 transition">Services</a>
            <a href="#pricing" className="hover:text-white/80 transition">Pricing</a>
          </div>
          <Link href="/auth/login" className="px-4 py-2 sm:px-6 sm:py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><pattern id="gym" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="30" fill="rgba(255,255,255,0.08)"/><rect x="80" y="40" width="80" height="20" fill="rgba(255,255,255,0.06)"/><circle cx="150" cy="100" r="25" fill="rgba(255,255,255,0.07)"/><line x1="20" y1="150" x2="180" y2="150" stroke="rgba(255,255,255,0.05)" stroke-width="2"/><path d="M 70 180 Q 100 160 130 180" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/></pattern></defs><rect width="1200" height="600" fill="rgba(0,0,0,1)"/><rect width="1200" height="600" fill="url(%23gym)"/></svg>)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-2"
          >
            SoluGrow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-300 mb-6"
          >
            Gym Management Software
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-8"
          >
            Manage members, payments, trainers, attendance, and operations in one secure platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link
              href="/auth/signup"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition text-sm sm:text-base"
            >
              Get Started Free
            </Link>
            <a
              href="#pricing"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-zinc-600 text-white hover:bg-zinc-800 transition text-sm sm:text-base"
            >
              View Pricing
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">Everything Your Gym Needs</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Member Management", desc: "Add, track, and manage gym members easily." },
              { title: "Payments & Plans", desc: "Manage subscriptions, renewals, and payments." },
              { title: "Trainers & Attendance", desc: "Assign trainers and track daily attendance." },
              { title: "Reports & Analytics", desc: "Get insights into revenue and member growth." },
              { title: "Multi-Gym Support", desc: "Run multiple gyms from one dashboard." },
              { title: "Secure Login", desc: "OTP-based secure authentication system." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
              >
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">Simple Pricing</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Basic", price: "₹999 / month" },
              { name: "Pro", price: "₹1999 / month" },
              { name: "Enterprise", price: "₹2999 / month" },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-2xl p-8 bg-zinc-900 border border-zinc-800 text-center hover:border-white transition"
              >
                <h3 className="text-2xl font-semibold">{p.name}</h3>
                <p className="mt-4 text-3xl font-bold">{p.price}</p>
                <Link href="/auth/signup" className="mt-6 inline-block px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition">
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800 text-center text-zinc-400">
        © {new Date().getFullYear()} SoluGrow – Software & Automation. All rights reserved.
      </footer>

      {/* Chat Agent */}
      <motion.div
        animate={{ y: chatOpen ? 0 : 20 }}
        className="fixed bottom-8 right-8 z-50"
      >
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-20 right-0 w-80 rounded-2xl bg-black border border-zinc-700 backdrop-blur shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-white to-zinc-200 text-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <div>
                  <div className="font-semibold text-sm">SoluGrow Assistant</div>
                  <div className="text-xs opacity-80">Always here to help</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:opacity-80">
                <X size={18} />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${msg.type === 'user'
                        ? 'bg-white text-black rounded-br-none'
                        : 'bg-zinc-800 text-white rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-zinc-700 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask something..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white"
              />
              <button
                onClick={handleSendMessage}
                className="bg-white hover:bg-zinc-200 text-black p-2 rounded-lg transition"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full bg-white text-black shadow-lg shadow-white/50 flex items-center justify-center hover:shadow-white/70 transition"
        >
          {chatOpen ? <X size={24} /> : <Bot size={24} />}
        </motion.button>
      </motion.div>
    </main>
  );
}