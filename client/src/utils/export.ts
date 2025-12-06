import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

// Export providers to CSV
export const exportProvidersToCSV = (providers: any[]) => {
    const csvData = providers.map(p => ({
        NPI: p.npi,
        Name: p.name || `${p.first_name} ${p.last_name}`,
        Email: p.email,
        Phone: p.phone,
        Specialty: p.specialty,
        State: p.licenseState || p.license_state || p.state,
        'Quality Score': p.qualityScore || p.quality_score || p.data_quality_score || 0
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `providers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Export validation report to PDF
export const exportValidationReportToPDF = (validationData: any, fileName: string) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210); // #1976D2
    doc.text('Provider Data Validation Report', 14, 20);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(117, 117, 117);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Summary Stats
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text('Summary Statistics', 14, 40);

    const summaryData = [
        ['Total Records', validationData.totalRecords?.toString() || '0'],
        ['Valid Records', validationData.validRecords?.toString() || '0'],
        ['Invalid Records', validationData.invalidRecords?.toString() || '0'],
        ['Warnings', validationData.warningRecords?.toString() || '0']
    ];

    autoTable(doc, {
        startY: 45,
        head: [['Metric', 'Count']],
        body: summaryData,
        theme: 'grid',
        headStyles: {fillColor: [25, 118, 210]},
        margin: {left: 14, right: 14}
    });

    // Errors Section
    if (validationData.errors && validationData.errors.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY || 45;
        doc.setFontSize(14);
        doc.text('Validation Errors', 14, finalY + 15);

        const errorData = validationData.errors.slice(0, 20).map((err: any) => [
            err.row?.toString() || '',
            err.field || '',
            err.message || '',
            err.current || ''
        ]);

        autoTable(doc, {
            startY: finalY + 20,
            head: [['Row', 'Field', 'Error', 'Current Value']],
            body: errorData,
            theme: 'striped',
            headStyles: {fillColor: [229, 57, 53]},
            margin: {left: 14, right: 14},
            styles: {fontSize: 8}
        });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            {align: 'center'}
        );
    }

    doc.save(fileName);
};

// Export dashboard analytics to PDF
export const exportDashboardToPDF = (stats: any, providers: any[]) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(25, 118, 210);
    doc.text('Healthcare Provider Analytics Report', 14, 20);

    // Date and Time
    doc.setFontSize(10);
    doc.setTextColor(117, 117, 117);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    // Summary Statistics
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    doc.text('Overview', 14, 42);

    const summaryData = [
        ['Total Providers', stats.totalProviders?.toString() || '0'],
        ['Active Providers', stats.activeProviders?.toString() || '0'],
        ['Average Quality Score', `${stats.avgQualityScore}%` || '0%'],
        ['Validation Jobs', stats.validationJobs?.toString() || '0']
    ];

    autoTable(doc, {
        startY: 47,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: {fillColor: [25, 118, 210], fontSize: 11},
        bodyStyles: {fontSize: 10},
        margin: {left: 14, right: 14}
    });

    // Quality Distribution
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Quality Score Distribution', 14, currentY);

    const qualityRanges = [
        {name: 'Excellent (90-100)', count: 0},
        {name: 'Good (80-89)', count: 0},
        {name: 'Average (70-79)', count: 0},
        {name: 'Below Average (60-69)', count: 0},
        {name: 'Poor (0-59)', count: 0}
    ];

    providers.forEach(p => {
        const score = p.qualityScore || p.quality_score || p.data_quality_score || 0;
        if (score >= 90) qualityRanges[0].count++;
        else if (score >= 80) qualityRanges[1].count++;
        else if (score >= 70) qualityRanges[2].count++;
        else if (score >= 60) qualityRanges[3].count++;
        else qualityRanges[4].count++;
    });

    const qualityData = qualityRanges.map(r => [r.name, r.count.toString()]);

    autoTable(doc, {
        startY: currentY + 5,
        head: [['Quality Range', 'Provider Count']],
        body: qualityData,
        theme: 'striped',
        headStyles: {fillColor: [156, 39, 176]},
        margin: {left: 14, right: 14}
    });

    // Top Specialties
    currentY = (doc as any).lastAutoTable.finalY + 15;

    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFontSize(14);
    doc.text('Top Specialties', 14, currentY);

    const specialtyCounts: { [key: string]: number } = {};
    providers.forEach(p => {
        const spec = p.specialty || 'Unknown';
        specialtyCounts[spec] = (specialtyCounts[spec] || 0) + 1;
    });

    const topSpecialties = Object.entries(specialtyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => [name, count.toString()]);

    autoTable(doc, {
        startY: currentY + 5,
        head: [['Specialty', 'Count']],
        body: topSpecialties,
        theme: 'grid',
        headStyles: {fillColor: [67, 160, 71]},
        margin: {left: 14, right: 14}
    });

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Healthcare Provider Data Validator | Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            {align: 'center'}
        );
    }

    doc.save(`dashboard_analytics_${new Date().toISOString().split('T')[0]}.pdf`);
};
