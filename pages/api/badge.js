// Example: Convert API data to SVG chart
async function convertApiToSvg() {
    try {
        // Fetch data from API
        const response = await fetch('https://tryhackme.com/api/v2/badges/public-profile?userPublicId=4801665');
        const data = await response.json();
        
        // Generate SVG from data
        const svg = generateSvgFromData(data);
        return svg;
    } catch (error) {
        console.error('Error converting API to SVG:', error);
    }
}

function generateSvgFromData(data) {
    const width = 400;
    const height = 300;
    
    return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            ${data.map((item, index) => `
                <rect x="${index * 40}" y="${height - item.value}" 
                      width="30" height="${item.value}" 
                      fill="${item.color || '#3498db'}"/>
                <text x="${index * 40 + 15}" y="${height - 10}" 
                      text-anchor="middle" font-size="12">${item.label}</text>
            `).join('')}
        </svg>
    `;
}