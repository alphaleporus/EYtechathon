import React, {useEffect, useState} from 'react';
import {LayoutGrid, Users, FileCheck, FileText, LogOut} from 'lucide-react';
import {authService, User} from '../utils/auth';

interface LayoutProps {
    children: React.ReactNode;
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export function Layout({children, currentPage, onNavigate, onLogout}: LayoutProps) {
    const [user, setUser] = useState<User | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutConfirm(false);
        onLogout();
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const navItems = [
        {id: 'dashboard', label: 'Dashboard', icon: LayoutGrid},
        {id: 'providers', label: 'Providers', icon: Users},
        {id: 'validation', label: 'Data Validation', icon: FileCheck},
        {id: 'audit', label: 'Audit Logs', icon: FileText}
    ];

    return (
        <div className="flex min-h-screen bg-[#F5F5F5]">
            {/* Sidebar */}
            <aside className="w-64 bg-white h-screen sticky top-0 flex flex-col animate-slideInLeft"
                   style={{boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'}}>
                {/* Logo Header */}
                <div className="p-6 border-b border-[#E0E0E0]">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-[#1976D2] to-[#0d47a1] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md hover:scale-110 transition-transform duration-300">
                            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                                <path d="M16 4L4 10V14C4 21 8.8 27.4 16 28C23.2 27.4 28 21 28 14V10L16 4Z"
                                      fill="white"/>
                                <path d="M14 20L10 16L11.4 14.6L14 17.2L20.6 10.6L22 12L14 20Z" fill="#1976D2"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[#212121]">Provider</h3>
                            <p className="text-xs text-[#757575]">Validator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200
                  ${isActive
                                    ? 'bg-gradient-to-r from-[#E3F2FD] to-[#E3F2FD]/50 text-[#1976D2] shadow-sm scale-105'
                                    : 'text-[#757575] hover:bg-[#F5F5F5] hover:scale-105'
                                }
                `}
                            >
                                <Icon size={20}/>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-[#E0E0E0]">
                    <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                    >
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1976D2] to-[#0d47a1] flex items-center justify-center text-white shadow-md">
                            {user ? getInitials(user.name) : 'U'}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-[#757575] truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div
                        className="logout-modal bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fadeIn">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center">
                                <LogOut size={32} className="text-[#FB8C00]"/>
                            </div>
                        </div>

                        {/* Title and Message */}
                        <h3 className="text-2xl font-bold text-center mb-3 text-[#212121]">
                            Logout Confirmation
                        </h3>
                        <p className="text-center text-[#757575] mb-8">
                            Are you sure you want to logout from your account?
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelLogout}
                                className="flex-1 px-6 py-3 bg-[#F5F5F5] text-[#212121] rounded-lg font-medium hover:bg-[#E0E0E0] transition-colors"
                            >
                                No, Stay
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="flex-1 px-6 py-3 bg-[#E53935] text-white rounded-lg font-medium hover:bg-[#C62828] transition-colors"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
