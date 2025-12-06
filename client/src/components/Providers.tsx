import React, {useState, useEffect} from 'react';
import {Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Users, Download, Filter, X} from 'lucide-react';
import {Card} from './ui/card';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Badge} from './ui/badge';
import {EmptyState} from './EmptyState';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {exportProvidersToCSV} from '../utils/export';
import {eventEmitter, EVENTS} from '../utils/events';

interface Provider {
    id: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    npi: string;
    specialty: string;
    email: string;
    qualityScore?: number;
    quality_score?: number;
    data_quality_score?: number;
}

interface ProvidersProps {
    onAddProvider: () => void;
}

export function Providers({onAddProvider}: ProvidersProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedQualityRange, setSelectedQualityRange] = useState('');

    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        npi: '',
        specialty: '',
        email: '',
        phone: '',
        licenseState: '',
        qualityScore: 0
    });

    const limit = 10;

    // Specialties list
    const specialties = [
        'Cardiology', 'Internal Medicine', 'Pediatrics', 'Orthopedics',
        'Dermatology', 'Neurology', 'Oncology', 'Psychiatry',
        'Radiology', 'Anesthesiology', 'Emergency Medicine',
        'Family Medicine', 'Obstetrics and Gynecology', 'Ophthalmology',
        'Pathology', 'Surgery', 'Urology', 'ENT'
    ];

    // Indian states
    const states = [
        {code: 'MH', name: 'Maharashtra'},
        {code: 'DL', name: 'Delhi'},
        {code: 'KA', name: 'Karnataka'},
        {code: 'TN', name: 'Tamil Nadu'},
        {code: 'TS', name: 'Telangana'},
        {code: 'KL', name: 'Kerala'},
        {code: 'GJ', name: 'Gujarat'},
        {code: 'UP', name: 'Uttar Pradesh'},
        {code: 'PB', name: 'Punjab'},
        {code: 'WB', name: 'West Bengal'},
        {code: 'HR', name: 'Haryana'},
        {code: 'RJ', name: 'Rajasthan'},
        {code: 'AP', name: 'Andhra Pradesh'},
        {code: 'BR', name: 'Bihar'},
        {code: 'MP', name: 'Madhya Pradesh'}
    ];

    // Quality score ranges
    const qualityRanges = [
        {value: '90+', label: 'Excellent (90-100)'},
        {value: '80-89', label: 'Good (80-89)'},
        {value: '70-79', label: 'Average (70-79)'},
        {value: '60-69', label: 'Below Average (60-69)'},
        {value: '0-59', label: 'Poor (0-59)'}
    ];

    useEffect(() => {
        fetchProviders();
    }, [currentPage, searchQuery, selectedSpecialty, selectedState, selectedQualityRange]);

    // Listen for provider updates from other components
    useEffect(() => {
        const handleProviderAdded = () => {
            console.log('Provider added event received, refreshing providers list...');
            fetchProviders();
        };

        eventEmitter.on(EVENTS.PROVIDER_ADDED, handleProviderAdded);

        return () => {
            eventEmitter.off(EVENTS.PROVIDER_ADDED, handleProviderAdded);
        };
    }, []);

    const fetchProviders = async () => {
        try {
            setLoading(true);

            // Fetch all providers for client-side filtering
            const response = await api.get(`/providers?limit=10000&search=${searchQuery}`);
            let providersData = response.data.providers || [];

            // Normalize provider data
            let normalizedProviders = providersData.map((p: any) => ({
                ...p,
                name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
                licenseState: p.licenseState || p.license_state || p.state,
                qualityScore: p.qualityScore || p.quality_score || p.data_quality_score || 0
            }));

            // Apply filters
            if (selectedSpecialty) {
                normalizedProviders = normalizedProviders.filter((p: any) =>
                    p.specialty === selectedSpecialty
                );
            }

            if (selectedState) {
                normalizedProviders = normalizedProviders.filter((p: any) =>
                    p.licenseState === selectedState
                );
            }

            if (selectedQualityRange) {
                normalizedProviders = normalizedProviders.filter((p: any) => {
                    const score = p.qualityScore;
                    if (selectedQualityRange === '90+') return score >= 90;
                    if (selectedQualityRange === '80-89') return score >= 80 && score <= 89;
                    if (selectedQualityRange === '70-79') return score >= 70 && score <= 79;
                    if (selectedQualityRange === '60-69') return score >= 60 && score <= 69;
                    if (selectedQualityRange === '0-59') return score < 60;
                    return true;
                });
            }

            // Calculate pagination
            const total = normalizedProviders.length;
            const pages = Math.ceil(total / limit);
            const startIndex = (currentPage - 1) * limit;
            const paginatedProviders = normalizedProviders.slice(startIndex, startIndex + limit);

            setProviders(paginatedProviders);
            setTotalPages(pages || 1);
        } catch (error) {
            console.error('Error fetching providers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (provider: Provider) => {
        setEditingProvider(provider);
        setEditForm({
            name: provider.name || '',
            npi: provider.npi || '',
            specialty: provider.specialty || '',
            email: provider.email || '',
            phone: (provider as any).phone || '',
            licenseState: (provider as any).licenseState || (provider as any).license_state || (provider as any).state || '',
            qualityScore: provider.qualityScore || provider.quality_score || provider.data_quality_score || 0
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editingProvider) return;

        try {
            // Split name into first and last name
            const nameParts = editForm.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const updateData = {
                first_name: firstName,
                last_name: lastName,
                npi: editForm.npi,
                specialty: editForm.specialty,
                email: editForm.email,
                phone: editForm.phone,
                license_state: editForm.licenseState,
                data_quality_score: editForm.qualityScore
            };

            await api.put(`/providers/${editingProvider.id}`, updateData);
            toast.success('Provider updated successfully!');
            eventEmitter.emit(EVENTS.PROVIDER_UPDATED); // Notify other components
            setShowEditModal(false);
            setEditingProvider(null);
            fetchProviders(); // Refresh the list
        } catch (error) {
            console.error('Error updating provider:', error);
            toast.error('Failed to update provider');
        }
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
        setEditingProvider(null);
        setEditForm({
            name: '',
            npi: '',
            specialty: '',
            email: '',
            phone: '',
            licenseState: '',
            qualityScore: 0
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this provider?')) return;

        try {
            await api.delete(`/providers/${id}`);
            toast.success('Provider deleted successfully!');
            eventEmitter.emit(EVENTS.PROVIDER_DELETED); // Notify other components
            fetchProviders(); // Refresh the list
        } catch (error) {
            console.error('Error deleting provider:', error);
            toast.error('Failed to delete provider');
        }
    };

    const getScoreBadge = (score: number) => {
        if (score >= 80) return <Badge variant="success">{score}%</Badge>;
        if (score >= 60) return <Badge variant="warning">{score}%</Badge>;
        return <Badge variant="error">{score}%</Badge>;
    };

    const handleExport = async () => {
        try {
            // Fetch and filter providers same way as display
            const response = await api.get(`/providers?limit=10000&search=${searchQuery}`);
            let providersData = response.data.providers || [];

            // Normalize
            let normalizedProviders = providersData.map((p: any) => ({
                ...p,
                name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
                licenseState: p.licenseState || p.license_state || p.state,
                qualityScore: p.qualityScore || p.quality_score || p.data_quality_score || 0
            }));

            // Apply same filters as display
            if (selectedSpecialty) {
                normalizedProviders = normalizedProviders.filter((p: any) =>
                    p.specialty === selectedSpecialty
                );
            }

            if (selectedState) {
                normalizedProviders = normalizedProviders.filter((p: any) =>
                    p.licenseState === selectedState
                );
            }

            if (selectedQualityRange) {
                normalizedProviders = normalizedProviders.filter((p: any) => {
                    const score = p.qualityScore;
                    if (selectedQualityRange === '90+') return score >= 90;
                    if (selectedQualityRange === '80-89') return score >= 80 && score <= 89;
                    if (selectedQualityRange === '70-79') return score >= 70 && score <= 79;
                    if (selectedQualityRange === '60-69') return score >= 60 && score <= 69;
                    if (selectedQualityRange === '0-59') return score < 60;
                    return true;
                });
            }

            exportProvidersToCSV(normalizedProviders);
            const filterText = (selectedSpecialty || selectedState || selectedQualityRange) ? 'filtered ' : '';
            toast.success(`Exported ${normalizedProviders.length} ${filterText}providers to CSV!`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export providers');
        }
    };

    const handleClearFilters = () => {
        setSelectedSpecialty('');
        setSelectedState('');
        setSelectedQualityRange('');
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedSpecialty || selectedState || selectedQualityRange;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Providers</h1>
                    <p className="text-base text-[#757575]">Manage healthcare provider information</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleExport} variant="secondary" className="hover:scale-105 transition-transform">
                        <Download size={20}/>
                        Export CSV
                    </Button>
                    <Button onClick={onAddProvider} className="hover:scale-105 transition-transform">
                        <Plus size={20}/>
                        Add Provider
                    </Button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6 bg-white hover:shadow-lg transition-shadow p-6">
                <div className="flex gap-4 items-center mb-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by name, NPI, email..."
                            icon={<Search size={20}/>}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={showFilters ? 'default' : 'secondary'}
                        onClick={() => setShowFilters(!showFilters)}
                        className="hover:scale-105 transition-transform flex-shrink-0"
                    >
                        <Filter size={20}/>
                        Filters
                        {hasActiveFilters && (
                            <Badge variant="error" className="ml-2">
                                {[selectedSpecialty, selectedState, selectedQualityRange].filter(Boolean).length}
                            </Badge>
                        )}
                    </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="pt-4 border-t border-[#E0E0E0] mt-4 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Specialty Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    Specialty
                                </label>
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => {
                                        setSelectedSpecialty(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] bg-white"
                                >
                                    <option value="">All Specialties</option>
                                    {specialties.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>

                            {/* State Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    State
                                </label>
                                <select
                                    value={selectedState}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] bg-white"
                                >
                                    <option value="">All States</option>
                                    {states.map(state => (
                                        <option key={state.code} value={state.code}>
                                            {state.name} ({state.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quality Score Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    Quality Score
                                </label>
                                <select
                                    value={selectedQualityRange}
                                    onChange={(e) => {
                                        setSelectedQualityRange(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] bg-white"
                                >
                                    <option value="">All Scores</option>
                                    {qualityRanges.map(range => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={handleClearFilters}
                                    className="hover:scale-105 transition-transform"
                                >
                                    <X size={18}/>
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Table */}
            {providers.length === 0 ? (
                <Card className="bg-white p-6">
                    <EmptyState
                        icon={<Users size={64}/>}
                        title="No providers found"
                        description="No providers match your search criteria. Try adjusting your search or add a new provider."
                        actionLabel="Add Provider"
                        onAction={onAddProvider}
                    />
                </Card>
            ) : (
                <>
                    <Card className="overflow-hidden bg-white p-0 hover:shadow-lg transition-shadow">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gradient-to-r from-[#F5F5F5] to-[#FAFAFA] border-b border-[#E0E0E0]">
                                    <th className="text-left px-6 py-4 text-sm text-[#757575]">Name</th>
                                    <th className="text-left px-6 py-4 text-sm text-[#757575]">NPI</th>
                                    <th className="text-left px-6 py-4 text-sm text-[#757575]">Specialty</th>
                                    <th className="text-left px-6 py-4 text-sm text-[#757575]">State</th>
                                    <th className="text-left px-6 py-4 text-sm text-[#757575]">Email</th>
                                    <th className="text-left px-6 py-4 text-sm text-[#757575]">Quality Score</th>
                                    <th className="text-left px-6 py-4 text-sm text-[#757575]">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {providers.map((provider) => (
                                    <tr
                                        key={provider.id}
                                        className="border-b border-[#F5F5F5] hover:bg-gradient-to-r hover:from-[#E3F2FD]/30 hover:to-transparent transition-all duration-200"
                                    >
                                        <td className="px-6 py-4">{provider.name}</td>
                                        <td className="px-6 py-4 text-[#757575]">{provider.npi}</td>
                                        <td className="px-6 py-4 text-[#757575]">{provider.specialty}</td>
                                        <td className="px-6 py-4 text-[#757575]">
                                            {(provider as any).licenseState || (provider as any).license_state || (provider as any).state || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-[#757575]">{provider.email}</td>
                                        <td className="px-6 py-4">{getScoreBadge(provider.qualityScore || 0)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(provider)}
                                                    className="p-2 hover:bg-[#E3F2FD] text-[#1976D2] rounded-lg transition-all duration-200 hover:scale-110"
                                                    title="Edit provider"
                                                >
                                                    <Edit2 size={16}/>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(provider.id)}
                                                    className="p-2 hover:bg-[#FFEBEE] text-[#E53935] rounded-lg transition-all duration-200 hover:scale-110"
                                                    title="Delete provider"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="hover:scale-105 transition-transform"
                        >
                            <ChevronLeft size={20}/>
                            Previous
                        </Button>

                        <span className="text-[#757575]">
              Page {currentPage} of {totalPages}
            </span>

                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="hover:scale-105 transition-transform"
                        >
                            Next
                            <ChevronRight size={20}/>
                        </Button>
                    </div>
                </>
            )}

            {/* Edit Provider Modal */}
            {showEditModal && editingProvider && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-[#E0E0E0] flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-[#212121]">Edit Provider</h2>
                            <button
                                onClick={handleCancelEdit}
                                className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                            >
                                <X size={24}/>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    Full Name *
                                </label>
                                <Input
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    placeholder="Dr. Rajesh Kumar"
                                />
                            </div>

                            {/* NPI */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    NPI *
                                </label>
                                <Input
                                    value={editForm.npi}
                                    onChange={(e) => setEditForm({...editForm, npi: e.target.value})}
                                    placeholder="1234567890"
                                    maxLength={10}
                                />
                            </div>

                            {/* Specialty */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    Specialty *
                                </label>
                                <select
                                    value={editForm.specialty}
                                    onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                                    className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] bg-white"
                                >
                                    <option value="">Select Specialty</option>
                                    {specialties.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    License State *
                                </label>
                                <select
                                    value={editForm.licenseState}
                                    onChange={(e) => setEditForm({...editForm, licenseState: e.target.value})}
                                    className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] bg-white"
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.code} value={state.code}>
                                            {state.name} ({state.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    Email *
                                </label>
                                <Input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    placeholder="rajesh.kumar@apollo.in"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    Phone
                                </label>
                                <Input
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    placeholder="+91-9876543210"
                                />
                            </div>

                            {/* Quality Score */}
                            <div>
                                <label className="block text-sm font-medium text-[#757575] mb-2">
                                    Quality Score (0-100)
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editForm.qualityScore}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        qualityScore: parseInt(e.target.value) || 0
                                    })}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-[#E0E0E0] flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                disabled={!editForm.name || !editForm.npi || !editForm.specialty || !editForm.email || !editForm.licenseState}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
