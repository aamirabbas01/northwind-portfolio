'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Critical step: Print a message to see if the button click works
    console.log("Form submission started with:", email);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response data payload:", data);

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      // 1. Save only light metadata strings to localStorage for your sidebar component
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      if (data.profilePicture) {
        localStorage.setItem('profilePicture', data.profilePicture);
      } else {
        localStorage.removeItem('profilePicture');
      }

      // 2. ✅ SAVE ONLY THE COMPACT TOKEN INTO THE COOKIE 
      // This is now under 4KB (no picture inside), so Chrome will accept it perfectly!
      document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax;`;

      console.log("Token & Cookies Synced Successfully");

      // 3. Force page location transition
      window.location.href = '/Dashboard';


    } catch (err: unknown) {
      // Print to the browser console to see exactly why it's breaking
      console.error("Caught login form execution error:", err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during sign in.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo / Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            <b>Northwind</b>
          </Link>
        </div>

        {/* Card Box */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
            Sign in to start your session
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full px-4 py-2.5 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-2.5 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  name="remember"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Remember Me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </div>
          </form>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Footer Links */}
          <div className="mt-6 text-sm space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
            <p>
              <Link href="#" className="text-blue-600 hover:underline">
                I forgot my password
              </Link>
            </p>
            <p>
              <Link href="/Register" className="text-blue-600 hover:underline">
                Register a new membership
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
