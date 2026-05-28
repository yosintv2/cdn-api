export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const owner = "yosintv2";
  const repo = "json-api";
  const branch = "main";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "Missing GITHUB_TOKEN in Vercel Environment Variables"
    });
  }

  try {
    if (req.method === "GET") {
      const path = req.query.path;

      if (!path) {
        return res.status(400).json({
          error: "Missing file path"
        });
      }

      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Admin"
          }
        }
      );

      const data = await r.json();

      if (!r.ok) {
        return res.status(r.status).json(data);
      }

      const rawContent = Buffer.from(
        data.content,
        "base64"
      ).toString("utf8");

      const content = JSON.parse(rawContent);

      return res.status(200).json({
        path,
        content,
        sha: data.sha
      });
    }

    if (req.method === "POST") {
      const { path, content, message } = req.body;

      if (!path) {
        return res.status(400).json({
          error: "Missing file path"
        });
      }

      if (!content) {
        return res.status(400).json({
          error: "Missing JSON content"
        });
      }

      const current = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "YoSinTV-Admin"
          }
        }
      );

      const currentData = await current.json();

      if (!current.ok) {
        return res.status(current.status).json(currentData);
      }

      const commitMessage =
        message && message.trim()
          ? message.trim()
          : `Update ${path} from YoSinTV Admin`;

      const update = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "YoSinTV-Admin"
          },
          body: JSON.stringify({
            message: commitMessage,
            content: Buffer.from(
              JSON.stringify(content, null, 2)
            ).toString("base64"),
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
        message: "File updated successfully",
        commit: result.commit?.html_url || null,
        path
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
