import React, {useState, useEffect} from 'react';
import {LandingPage} from './components/LandingPage';
import {LoginPage} from './components/LoginPage';
import {RegisterPage} from './components/RegisterPage';
import {Layout} from './components/Layout';
import {Dashboard} from './components/Dashboard';
import {Providers} from './components/Providers';
import {FileValidation} from './components/FileValidation';
import {AuditLogs} from './components/AuditLogs';
import {AddProviderModal} from './components/AddProviderModal';
import {authService} from './utils/auth';
import {Toaster} from 'react-hot-toast';

function App() {
    const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'app'>('landing');
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);

    // Check if user is already authenticated - ONLY on mount
    useEffect(() => {
        if (authService.isAuthenticated()) {
            setCurrentView('app');
        } else {
            setCurrentView('landing');
        }
    }, []); // Empty dependency array - only run once on mount

    const handleGetStarted = () => {
        setCurrentView('login');
    };

    const handleBackToLanding = () => {
        setCurrentView('landing');
    };

    const handleShowRegister = () => {
        setCurrentView('register');
    };

    const handleBackToLogin = () => {
        setCurrentView('login');
    };

    const handleLogin = () => {
        setCurrentView('app');
        setCurrentPage('dashboard');
    };

    const handleRegister = () => {
        setCurrentView('app');
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentView('landing');
        setCurrentPage('dashboard');
    };

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };

    const handleAddProvider = () => {
        setIsAddProviderModalOpen(true);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard/>;
            case 'providers':
                return <Providers onAddProvider={handleAddProvider}/>;
            case 'validation':
                return <FileValidation/>;
            case 'audit':
                return <AuditLogs/>;
            default:
                return <Dashboard/>;
        }
    };

    if (currentView === 'landing') {
        return <LandingPage onGetStarted={handleGetStarted}/>;
    }

    if (currentView === 'login') {
        return (
            <LoginPage
                onLogin={handleLogin}
                onBack={handleBackToLanding}
                onRegister={handleShowRegister}
            />
        );
    }

    if (currentView === 'register') {
        return (
            <RegisterPage
                onRegister={handleRegister}
                onBackToLogin={handleBackToLogin}
            />
        );
    }

    // App view
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#212121',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#43A047',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#E53935',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <Layout
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            >
                {renderPage()}
            </Layout>

            <AddProviderModal
                isOpen={isAddProviderModalOpen}
                onClose={() => setIsAddProviderModalOpen(false)}
            />
        </>
    );
}

export default App;
