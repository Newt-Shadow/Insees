import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #103020 0%, #000000 80%)",
          position: "relative",
        }}
      >
        {/* GRID */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(52,211,153,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />

        {/* CENTER LINE */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: 4,
            height: "50%",
            background: "linear-gradient(to top, #f59e0b, transparent)",
            transform: "translateX(-50%)",
            boxShadow: "0 0 20px #f59e0b",
            display: "flex",
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 40,
            border: "1px solid rgba(52,211,153,0.3)",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 20,
            boxShadow: "0 0 60px rgba(52,211,153,0.25)",
          }}
        >
          {/* ICON */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              border: "4px solid #34d399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 0 30px #34d399",
              color: "#34d399",
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            ⚡
          </div>

          {/* TITLE */}
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 100,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textShadow: "0 0 40px rgba(52,211,153,0.6)",
            }}
          >
            INSEES
          </div>

          {/* SUBTITLE */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 12,
              fontSize: 28,
              fontFamily: "monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            <span style={{ color: "#f59e0b" }}>// NIT SILCHAR</span>
            <span style={{ color: "#34d399" }}>•</span>
            <span style={{ color: "#f59e0b" }}>//</span>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            display: "flex",
            fontFamily: "monospace",
            fontSize: 16,
            color: "#34d399",
            opacity: 0.8,
          }}
        >
          SYSTEM_STATUS:&nbsp;<span style={{ color: "#ffffff" }}>ONLINE</span>
        </div>
      </div>
    ),
    size
  );
}
