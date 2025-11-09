import { User, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";

export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ unwrap the Promise

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-indigo-600 p-4 rounded-2xl">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-500">User ID: {id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
