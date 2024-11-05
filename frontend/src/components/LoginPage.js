import React from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Bell,
  Users,
  Shield,
} from "lucide-react";

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_AUTH_SERVICE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Request Manager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
          </div>

          <div className="relative">
            <h1 className="text-4xl font-bold text-white mb-6">
              Streamline Your Workflow
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              A comprehensive request management system for leave, equipment,
              and overtime approvals
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Simple Workflow Process
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                      <span className="text-white">1</span>
                    </div>
                    <p className="text-blue-100">
                      Sign in with your Google account
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                      <span className="text-white">2</span>
                    </div>
                    <p className="text-blue-100">
                      Create and submit your request
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                      <span className="text-white">3</span>
                    </div>
                    <p className="text-blue-100">
                      Receive real-time notifications on approval status
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Key Features
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
                <Users className="h-6 w-6 text-white mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Role-Based Access
                </h4>
                <p className="text-blue-100">
                  Separate dashboards for requesters and approvers
                </p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
                <Bell className="h-6 w-6 text-white mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Email Notifications
                </h4>
                <p className="text-blue-100">
                  Instant updates on request status changes
                </p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Secure Authentication
                </h4>
                <p className="text-blue-100">
                  Google SSO integration for safe access
                </p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
                <Clock className="h-6 w-6 text-white mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Real-Time Tracking
                </h4>
                <p className="text-blue-100">
                  Monitor request status in real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Welcome to Request Manager
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Your one-stop solution for managing leave, equipment, and
                overtime requests
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Manage all types of requests in one place</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Real-time email notifications</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Secure Google authentication</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="group relative w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </span>
                Sign in with Google
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>

              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-500">
                      Secure login powered by Google
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>
                  By signing in, you agree to our{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
