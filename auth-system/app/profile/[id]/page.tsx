"use client";
import { User, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UserProfile({ params }: any) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(params.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-3xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Back Button */}
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-indigo-600 p-4 rounded-2xl">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-500">Viewing user details</p>
          </div>

          {/* User ID Section */}
          <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <User className="w-4 h-4" />
                <span>User ID</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-orange-200">
              <p className="font-mono text-lg text-gray-800 break-all">
                {params.id}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>This is your unique user identifier</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">Active</div>
              <div className="text-sm text-gray-600 mt-1">Account Status</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">Verified</div>
              <div className="text-sm text-gray-600 mt-1">Email Status</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">Premium</div>
              <div className="text-sm text-gray-600 mt-1">Membership</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}