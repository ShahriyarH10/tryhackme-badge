export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const userPublicId = req.query.userPublicId || "4801665";
  const apiUrl = `https://tryhackme.com/api/badges/public-profile/${userPublicId}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const userName = data.userName || "Unknown User";
    const totalBadges = data.badges ? data.badges.length : 0;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="120">
        <rect width="350" height="120" fill="#0d1117" rx="10" />
        <text x="175" y="40" font-family="Arial" font-size="16" fill="#00ff88" text-anchor="middle" font-weight="bold">
          TryHackMe Profile
        </text>
        <text x="175" y="70" font-family="Arial" font-size="14" fill="#ffffff" text-anchor="middle">
          ${userName}
        </text>
        <text x="175" y="95" font-family="Arial" font-size="12" fill="#cccccc" text-anchor="middle">
          Badges: ${totalBadges}
        </text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);

  } catch (error) {
    console.error('Error:', error);
    
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="120">
        <rect width="350" height="120" fill="#2d1b1b" rx="10" />
        <text x="175" y="60" font-family="Arial" font-size="14" fill="#ff4444" text-anchor="middle">
          Error loading profile
        </text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
}