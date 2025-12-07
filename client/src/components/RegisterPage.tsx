import React, {useState} from 'react';
import {ArrowLeft, AlertCircle} from 'lucide-react';
import {Input} from './ui/input';
import {Button} from './ui/button';
import {authService} from '../utils/auth';

interface RegisterPageProps {
    onRegister: () => void;
    onBackToLogin: () => void;
}

export function RegisterPage({onRegister, onBackToLogin}: RegisterPageProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authService.register({name: name.trim(), email: email.trim(), password});
            onRegister();
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
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
                onClick={onBackToLogin}
                className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-white/80 transition-colors z-10"
            >
                <ArrowLeft size={20}/>
                <span>Back to Login</span>
            </button>

            <div
                className="relative bg-white rounded-2xl p-12 w-full max-w-[440px] hover:shadow-2xl transition-shadow duration-300"
                style={{boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'}}>
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img 
                        src="/logo.png" 
                        alt="Clarity Logo" 
                        className="h-24 w-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                    <p className="text-[#757575]">Sign up to start using Clarity</p>
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
                        type="text"
                        placeholder="Enter your full name"
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <Input
                        type="email"
                        placeholder="Enter your email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Min. 6 characters"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Re-enter your password"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full mt-2 h-[48px]" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-[#757575] mt-8">
                    Already have an account?{' '}
                    <button type="button" onClick={onBackToLogin} className="text-[#1976D2] hover:underline">
                        Sign in here
                    </button>
                </p>
            </div>
        </div>
    );
}
