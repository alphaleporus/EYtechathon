import React from 'react';
import {Plus, Edit, Trash2, User, Calendar, Info, ChevronLeft, ChevronRight} from 'lucide-react';
import {Card} from './ui/card';
import {Badge} from './ui/badge';
import {Button} from './ui/button';

export function AuditLogs() {
    const logs = [
        {
            id: '1',
            action: 'CREATE',
            entity: 'provider',
            user: 'John Smith',
            timestamp: 'Nov 9, 2024 10:30 PM',
            details: 'Created new provider Dr. Sarah Johnson'
        },
        {
            id: '2',
            action: 'UPDATE',
            entity: 'provider',
            user: 'Emily Davis',
            timestamp: 'Nov 9, 2024 9:15 PM',
            details: 'Updated quality score for Dr. Michael Chen'
        },
        {
            id: '3',
            action: 'DELETE',
            entity: 'provider',
            user: 'Robert Wilson',
            timestamp: 'Nov 9, 2024 8:45 PM',
            details: 'Removed provider Dr. James Anderson'
        },
        {
            id: '4',
            action: 'CREATE',
            entity: 'validation',
            user: 'Maria Garcia',
            timestamp: 'Nov 9, 2024 7:20 PM',
            details: 'Uploaded new validation file providers_batch_42.csv'
        },
        {
            id: '5',
            action: 'UPDATE',
            entity: 'provider',
            user: 'David Lee',
            timestamp: 'Nov 9, 2024 6:00 PM',
            details: 'Updated specialty for Dr. Lisa Anderson'
        },
        {
            id: '6',
            action: 'CREATE',
            entity: 'provider',
            user: 'Sarah Kim',
            timestamp: 'Nov 9, 2024 4:30 PM',
            details: 'Created new provider Dr. Robert Thompson'
        },
        {
            id: '7',
            action: 'UPDATE',
            entity: 'validation',
            user: 'John Smith',
            timestamp: 'Nov 9, 2024 3:15 PM',
            details: 'Corrected validation errors in batch 41'
        },
        {
            id: '8',
            action: 'DELETE',
            entity: 'provider',
            user: 'Emily Davis',
            timestamp: 'Nov 9, 2024 2:00 PM',
            details: 'Removed duplicate provider entry'
        }
    ];

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE':
                return <Plus size={20}/>;
            case 'UPDATE':
                return <Edit size={20}/>;
            case 'DELETE':
                return <Trash2 size={20}/>;
            default:
                return <Info size={20}/>;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE':
                return {bg: '#E8F5E9', text: '#43A047'};
            case 'UPDATE':
                return {bg: '#E3F2FD', text: '#1976D2'};
            case 'DELETE':
                return {bg: '#FFEBEE', text: '#E53935'};
            default:
                return {bg: '#F5F5F5', text: '#757575'};
        }
    };

    const getActionBadgeVariant = (action: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (action) {
            case 'CREATE':
                return 'default';
            case 'UPDATE':
                return 'default';
            case 'DELETE':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
                <p className="text-base text-[#757575]">Track all changes and activities in the system</p>
            </div>

            {/* Info Box */}
            <Card className="bg-white p-6 mb-6 bg-[#E3F2FD] border-[#1976D2]">
                <div className="flex items-start gap-3">
                    <Info size={24} className="text-[#1976D2] flex-shrink-0 mt-0.5"/>
                    <div>
                        <h4 className="text-base font-semibold text-[#1976D2] mb-2">Compliance Tracking</h4>
                        <p className="text-sm text-[#1976D2]">
                            All actions are logged for compliance and auditing purposes. Logs are retained for 7 years
                            in accordance with healthcare data retention policies.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Timeline */}
            <div className="space-y-4">
                {logs.map((log) => {
                    const colors = getActionColor(log.action);
                    return (
                        <Card key={log.id} className="bg-white p-6 hover:shadow-lg transition-shadow">
                            <div className="flex gap-4">
                                {/* Icon Circle */}
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                                    style={{backgroundColor: colors.bg, color: colors.text}}
                                >
                                    {getActionIcon(log.action)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <Badge
                                            variant={getActionBadgeVariant(log.action)}
                                            className={
                                                log.action === 'CREATE' ? 'bg-[#E8F5E9] text-[#43A047] border-transparent hover:bg-[#E8F5E9]' :
                                                    log.action === 'UPDATE' ? 'bg-[#E3F2FD] text-[#1976D2] border-transparent hover:bg-[#E3F2FD]' :
                                                        log.action === 'DELETE' ? 'bg-[#FFEBEE] text-[#E53935] border-transparent hover:bg-[#FFEBEE]' :
                                                            ''
                                            }
                                        >
                                            {log.action}
                                        </Badge>
                                        <Badge variant="secondary"
                                               className="bg-[#F5F5F5] text-[#757575] border-transparent">
                                            {log.entity}
                                        </Badge>
                                        <span className="text-[#757575] text-sm">•</span>
                                        <div className="flex items-center gap-2 text-sm text-[#757575]">
                                            <User size={14}/>
                                            <span>{log.user}</span>
                                        </div>
                                        <span className="text-[#757575] text-sm">•</span>
                                        <div className="flex items-center gap-2 text-sm text-[#757575]">
                                            <Calendar size={14}/>
                                            <span>{log.timestamp}</span>
                                        </div>
                                    </div>
                                    <p className="text-base text-[#212121]">{log.details}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8">
                <Button variant="secondary" className="flex items-center gap-2">
                    <ChevronLeft size={20}/>
                    Previous
                </Button>

                <span className="text-base text-[#757575]">Page 1 of 3</span>

                <Button variant="secondary" className="flex items-center gap-2">
                    Next
                    <ChevronRight size={20}/>
                </Button>
            </div>
        </div>
    );
}
