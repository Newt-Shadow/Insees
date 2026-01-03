import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1080, height: 1080 };
export const contentType = "image/png";

export default function OpenGraphSquareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #020617, #000000)",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI",
        }}
      >
        {/* Main Wrapper */}
        <div
          style={{
            width: "100%",
            padding: "0 120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Accent */}
          <div
            style={{
              width: 80,
              height: 6,
              backgroundColor: "#10b981",
              borderRadius: 999,
              marginBottom: 40,
            }}
          />

          {/* Brand */}
          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            INSEES
          </div>

          {/* Descriptor */}
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              fontWeight: 500,
              color: "#d1d5db",
              maxWidth: 820,
            }}
          >
            Instrumentation & Electronics Engineering Society
          </div>

          {/* Institution */}
          <div
            style={{
              marginTop: 36,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "#10b981",
              textTransform: "uppercase",
            }}
          >
            NIT SILCHAR
          </div>
        </div>
      </div>
    ),
    size
  );
}
