import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Card } from './ui/card';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Badge} from './ui/badge';
import { EmptyState } from './EmptyState';

interface Provider {
  id: string;
  name: string;
  npi: string;
  specialty: string;
  email: string;
  qualityScore: number;
}

interface ProvidersProps {
  onAddProvider: () => void;
}

export function Providers({ onAddProvider }: ProvidersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const providers: Provider[] = [
    { id: '1', name: 'Dr. Sarah Johnson', npi: '1234567890', specialty: 'Cardiology', email: 'sarah.j@hospital.com', qualityScore: 92 },
    { id: '2', name: 'Dr. Michael Chen', npi: '2345678901', specialty: 'Internal Medicine', email: 'michael.c@clinic.com', qualityScore: 88 },
    { id: '3', name: 'Dr. Emily Davis', npi: '3456789012', specialty: 'Pediatrics', email: 'emily.d@healthcare.com', qualityScore: 95 },
    { id: '4', name: 'Dr. Robert Smith', npi: '4567890123', specialty: 'Orthopedics', email: 'robert.s@medical.com', qualityScore: 76 },
    { id: '5', name: 'Dr. Lisa Anderson', npi: '5678901234', specialty: 'Dermatology', email: 'lisa.a@derma.com', qualityScore: 84 },
    { id: '6', name: 'Dr. James Wilson', npi: '6789012345', specialty: 'Neurology', email: 'james.w@neuro.com', qualityScore: 91 },
    { id: '7', name: 'Dr. Maria Garcia', npi: '7890123456', specialty: 'Oncology', email: 'maria.g@cancer.com', qualityScore: 58 },
    { id: '8', name: 'Dr. David Lee', npi: '8901234567', specialty: 'Cardiology', email: 'david.l@heart.com', qualityScore: 89 }
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge variant="success">{score}%</Badge>;
    if (score >= 60) return <Badge variant="warning">{score}%</Badge>;
    return <Badge variant="error">{score}%</Badge>;
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.npi.includes(searchQuery) ||
    provider.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          icon={<Search size={20} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {/* Table */}
      {filteredProviders.length === 0 ? (
        <Card className="bg-white p-6">
          <EmptyState
            icon={<Users size={64} />}
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
                  {filteredProviders.map((provider) => (
                    <tr key={provider.id} className="border-b border-[#F5F5F5] hover:bg-gradient-to-r hover:from-[#E3F2FD]/30 hover:to-transparent transition-all duration-200">
                      <td className="px-6 py-4">{provider.name}</td>
                      <td className="px-6 py-4 text-[#757575]">{provider.npi}</td>
                      <td className="px-6 py-4 text-[#757575]">{provider.specialty}</td>
                      <td className="px-6 py-4 text-[#757575]">{provider.email}</td>
                      <td className="px-6 py-4">{getScoreBadge(provider.qualityScore)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-[#E3F2FD] text-[#1976D2] rounded-lg transition-all duration-200 hover:scale-110">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-[#FFEBEE] text-[#E53935] rounded-lg transition-all duration-200 hover:scale-110">
                            <Trash2 size={16} />
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
              <ChevronLeft size={20} />
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
              <ChevronRight size={20} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}