import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        {/* Main Content */}
        <div
          style={{
            width: "100%",
            padding: "0 120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Accent Line */}
          <div
            style={{
              width: 90,
              height: 6,
              backgroundColor: "#10b981",
              borderRadius: 999,
              marginBottom: 32,
            }}
          />

          {/* Brand */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            INSEES
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: 24,
              fontSize: 34,
              fontWeight: 500,
              color: "#d1d5db",
              maxWidth: 900,
            }}
          >
            Instrumentation & Electronics Engineering Society
          </div>

          {/* Institute */}
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#10b981",
            }}
          >
            NIT SILCHAR 
          </div>

          {/* Micro tagline */}
          
        </div>
      </div>
    ),
    size
  );
}
