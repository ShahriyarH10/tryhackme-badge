export default async function handler(req, res) {
  // Add CORS headers for web usage
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userPublicId = req.query.userPublicId || "4801665";
  const apiUrl = `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${userPublicId}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Enhanced data extraction with better fallbacks
    const userName = data.userName || data.username || "Unknown User";
    const totalBadges = data.badges?.length || 0;
    const userRank = data.userRank || data.rank || "N/A";

    // More sophisticated SVG with better styling
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="120" viewBox="0 0 350 120">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0d1117" />
            <stop offset="100%" stop-color="#1a2332" />
          </linearGradient>
        </defs>
        
        <rect width="350" height="120" fill="url(#bgGradient)" rx="12" stroke="#00ff88" stroke-width="2"/>
        
        <text x="175" y="40" font-size="18" fill="#00ff88" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">
          TryHackMe Profile
        </text>
        
        <text x="175" y="65" font-size="14" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">
          ${escapeHtml(userName)}
        </text>
        
        <text x="175" y="85" font-size="12" fill="#cccccc" text-anchor="middle" font-family="Arial, sans-serif">
          Badges: ${totalBadges} | Rank: ${escapeHtml(userRank.toString())}
        </text>
      </svg>
    `;

    // Cache control for better performance
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(svg);

  } catch (error) {
    console.error('Error fetching TryHackMe data:', error);
    
    // Error SVG instead of plain text
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="120">
        <rect width="350" height="120" fill="#2d1b1b" rx="12" stroke="#ff4444" stroke-width="2"/>
        <text x="50%" y="50%" font-size="14" fill="#ff8888" text-anchor="middle" font-family="Arial, sans-serif" dy=".3em">
          Error loading profile
        </text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
}

// Basic HTML escaping for security
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}