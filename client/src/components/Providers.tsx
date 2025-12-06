import React, {useState, useEffect} from 'react';
import {Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Users} from 'lucide-react';
import {Card} from './ui/card';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Badge} from './ui/badge';
import {EmptyState} from './EmptyState';
import api from '../utils/api';
import toast from 'react-hot-toast';

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
    const limit = 10;

    useEffect(() => {
        fetchProviders();
    }, [currentPage, searchQuery]);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/providers?page=${currentPage}&limit=${limit}&search=${searchQuery}`);

            const providersData = response.data.providers || [];

            // Normalize provider data
            const normalizedProviders = providersData.map((p: any) => ({
                ...p,
                name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
                qualityScore: p.qualityScore || p.quality_score || p.data_quality_score || 0
            }));

            setProviders(normalizedProviders);
            setTotalPages(response.data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching providers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this provider?')) return;

        try {
            await api.delete(`/providers/${id}`);
            toast.success('Provider deleted successfully!');
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
                <Button onClick={onAddProvider} className="hover:scale-105 transition-transform">
                    <Plus size={20}/>
                    Add Provider
                </Button>
            </div>

            {/* Search Bar */}
            <Card className="mb-6 bg-white hover:shadow-lg transition-shadow p-6">
                <Input
                    placeholder="Search by name, NPI, email..."
                    icon={<Search size={20}/>}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                                        <td className="px-6 py-4 text-[#757575]">{provider.email}</td>
                                        <td className="px-6 py-4">{getScoreBadge(provider.qualityScore || 0)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-2 hover:bg-[#E3F2FD] text-[#1976D2] rounded-lg transition-all duration-200 hover:scale-110">
                                                    <Edit2 size={16}/>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(provider.id)}
                                                    className="p-2 hover:bg-[#FFEBEE] text-[#E53935] rounded-lg transition-all duration-200 hover:scale-110"
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
        </div>
    );
}
