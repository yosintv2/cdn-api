export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const owner = "yosintv2";
  const repo = "blog";
  const branch = "main";
  const folder = "me";

  const token = String(process.env.GITHUB_TOKEN || "").trim();
  const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

  const password =
    req.method === "GET"
      ? String(req.query.password || "").trim()
      : String(req.body?.password || "").trim();

  if (!adminPassword) {
    return res.status(500).json({
      error: "ADMIN_PASSWORD is missing"
    });
  }

  if (!token) {
    return res.status(500).json({
      error: "GITHUB_TOKEN is missing"
    });
  }

  if (password !== adminPassword) {
    return res.status(401).json({
      error: "Wrong password"
    });
  }

  try {
    if (req.method === "GET" && req.query.action === "list") {
      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Me-Notes"
          }
        }
      );

      const data = await r.json();

      if (!r.ok) {
        return res.status(r.status).json(data);
      }

      const files = data
        .filter(item => item.type === "file" && item.name.endsWith(".json"))
        .map(item => item.name)
        .sort();

      return res.status(200).json({
        success: true,
        folder,
        files
      });
    }

    if (req.method === "GET") {
      const file = String(req.query.file || "").trim();

      if (!file || !file.endsWith(".json")) {
        return res.status(400).json({
          error: "Missing or invalid .json file"
        });
      }

      const path = `${folder}/${file}`;

      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Me-Notes"
          }
        }
      );

      const data = await r.json();

      if (!r.ok) {
        return res.status(r.status).json(data);
      }

      const content = Buffer.from(
        data.content,
        "base64"
      ).toString("utf8");

      return res.status(200).json({
        success: true,
        file,
        path,
        content,
        sha: data.sha
      });
    }

    if (req.method === "POST") {
      const file = String(req.body?.file || "").trim();
      const content = String(req.body?.content ?? "");
      const message = String(req.body?.message || "").trim();

      if (!file || !file.endsWith(".json")) {
        return res.status(400).json({
          error: "Missing or invalid .json file"
        });
      }

      const path = `${folder}/${file}`;

      const current = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Me-Notes"
          }
        }
      );

      const currentData = await current.json();

      if (!current.ok) {
        return res.status(current.status).json(currentData);
      }

      const update = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "YoSinTV-Me-Notes"
          },
          body: JSON.stringify({
            message: message || `Update ${path} note`,
            content: Buffer.from(content).toString("base64"),
            sha: currentData.sha,
            branch
          })
        }
      );

      const result = await update.json();

      if (!update.ok) {
        return res.status(update.status).json(result);
      }

      return res.status(200).json({
        success: true,
        file,
        path,
        commit: result.commit?.html_url || null
      });
    }

    return res.status(405).json({
      error: "Method not allowed"
    });

  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }
}
