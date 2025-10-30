// api/badge.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const username = req.query.username || "ShahriyarH10";
  const apiUrl = `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=4801665`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const user = data.userName || username;
    const points = data.points || "N/A";
    const rank = data.rank || "N/A";

    // Build SVG badge
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="100">
        <rect width="350" height="100" fill="#1a1a1a" rx="10"/>
        <text x="50%" y="35" font-size="20" fill="#00ff88" text-anchor="middle" font-family="monospace">TryHackMe Profile</text>
        <text x="50%" y="65" font-size="14" fill="#ffffff" text-anchor="middle" font-family="monospace">
          ${user} | Rank: ${rank} | Points: ${points}
        </text>
      </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  } catch (err) {
    res.status(500).send("Error fetching TryHackMe data");
  }
}
