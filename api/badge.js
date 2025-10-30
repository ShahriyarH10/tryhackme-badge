export default async function handler(req, res) {
  const userPublicId = req.query.userPublicId || "4801665"; // Your TryHackMe public ID
  const apiUrl = `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${userPublicId}`;

  try {
    // Use native fetch (Node 18+)
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Inspect returned fields safely
    const userName = data.userName || "Unknown User";
    const totalBadges = data.badges ? data.badges.length : 0;

    // Create SVG badge dynamically
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="100">
        <rect width="400" height="100" fill="#0d1117" rx="10" />
        <text x="50%" y="35" font-size="20" fill="#00ff88" text-anchor="middle" font-family="monospace">
          TryHackMe Profile
        </text>
        <text x="50%" y="65" font-size="14" fill="#ffffff" text-anchor="middle" font-family="monospace">
          ${userName} | Badges: ${totalBadges}
        </text>
      </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
  } catch (error) {
    console.error("Error fetching TryHackMe data:", error);
    res.status(500).send("Error fetching TryHackMe data");
  }
}
