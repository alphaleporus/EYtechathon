import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProviderModal({ isOpen, onClose }: AddProviderModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    npi: '',
    specialty: '',
    phone: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    licenseNumber: '',
    licenseState: '',
    credential: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-auto animate-slideInRight shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
          <h3>Add Provider</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-all duration-200 hover:scale-110"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Input
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              
              <Input
                label="NPI"
                value={formData.npi}
                onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
              />
              
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              
              <Input
                label="License Number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Input
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              
              <Input
                label="Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              
              <Input
                label="Address 2"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
                <Input
                  label="Zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="License State"
                  value={formData.licenseState}
                  onChange={(e) => setFormData({ ...formData, licenseState: e.target.value })}
                />
                <Input
                  label="Credential"
                  value={formData.credential}
                  onChange={(e) => setFormData({ ...formData, credential: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E0E0E0]">
            <Button type="button" variant="secondary" onClick={onClose} className="hover:scale-105 transition-transform">
              Cancel
            </Button>
            <Button type="submit" className="hover:scale-105 transition-transform">
              Create Provider
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}