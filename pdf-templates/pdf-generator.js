// SUPER SIMPLE TEST VERSION
window.generateSamplePDF = function() {
    console.log('🚀 TEST: Downloading PDF...');
    
    // Самый простой и надежный способ
    const link = document.createElement('a');
    link.href = '/downloads/market_research_sample.pdf';
    link.download = 'Matrix_Report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ TEST: Download initiated');
};