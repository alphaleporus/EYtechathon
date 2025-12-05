import React, {useState} from 'react';
import {Mail, Lock, ArrowLeft, AlertCircle} from 'lucide-react';
import {Input} from './ui/input';
import {Button} from './ui/button';
import {authService} from '../utils/auth';

interface LoginPageProps {
    onLogin: () => void;
    onBack: () => void;
    onRegister: () => void;
}

export function LoginPage({onLogin, onBack, onRegister}: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({email, password});
            onLogin();
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1976D2 0%, #0d47a1 100%)'
            }}
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-white/80 transition-colors z-10"
            >
                <ArrowLeft size={20}/>
                <span>Back to Home</span>
            </button>

            <div
                className="relative bg-white rounded-2xl p-12 w-full max-w-[440px] hover:shadow-2xl transition-shadow duration-300"
                style={{boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'}}>
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div
                        className="w-20 h-20 bg-gradient-to-br from-[#1976D2] to-[#0d47a1] rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                            <path d="M16 4L4 10V14C4 21 8.8 27.4 16 28C23.2 27.4 28 21 28 14V10L16 4Z" fill="white"/>
                            <path d="M14 20L10 16L11.4 14.6L14 17.2L20.6 10.6L22 12L14 20Z" fill="#1976D2"/>
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-[#757575]">Sign in to access Provider Validator</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 flex items-start gap-2">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5"/>
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        label="Email Address"
                        icon={<Mail size={20}/>}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Enter your password"
                        label="Password"
                        icon={<Lock size={20}/>}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex justify-end">
                        <a href="#" className="text-sm text-[#1976D2] hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <Button type="submit" className="w-full mt-2 h-[48px]" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-[#757575] mt-8">
                    Don't have an account?{' '}
                    <button type="button" onClick={onRegister} className="text-[#1976D2] hover:underline">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
}
