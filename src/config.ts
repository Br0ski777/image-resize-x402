import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "image-resize",
  slug: "image-resize",
  description: "Resize images from URL with format conversion support.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/resize",
      price: "$0.003",
      description: "Resize an image from URL",
      toolName: "media_resize_image",
      toolDescription: "Use this when you need to resize an image from a URL. Specify target width and/or height, and optionally convert format (png, jpeg, webp). Returns the resized image as base64 with metadata (original size, new size, format). Do NOT use for OCR text extraction — use media_extract_text_ocr instead. Do NOT use for QR code generation — use utility_generate_qr_code instead.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL of the image to resize" },
          width: { type: "number", description: "Target width in pixels (maintains aspect ratio if height is omitted)" },
          height: { type: "number", description: "Target height in pixels (maintains aspect ratio if width is omitted)" },
          format: { type: "string", description: "Output format: 'png', 'jpeg', or 'webp' (default: png)" },
        },
        required: ["url"],
      },
    },
  ],
};
