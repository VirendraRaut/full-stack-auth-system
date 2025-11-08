"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User, LogOut, RefreshCw, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/me");
      // console.log(res);
      console.log(res.data);
      setData(res.data.data._id);
      toast.success("User details loaded");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-indigo-600 p-4 rounded-2xl">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-500">Manage your account settings</p>
          </div>

          {/* User ID Section */}
          <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <User className="w-4 h-4" />
              <span>User ID</span>
            </div>

            {data === "nothing" ? (
              <div className="text-gray-400 italic">
                Click "Load User Details" to view your ID
              </div>
            ) : (
              <Link
                href={`/profile/${data}`}
                className="group flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors break-all"
              >
                <span className="font-mono text-sm bg-white px-3 py-2 rounded-lg border border-indigo-200 group-hover:border-indigo-300 transition-colors">
                  {data}
                </span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={getUserDetails}
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Load User Details
                </>
              )}
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
