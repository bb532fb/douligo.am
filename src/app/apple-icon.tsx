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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#58CC02",
          borderRadius: 40,
        }}
      >
        <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
          <div
            style={{
              width: 40,
              height: 50,
              background: "white",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 18, height: 18, background: "#3C3C3C", borderRadius: 999 }} />
          </div>
          <div
            style={{
              width: 40,
              height: 50,
              background: "white",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 18, height: 18, background: "#3C3C3C", borderRadius: 999 }} />
          </div>
        </div>
        <div
          style={{
            width: 56,
            height: 28,
            marginTop: 10,
            border: "7px solid #3C3C3C",
            borderTop: "none",
            borderRadius: "0 0 56px 56px",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
