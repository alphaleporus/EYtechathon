import React from 'react';
import { Shield, CheckCircle, TrendingUp, Lock, ArrowRight, FileCheck, Users, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: 'Provider Management',
      description: 'Comprehensive healthcare provider database with advanced search and filtering capabilities.'
    },
    {
      icon: FileCheck,
      title: 'Data Validation',
      description: 'Automated validation of provider data ensuring accuracy and compliance with healthcare standards.'
    },
    {
      icon: BarChart3,
      title: 'Quality Metrics',
      description: 'Real-time quality scoring and analytics to maintain high data integrity standards.'
    },
    {
      icon: Lock,
      title: 'Audit Trail',
      description: 'Complete audit logging for compliance tracking and regulatory requirements.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Providers Validated' },
    { value: '99.8%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'System Uptime' },
    { value: '100%', label: 'HIPAA Compliant' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d47a1] via-[#1976D2] to-[#42a5f5] overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="text-[#1976D2]" size={28} />
            </div>
            <div>
              <h2 className="text-white">Provider Validator</h2>
            </div>
          </div>
          <button 
            onClick={onGetStarted}
            className="h-[40px] px-6 rounded-lg bg-white text-[#1976D2] hover:bg-white/90 transition-all flex items-center gap-2"
          >
            Login
            <ArrowRight size={20} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <CheckCircle size={16} className="text-[#43A047]" />
                  <span className="text-sm">Trusted by Healthcare Organizations</span>
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-6xl leading-tight">
                Healthcare Provider
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                  Data Validation
                </span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Streamline your healthcare provider data management with automated validation, 
                quality scoring, and comprehensive compliance tracking. Built for accuracy, 
                designed for efficiency.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onGetStarted}
                  className="h-[48px] px-8 rounded-lg bg-white text-[#1976D2] hover:bg-white/90 transition-all flex items-center gap-2 text-lg"
                >
                  Get Started
                  <ArrowRight size={24} />
                </button>
                <Button 
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 h-[48px] px-8 text-lg"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-3xl mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#43A047] to-[#2E7D32] rounded-lg"></div>
                      <div>
                        <div className="h-3 w-24 bg-white/30 rounded"></div>
                        <div className="h-2 w-16 bg-white/20 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                        <div className="h-2 w-16 bg-white/40 rounded mb-3"></div>
                        <div className="h-6 w-12 bg-white/60 rounded"></div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="h-3 w-32 bg-white/40 rounded mb-4"></div>
                    <div className="space-y-3">
                      {[80, 60, 45, 30].map((width, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-8 bg-white/40 rounded" style={{ width: `${width}%` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#43A047] rounded-2xl shadow-lg flex items-center justify-center animate-bounce">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#FB8C00] rounded-2xl shadow-lg flex items-center justify-center" style={{ animation: 'pulse 2s infinite' }}>
                  <TrendingUp size={32} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-white mb-4">Powerful Features for Healthcare Excellence</h2>
            <p className="text-xl text-white/80">Everything you need to manage and validate provider data efficiently</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                >
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-[#1976D2]" />
                  </div>
                  <h3 className="text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
            <h2 className="text-4xl text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join healthcare organizations using Provider Validator for accurate, compliant provider data management
            </p>
            <button 
              onClick={onGetStarted}
              className="h-[56px] px-12 rounded-lg bg-white text-[#1976D2] hover:bg-white/90 transition-all flex items-center gap-2 text-lg mx-auto"
            >
              Start Validating Now
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
}