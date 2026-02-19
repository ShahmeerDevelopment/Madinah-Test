export default function handler(req, res) {
  const robotsTxt = `User-agent: *
Disallow: /cdn-cgi/`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(robotsTxt);
}