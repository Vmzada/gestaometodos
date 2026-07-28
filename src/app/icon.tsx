import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#020617",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 24,
            height: 18,
            borderRadius: 4,
            background: "linear-gradient(135deg, #6ee7b7 0%, #2dd4bf 100%)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ width: "100%", height: 5, background: "#020617", marginTop: 5 }} />
          <div
            style={{
              position: "absolute",
              right: 3,
              bottom: 3,
              width: 4,
              height: 4,
              borderRadius: 2,
              background: "#020617",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
