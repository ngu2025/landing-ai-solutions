// PDF Generator - Matrix Intelligence
// Correct version for file without .pdf extension

function generateSamplePDF() {
    console.log('Downloading PDF...');
    
    try {
        // Файл на сервере: Matrix_Intelligence_Report (без .pdf)
        const pdfUrl = 'pdf-templates/Matrix_Intelligence_Report';
        
        // При скачивании даем правильное имя с расширением
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'Matrix_Intelligence_Report.pdf'; // ← добавляем .pdf тут
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ PDF download started');
        
        // Трекинг
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'pdf',
                'event_label': 'sample_report'
            });
        }
        
    } catch (error) {
        console.error('Download error:', error);
        // Fallback
        window.open('pdf-templates/Matrix_Intelligence_Report', '_blank');
    }
}

window.generateSamplePDF = generateSamplePDF;
console.log('✅ PDF Generator loaded - correct file naming');