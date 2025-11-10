"use client";
import React, { useState } from "react";

const ResetPasswordPage = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const res = await fetch("/api/users/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "send_otp" }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) setStep(2);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const res = await fetch("/api/users/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, action: "verify_otp" }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) setStep(3);
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/users/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, action: "reset_password" }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setTimeout(() => {
          setStep(1);
          setEmail("");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        }, 2500);
      }
    } catch (error) {
      setMessage("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP sent to {email}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Didn’t get OTP?{" "}
              <span
                onClick={() => setStep(1)}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Resend
              </span>
            </p>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
