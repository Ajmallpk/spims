export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);

      // Example:
      // /api/proxy?path=admin/login/
      const path = url.searchParams.get("path") || "";

      // Preserve all query parameters except internal "path"
      const backendParams = new URLSearchParams(url.searchParams);
      backendParams.delete("path");

      const queryString = backendParams.toString();

      const backendUrl =
        `https://52.66.253.103/api/${path}` +
        (queryString ? `?${queryString}` : "");

      console.log(
        "Vercel Proxy:",
        request.method,
        backendUrl
      );

      const headers = new Headers(request.headers);

      // Backend should see its own host
      headers.set("host", "52.66.253.103");

      const response = await fetch(backendUrl, {
        method: request.method,
        headers,
        body:
          request.method === "GET" ||
          request.method === "HEAD"
            ? undefined
            : request.body,
        redirect: "manual",
      });

      const responseHeaders = new Headers(response.headers);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

    } catch (error) {
      console.error("Vercel Proxy Error:", error);

      return Response.json(
        {
          success: false,
          message: "Vercel proxy failed",
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
  },
};
