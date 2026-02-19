export default function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Security Check - Madinah</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #1976d2;
            margin-bottom: 16px;
            font-size: 1.75rem;
            margin-top: 0;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .challenge-container {
            margin: 30px 0;
            text-align: center;
        }
        .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #eee;
            font-size: 0.75rem;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Security Check</h1>
        <p>This security check helps keep our website safe. Please complete the challenge below to continue.</p>
        
        <div class="challenge-container">
            ::CAPTCHA_BOX::
        </div>
        
        <div class="footer">
            This security feature is provided by Cloudflare to protect against automated attacks.<br>
            If you continue to experience issues, please contact support@madinah.com
        </div>
    </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
