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
          backgroundColor: "#050505",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        }}
      >
        {/* Main Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 80,
            borderRadius: 24,
            background:
              "linear-gradient(180deg, rgba(16,185,129,0.08), rgba(0,0,0,0))",
            border: "1px solid rgba(16,185,129,0.25)",
            boxShadow: "0 0 80px rgba(16,185,129,0.18)",
          }}
        >
          {/* INSEES */}
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            INSEES
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 500,
              color: "#d1d5db",
              marginBottom: 26,
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            Electronics & Instrumentation Engineering Society
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 26,
            }}
          >
            <div
              style={{
                width: 120,
                height: 2,
                backgroundColor: "#10b981",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: "#10b981",
              }}
            />
            <div
              style={{
                width: 120,
                height: 2,
                backgroundColor: "#10b981",
                opacity: 0.6,
              }}
            />
          </div>

          {/* Institute */}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#10b981",
              marginBottom: 14,
            }}
          >
            NIT SILCHAR
          </div>

          {/* Footer line */}
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            Official Technical & Cultural Society
          </div>
        </div>
      </div>
    ),
    size
  );
}
