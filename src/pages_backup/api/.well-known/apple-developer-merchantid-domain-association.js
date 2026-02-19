// pages/api/.well-known/apple-developer-merchantid-domain-association.js
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      ".well-known",
      "apple-developer-merchantid-domain-association"
    );
    const fileContent = await fs.readFile(filePath);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.send(fileContent);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load file" });
  }
}
