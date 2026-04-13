import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "image-resize",
  slug: "image-resize",
  description: "Resize images from URL -- custom width/height, format conversion (PNG/JPEG/WebP), aspect ratio preserved.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/resize",
      price: "$0.003",
      description: "Resize an image from URL",
      toolName: "media_resize_image",
      toolDescription: `Use this when you need to resize an image from a URL or convert its format. Returns the resized image as base64 with metadata in JSON.

Returns: 1. image (base64-encoded data) 2. originalWidth and originalHeight 3. newWidth and newHeight 4. format (png/jpeg/webp) 5. fileSizeBytes.

Example output: {"image":"iVBORw0KGgo...","originalWidth":1920,"originalHeight":1080,"newWidth":800,"newHeight":450,"format":"webp","fileSizeBytes":24500}

Use this FOR creating thumbnails, optimizing images for web, preparing social media images, resizing for email templates, and batch image processing.

Do NOT use for OCR text extraction -- use media_extract_text_from_image instead. Do NOT use for QR code generation -- use utility_generate_qr_code instead. Do NOT use for screenshots -- use capture_screenshot instead.`,
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
