const theme = require('../config/theme');

// Format currency values
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Format table data with colors
const formatTableData = (data) => {
    if (!Array.isArray(data)) return data;
    
    return data.map(row => {
        const formattedRow = {};
        Object.entries(row).forEach(([key, value]) => {
            if (typeof value === 'number' && key.toLowerCase().includes('salary')) {
                formattedRow[key] = theme.styles.value(formatCurrency(value));
            } else if (key.toLowerCase().includes('name')) {
                formattedRow[key] = theme.styles.label(value);
            } else {
                formattedRow[key] = value;
            }
        });
        return formattedRow;
    });
};

// Create boxed content
const createBox = (content, title = '') => {
    const boxContent = title 
        ? `${theme.styles.heading(title)}\n${content}`
        : content;
    
    return `
╔════════════════════════════════════╗
${boxContent}
╚════════════════════════════════════╝`;
};

// Format percentage values
const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
};

// Create loading message
const createLoadingMessage = (action) => {
    return `${theme.ui.arrow} ${action}...`;
};

module.exports = {
    formatCurrency,
    formatTableData,
    createBox,
    formatPercentage,
    createLoadingMessage
};
// updated