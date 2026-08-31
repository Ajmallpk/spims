export default async function handler(req, res) {
  try {
    const capturedPath = req.query.path;

    let path;

    if (Array.isArray(capturedPath)) {
      path = capturedPath.join("/");
    } else {
      path = capturedPath || "";
    }

    // Keep original query parameters except the internal "path" parameter.
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query || {})) {
      if (key === "path") continue;

      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item));
      } else if (value !== undefined) {
        searchParams.append(key, value);
      }
    }

    const queryString = searchParams.toString();

    const backendUrl =
      `https://52.66.253.103/api/${path}` +
      (queryString ? `?${queryString}` : "");

    console.log("PROXY:", req.method, backendUrl);

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

    headers.host = "52.66.253.103";

    const fetchOptions = {
      method: req.method,
      headers,
      redirect: "manual",
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (Buffer.isBuffer(req.body)) {
        fetchOptions.body = req.body;
      } else if (typeof req.body === "string") {
        fetchOptions.body = req.body;
      } else if (req.body !== undefined) {
        fetchOptions.body = JSON.stringify(req.body);
      }
    }

    const backendResponse = await fetch(backendUrl, fetchOptions);

    res.status(backendResponse.status);

    // Forward response headers.
    backendResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "set-cookie") {
        res.setHeader(key, value);
      }
    });

    // Preserve multiple Set-Cookie headers.
    if (
      backendResponse.headers.getSetCookie &&
      typeof backendResponse.headers.getSetCookie === "function"
    ) {
      const cookies = backendResponse.headers.getSetCookie();

      if (cookies.length) {
        res.setHeader("Set-Cookie", cookies);
      }
    } else {
      const cookie = backendResponse.headers.get("set-cookie");

      if (cookie) {
        res.setHeader("Set-Cookie", cookie);
      }
    }

    const body = Buffer.from(
      await backendResponse.arrayBuffer()
    );

    res.send(body);

  } catch (error) {
    console.error("PROXY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Vercel API proxy failed",
    });
  }
}
