"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

const HomePage = () => {
    const handleGoogleLogin = async (): Promise<void> => {
        await signIn("google");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 px-4 sm:px-6">
            <h1 className="text-4xl font-bold mb-6 dark:text-white text-center">
                Welcome to My Fashion App
            </h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 text-center">
                Discover the latest trends in fashion. Join us today!
            </p>
            <div className="space-y-4 w-full max-w-md">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-500 text-white px-6 py-3 rounded shadow-md hover:bg-red-600 transition-all"
                >
                    Continue with Google
                </button>
                <div className="flex justify-center items-center space-x-2">
                    <hr className="w-1/4 border-gray-400" />
                    <span className="text-gray-500 dark:text-gray-300">or</span>
                    <hr className="w-1/4 border-gray-400" />
                </div>
                <div className="flex space-x-4">
                    <Link
                        href="/register"
                        className="flex-1 bg-blue-500 text-white px-4 py-3 rounded text-center shadow-md hover:bg-blue-600 transition-all"
                    >
                        Register
                    </Link>
                    <Link
                        href="/login"
                        className="flex-1 bg-green-500 text-white px-4 py-3 rounded text-center shadow-md hover:bg-green-600 transition-all"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
