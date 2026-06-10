export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const owner = "yosintv2";
  const repo = "blog";
  const branch = "main";
  const token = String(process.env.GITHUB_TOKEN || "").trim();
  const adminPassword = String(process.env.ADMIN_PASSWORD || "").trim();

  const password = req.method === "GET"
    ? String(req.query.password || "").trim()
    : String(req.body?.password || "").trim();

  if (!adminPassword) return res.status(500).json({ error: "ADMIN_PASSWORD env missing" });
  if (!token) return res.status(500).json({ error: "GITHUB_TOKEN env missing" });
  if (password !== adminPassword) return res.status(401).json({ error: "Wrong password" });

  const gh = (path, opts = {}) => fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "YoSinTV-Admin" }, ...opts }
  );

  try {
    // List files
    if (req.method === "GET" && req.query.action === "list") {
      const r = await gh("");
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);
      const files = data.filter(i => i.type === "file" && i.name.endsWith(".json")).map(i => i.name).sort();
      return res.status(200).json({ success: true, files });
    }

    // Load file
    if (req.method === "GET") {
      const path = String(req.query.path || "").trim();
      if (!path) return res.status(400).json({ error: "Missing path" });
      const r = await gh(path);
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);
      const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf8"));
      return res.status(200).json({ path, content, sha: data.sha });
    }

    // Save file
    if (req.method === "POST") {
      const { path, content, message } = req.body;
      if (!path) return res.status(400).json({ error: "Missing path" });

      const cur = await gh(path);
      const curData = await cur.json();
      if (!cur.ok) return res.status(cur.status).json(curData);

      const update = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": "YoSinTV-Admin" },
          body: JSON.stringify({
            message: message || `Update ${path}`,
            content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
            sha: curData.sha,
            branch
          })
        }
      );

      const result = await update.json();
      if (!update.ok) return res.status(update.status).json(result);
      return res.status(200).json({ success: true, path, commit: result.commit?.html_url || null });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
