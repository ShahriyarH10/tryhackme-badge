exports.handler = async function(event, context) {
  const userPublicId = event.queryStringParameters?.userPublicId || "4801665";
  
  try {
    const response = await fetch(`https://tryhackme.com/api/badges/public-profile/${userPublicId}`);
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
          ${userName.replace(/[<>&]/g, '')}
        </text>
        <text x="175" y="95" font-family="Arial" font-size="12" fill="#cccccc" text-anchor="middle">
          Badges: ${totalBadges}
        </text>
      </svg>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      },
      body: svg
    };

  } catch (error) {
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="120">
        <rect width="350" height="120" fill="#2d1b1b" rx="10" />
        <text x="175" y="60" font-family="Arial" font-size="14" fill="#ff4444" text-anchor="middle">
          Error loading profile
        </text>
      </svg>
    `;
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'image/svg+xml'
      },
      body: errorSvg
    };
  }
};