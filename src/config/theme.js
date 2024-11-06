const chalk = require('chalk');

const theme = {
    // Brand Colors
    colors: {
        primary: '#0066CC',     // Professional Blue
        secondary: '#2E8B57',   // Sea Green
        accent: '#FF8C00',      // Dark Orange
        success: '#28A745',     // Success Green
        warning: '#FFC107',     // Warning Yellow
        danger: '#DC3545',      // Danger Red
        info: '#17A2B8',        // Info Blue
        light: '#F8F9FA',       // Light Gray
        dark: '#343A40'         // Dark Gray
    },

    // Style functions
    styles: {
        heading: (text) => chalk.hex('#0066CC').bold(text),
        subheading: (text) => chalk.hex('#2E8B57')(text),
        success: (text) => chalk.hex('#28A745')(text),
        error: (text) => chalk.hex('#DC3545')(text),
        warning: (text) => chalk.hex('#FFC107')(text),
        info: (text) => chalk.hex('#17A2B8')(text),
        label: (text) => chalk.hex('#0066CC').bold(text),
        value: (text) => chalk.white(text)
    },

    // ASCII Art Logos
    logos: {
        main: `
   ╔═══════════════════════════════════════════╗
   ║             StaffSync Pro                 ║
   ║     Modern Staff Management Solution      ║
   ╚═══════════════════════════════════════════╝`,
        
        mini: `[SSP]`
    },

    // UI Components
    ui: {
        separator: '═══════════════════════════════════════════',
        bullet: '•',
        arrow: '→',
        checkmark: '✓',
        cross: '×',
        menu: {
            prefix: '  ',
            activePrefix: '→ ',
            inactivePrefix: '  '
        }
    }
};

module.exports = theme;