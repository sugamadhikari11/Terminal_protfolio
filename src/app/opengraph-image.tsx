import { ImageResponse } from "next/og";

export const alt =
  "Sugam Adhikari (SA) — full-stack, Web3, and data science portfolio";
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
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #0b1220 0%, #12324a 48%, #1a4d3a 100%)",
          color: "#f4faf8",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#86efac",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "3px solid #22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#22c55e",
            }}
          >
            S
          </div>
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Sugam Adhikari
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#c7e8ff",
              lineHeight: 1.3,
              maxWidth: 980,
            }}
          >
            Full-Stack · Web3 · Data Science
          </div>
          <div style={{ fontSize: 26, color: "#9fb8c9", maxWidth: 900 }}>
            Building at the intersection of Web3 and AI — Kathmandu, Nepal
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#a7f3d0",
          }}
        >
          <span>sugamadhikari.com.np</span>
          <span style={{ color: "#93c5fd" }}>SA</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
