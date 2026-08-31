export default async function handler(req, res) {
  try {
    const path = req.query.path;

    const pathArray = Array.isArray(path) ? path : [path];

    const backendPath = "/" + pathArray.join("/");

    const query = new URL(req.url, `https://${req.headers.host}`).search;

    const backendUrl = `https://52.66.253.103/api${backendPath}${query}`;

    console.log("Vercel proxy:", req.method, backendUrl);

    const headers = {};

    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();

      if (
        lowerKey !== "host" &&
        lowerKey !== "content-length"
      ) {
        headers[key] = value;
      }
    }

    headers["host"] = "52.66.253.103";

    const options = {
      method: req.method,
      headers,
      redirect: "manual",
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = req;
    }

    const response = await fetch(backendUrl, options);

    res.status(response.status);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.arrayBuffer();

    res.send(Buffer.from(body));

  } catch (error) {
    console.error("Vercel proxy error:", error);

    res.status(500).json({
      success: false,
      message: "Proxy error",
      error: error.message,
    });
  }
}
