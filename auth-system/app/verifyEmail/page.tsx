"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) throw new Error("Verification failed");
      
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Email Verification
            </h1>
            <p className="text-gray-500 text-sm">
              Please wait while we verify your email address
            </p>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            {/* Loading State */}
            {loading && !verified && !error && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Verifying your email...</p>
              </div>
            )}

            {/* Success State */}
            {verified && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Email Verified!
                  </h2>
                  <p className="text-gray-600">
                    Your email has been successfully verified
                  </p>
                </div>
                <Link
                  href="/login"
                  className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 text-center block"
                >
                  Continue to Login
                </Link>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="w-16 h-16 text-red-600" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Verification Failed
                  </h2>
                  <p className="text-gray-600">
                    We couldn't verify your email. The link may be invalid or expired.
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full mt-4 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Token State */}
            {!loading && !token && !verified && !error && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Mail className="w-16 h-16 text-yellow-600" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    No Verification Token
                  </h2>
                  <p className="text-gray-600">
                    Please use the verification link sent to your email
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Token Display (for debugging) */}
          {token && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 text-center font-mono truncate">
                Token: {token}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}