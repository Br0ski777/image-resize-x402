import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

export function registerRoutes(app: Hono) {
  app.post("/api/resize", async (c) => {
    await tryRequirePayment(0.003);
    const body = await c.req.json().catch(() => null);
    if (!body?.url) {
      return c.json({ error: "Missing required field: url" }, 400);
    }

    const url: string = body.url;
    const width: number | undefined = body.width;
    const height: number | undefined = body.height;
    const format: string = (body.format || "png").toLowerCase();

    if (!["png", "jpeg", "webp"].includes(format)) {
      return c.json({ error: "Invalid format. Supported: png, jpeg, webp" }, 400);
    }

    if (!width && !height) {
      return c.json({ error: "Provide at least one of: width, height" }, 400);
    }

    try {
      // Fetch the image
      const imgResp = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!imgResp.ok) {
        return c.json({ error: `Failed to fetch image: HTTP ${imgResp.status}` }, 400);
      }

      const contentType = imgResp.headers.get("content-type") || "";
      if (!contentType.includes("image")) {
        return c.json({ error: "URL does not point to an image" }, 400);
      }

      const originalBuffer = await imgResp.arrayBuffer();
      const originalSize = originalBuffer.byteLength;

      // Use sharp for resizing
      let sharp: any;
      try {
        sharp = (await import("sharp")).default;
      } catch {
        // Fallback: return base64 of original with metadata if sharp is unavailable
        const base64 = Buffer.from(originalBuffer).toString("base64");
        return c.json({
          warning: "sharp not available — returning original image as base64",
          base64,
          originalSizeBytes: originalSize,
          mimeType: contentType,
          format: "original",
        });
      }

      const resizeOptions: any = {};
      if (width) resizeOptions.width = Math.round(width);
      if (height) resizeOptions.height = Math.round(height);
      resizeOptions.fit = "inside";
      resizeOptions.withoutEnlargement = true;

      let pipeline = sharp(Buffer.from(originalBuffer)).resize(resizeOptions);

      if (format === "png") pipeline = pipeline.png();
      else if (format === "jpeg") pipeline = pipeline.jpeg({ quality: 85 });
      else if (format === "webp") pipeline = pipeline.webp({ quality: 85 });

      const resizedBuffer = await pipeline.toBuffer();
      const metadata = await sharp(resizedBuffer).metadata();
      const base64 = resizedBuffer.toString("base64");

      return c.json({
        base64,
        mimeType: `image/${format}`,
        format,
        originalSizeBytes: originalSize,
        resizedSizeBytes: resizedBuffer.length,
        width: metadata.width,
        height: metadata.height,
        compressionRatio: parseFloat((resizedBuffer.length / originalSize).toFixed(3)),
      });
    } catch (e: any) {
      return c.json({ error: `Failed to resize image: ${e.message}` }, 500);
    }
  });
}
