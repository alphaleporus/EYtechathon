import React from 'react';
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = {hasError: false, error: null};
    }

    static getDerivedStateFromError(error: Error) {
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                        <div className="text-red-500 text-4xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
                        <p className="text-gray-600 mb-4">
                            We encountered an error while loading the application.
                        </p>
                        {this.state.error && (
                            <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800 overflow-auto mb-4">
                {this.state.error.message}
              </pre>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const root = createRoot(document.getElementById("root")!);
root.render(
    <ErrorBoundary>
        <App/>
    </ErrorBoundary>
);
