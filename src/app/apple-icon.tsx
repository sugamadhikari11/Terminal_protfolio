import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0e0c",
          borderRadius: 36,
          border: "8px solid #22c55e",
          color: "#22c55e",
          fontSize: 110,
          fontWeight: 700,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
