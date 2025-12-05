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

function App() {
    const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'app'>('landing');
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);

    // Check if user is already authenticated - ONLY on mount
    useEffect(() => {
        console.log('App mounted, checking authentication...');
        if (authService.isAuthenticated()) {
            console.log('User is authenticated, showing app');
            setCurrentView('app');
        } else {
            console.log('User is not authenticated, showing landing page');
            setCurrentView('landing');
        }
    }, []); // Empty dependency array - only run once on mount

    const handleGetStarted = () => {
        console.log('Get started clicked');
        setCurrentView('login');
    };

    const handleBackToLanding = () => {
        console.log('Back to landing clicked');
        setCurrentView('landing');
    };

    const handleShowRegister = () => {
        console.log('Show register clicked');
        setCurrentView('register');
    };

    const handleBackToLogin = () => {
        console.log('Back to login clicked');
        setCurrentView('login');
    };

    const handleLogin = () => {
        console.log('Login successful, transitioning to app');
        setCurrentView('app');
        setCurrentPage('dashboard');
    };

    const handleRegister = () => {
        console.log('Registration successful, transitioning to app');
        setCurrentView('app');
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        console.log('Logout clicked');
        authService.logout();
        setCurrentView('landing');
        setCurrentPage('dashboard');
    };

    const handleNavigate = (page: string) => {
        console.log('Navigate to:', page);
        setCurrentPage(page);
    };

    const handleAddProvider = () => {
        console.log('Add provider clicked');
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

    console.log('Rendering App with view:', currentView);

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
