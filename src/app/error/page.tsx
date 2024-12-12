"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const getErrorMessage = () => {
        switch (error) {
            case "Configuration":
                return "There is a problem with the server configuration. Please contact support.";
            case "AccessDenied":
                return "You do not have permission to sign in.";
            case "Verification":
                return "Email verification failed. Please try again.";
            case "OAuthCallback":
                return "OAuth callback failed. Please try again.";
            default:
                return "An unexpected error occurred. Please try again.";
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 px-4 sm:px-6">
            <h1 className="text-4xl font-bold mb-6 dark:text-white text-center">Oops!</h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 text-center">
                {getErrorMessage()}
            </p>
            <div className="space-y-4">
                <Link
                    href="/"
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded shadow-md hover:bg-blue-600 transition-all text-center"
                >
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
}
