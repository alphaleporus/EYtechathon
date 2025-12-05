import React, { useState, useRef} from 'react';
import {Upload, CheckCircle, AlertCircle, AlertTriangle, FileText, Info, X} from 'lucide-react';
import {Card} from './ui/card';
import {Button} from './ui/button';
import {Badge} from './ui/badge';

export function FileValidation() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Total Records', value: '50', color: '#1976D2', bgColor: '#E3F2FD' },
    { label: 'Valid', value: '42', color: '#43A047', bgColor: '#E8F5E9' },
    { label: 'Invalid', value: '5', color: '#E53935', bgColor: '#FFEBEE' },
    { label: 'Warnings', value: '3', color: '#FB8C00', bgColor: '#FFF3E0' }
  ];

  const errors = [
    {
      row: 12,
      field: 'npi',
      message: 'Invalid NPI format',
      current: '12345',
      suggested: '1234567890',
      type: 'error'
    },
    {
      row: 18,
      field: 'email',
      message: 'Invalid email format',
      current: 'john@invalid',
      suggested: 'john@example.com',
      type: 'error'
    },
    {
      row: 24,
      field: 'phone',
      message: 'Phone number format should be (XXX) XXX-XXXX',
      current: '1234567890',
      suggested: '(123) 456-7890',
      type: 'warning'
    },
    {
      row: 31,
      field: 'specialty',
      message: 'Specialty not found in approved list',
      current: 'General Practice',
      suggested: 'Internal Medicine',
      type: 'error'
    },
    {
      row: 37,
      field: 'license_state',
      message: 'State code should be 2 letters',
      current: 'California',
      suggested: 'CA',
      type: 'warning'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          handleFile(file);
      }
  };

    const handleFile = (file: File) => {
        // Validate file type
        const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
            alert('Please upload a CSV or XLSX file');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setFileUploaded(true);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleReset = () => {
        setFileUploaded(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Validation</h1>
          <p className="text-base text-[#757575]">Upload and validate provider data files</p>
      </div>

        {/* Upload Section */}
        {!fileUploaded ? (
            <Card className="mb-6 bg-white p-6">
          <div
              className={`flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg transition-all ${
                  isDragging
                      ? 'border-[#1976D2] bg-[#E3F2FD]'
                      : 'border-[#E0E0E0] bg-white'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
          >
              <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mb-4">
                  <Upload size={32} className="text-[#1976D2]"/>
              </div>
              <h3 className="mb-2">Drop file or click to browse</h3>
              <p className="text-[#757575] mb-6">Supports CSV, XLSX (Max 10MB)</p>

              {/* Hidden file input */}
              <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileSelect}
                  className="hidden"
              />

              <Button onClick={handleButtonClick}>Select File</Button>
          </div>
            </Card>
        ) : (
            <>
            {/* File Info */}
            <Card className="mb-6 bg-white p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
                            <FileText size={24} className="text-[#1976D2]"/>
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#212121]">{selectedFile?.name}</h4>
                            <p className="text-sm text-[#757575]">
                                {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : ''}
                            </p>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={handleReset}>
                        <X size={20}/>
                        Remove
                    </Button>
                </div>
            </Card>
          {/* Validation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-white p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: stat.bgColor, color: stat.color }}
                  >
                    <span className="text-xl">{stat.value}</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#757575]">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Success Message */}
          <Card className="mb-6 bg-[#E8F5E9] border border-[#43A047] p-6">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} className="text-[#43A047] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#43A047] mb-1">Import Successful</h4>
                <p className="text-[#43A047]">42 records imported successfully</p>
              </div>
            </div>
          </Card>

          {/* Error List */}
          {errors.length > 0 && (
            <Card className="mb-6 bg-white p-6">
                <h3 className="text-xl font-semibold mb-4">Validation Issues ({errors.length})</h3>
              <div className="space-y-4">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      error.type === 'error' 
                        ? 'border-[#E53935] bg-[#FFEBEE]' 
                        : 'border-[#FB8C00] bg-[#FFF3E0]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {error.type === 'error' ? (
                          <AlertCircle size={20} className="text-[#E53935]" />
                        ) : (
                          <AlertTriangle size={20} className="text-[#FB8C00]" />
                        )}
                        <span className="text-sm">
                          Row {error.row} - {error.field}
                        </span>
                      </div>
                      <Badge variant={error.type === 'error' ? 'error' : 'warning'}>
                        {error.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className={`text-sm mb-3 ${error.type === 'error' ? 'text-[#E53935]' : 'text-[#FB8C00]'}`}>
                      {error.message}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#757575] mb-1">Current Value:</p>
                        <code className="text-sm bg-white px-2 py-1 rounded border border-[#E0E0E0]">
                          {error.current}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs text-[#757575] mb-1">Suggested Value:</p>
                        <code className="text-sm bg-white px-2 py-1 rounded border border-[#43A047] text-[#43A047]">
                          {error.suggested}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* File Format Guidelines */}
          <Card className="bg-[#E3F2FD] border border-[#1976D2] p-6">
            <div className="flex items-start gap-3">
              <Info size={24} className="text-[#1976D2] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#1976D2] mb-3">File Format Guidelines</h4>
                <ul className="space-y-2 text-[#1976D2]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1976D2] mt-1">•</span>
                    <span>NPI must be exactly 10 digits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1976D2] mt-1">•</span>
                    <span>Email must be in valid format (user@domain.com)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1976D2] mt-1">•</span>
                    <span>Phone format: (XXX) XXX-XXXX</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1976D2] mt-1">•</span>
                    <span>State codes must be 2-letter abbreviations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1976D2] mt-1">•</span>
                    <span>Specialty must match approved specialty list</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
