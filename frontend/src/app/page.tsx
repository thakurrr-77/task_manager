'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fadeIn">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400">
            Organize your tasks efficiently and boost your productivity
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="card p-6 space-y-3 animate-slideIn">
            <div className="text-4xl">📝</div>
            <h3 className="text-xl font-semibold">Create Tasks</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Easily create and manage your daily tasks
            </p>
          </div>
          <div className="card p-6 space-y-3 animate-slideIn" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl">✅</div>
            <h3 className="text-xl font-semibold">Track Progress</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Monitor your task completion status
            </p>
          </div>
          <div className="card p-6 space-y-3 animate-slideIn" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl">🔒</div>
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Your data is protected with JWT authentication
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link href="/register" className="btn-primary w-full sm:w-auto px-8 py-3 text-lg">
            Get Started
          </Link>
          <Link href="/login" className="btn-secondary w-full sm:w-auto px-8 py-3 text-lg">
            Sign In
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Built with</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Next.js</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Node.js</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Prisma</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">PostgreSQL</span>
          </div>
        </div>
      </div>
    </main>
  );
}
