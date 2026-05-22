export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const owner = "yosintv2";
  const repo = "blog";
  const branch = "main";
  const token = process.env.GITHUB_TOKEN;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const password =
    req.method === "GET"
      ? req.query.password
      : req.body?.password;

  if (password !== adminPassword) {
    return res.status(401).json({ error: "Wrong password" });
  }

  try {
    if (req.method === "GET" && req.query.action === "list") {
      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Blog-Admin"
          }
        }
      );

      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);

      const files = data
        .filter(item => item.type === "file" && item.name.endsWith(".json"))
        .map(item => item.name)
        .sort();

      return res.status(200).json({ files });
    }

    if (req.method === "GET") {
      const path = req.query.path;

      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Blog-Admin"
          }
        }
      );

      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);

      const content = JSON.parse(
        Buffer.from(data.content, "base64").toString("utf8")
      );

      return res.status(200).json({
        path,
        content,
        sha: data.sha
      });
    }

    if (req.method === "POST") {
      const { path, content, message } = req.body;

      const current = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Blog-Admin"
          }
        }
      );

      const currentData = await current.json();
      if (!current.ok) return res.status(current.status).json(currentData);

      const update = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "YoSinTV-Blog-Admin"
          },
          body: JSON.stringify({
            message: message || `Update ${path} from Blog Admin`,
            content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
            sha: currentData.sha,
            branch
          })
        }
      );

      const result = await update.json();
      if (!update.ok) return res.status(update.status).json(result);

      return res.status(200).json({
        success: true,
        path,
        commit: result.commit?.html_url || null
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
