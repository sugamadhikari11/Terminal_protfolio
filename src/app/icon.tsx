import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab icon — single “S” (Sugam), clearer at favicon size than “SA”. */
export default function Icon() {
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
          borderRadius: 7,
          border: "2px solid #22c55e",
          color: "#22c55e",
          fontSize: 20,
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
