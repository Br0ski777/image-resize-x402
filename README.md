# Image Resize API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://image-resize.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Resize images from URL -- custom width/height, format conversion (PNG/JPEG/WebP), aspect ratio preserved. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "image-resize": {
      "url": "https://image-resize.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://image-resize.api.klymax402.com/api/resize" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `media_resize_image` | POST | `/api/resize` | $0.003 | Resize an image from URL |

### `media_resize_image`

Use this when you need to resize an image from a URL or convert its format. Returns the resized image as base64 with metadata in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | URL of the image to resize |
| `width` | number | no | Target width in pixels (maintains aspect ratio if height is omitted) |
| `height` | number | no | Target height in pixels (maintains aspect ratio if width is omitted) |
| `format` | string | no | Output format: 'png', 'jpeg', or 'webp' (default: png) |

Example response:

```json
{"image":"iVBORw0KGgo...","originalWidth":1920,"originalHeight":1080,"newWidth":800,"newHeight":450,"format":"webp","fileSizeBytes":24500}
```

**When to use**: creating thumbnails, optimizing images for web, preparing social media images, resizing for email templates, and batch image processing.

**Not for**: OCR text extraction (use `media_extract_text_from_image`), QR code generation (use `utility_generate_qr_code`), screenshots (use `capture_screenshot`).

## Example agent prompts

- "Resize an image from a URL or convert its format"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
