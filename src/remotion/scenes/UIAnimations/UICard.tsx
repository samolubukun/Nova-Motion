/**
 * UICard - カードアニメーション - ホバーエフェクト
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, lerp, font } from "../../common";

export const UICard = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // メインカードのアニメーション
  const mainProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // サブカードのアニメーション
  const subProgress = spring({
    frame: frame - startDelay - 15,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  // ホバーエフェクト（フレームベース）
  const hoverStart = startDelay + 50;
  const isHovered = frame >= hoverStart;
  const hoverScale = isHovered ? 1.02 : 1;

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* 背景装飾ライン */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          width: lerp(frame, [startDelay + 20, startDelay + 50], [0, 200]),
          height: 1,
          background: C.gray[800],
        }}
      />

      {/* 左上のラベル */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 80,
          fontFamily: font,
          fontSize: 11,
          color: C.gray[600],
          letterSpacing: 3,
          opacity: lerp(frame, [startDelay, startDelay + 20], [0, 1]),
        }}
      >
        FEATURED WORK
      </div>

      {/* メインカード（大きく左寄り） */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 140,
          width: 500,
          height: 380,
          background: C.gray[900],
          borderRadius: 4,
          overflow: "hidden",
          transform: `translateX(${(1 - mainProgress) * -100}px) scale(${hoverScale})`,
          opacity: mainProgress,
          border: `1px solid ${isHovered ? C.accent : C.gray[800]}`,
          transition: "border-color 0.3s",
        }}
      >
        {/* カード内のアクセントライン */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 4,
            height: "100%",
            background: C.accent,
          }}
        />
        
        {/* コンテンツエリア */}
        <div style={{ padding: "40px 40px 40px 50px" }}>
          <div
            style={{
              fontFamily: font,
              fontSize: 12,
              color: C.accent,
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            01 — PROJECT
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 42,
              fontWeight: 700,
              color: C.white,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Brand
            <br />
            Identity
          </div>
          <div
            style={{
              fontFamily: font,
              fontSize: 15,
              color: C.gray[400],
              lineHeight: 1.7,
              maxWidth: 350,
            }}
          >
            Complete visual identity system including logo, typography, and brand guidelines.
          </div>
        </div>

        {/* 下部のタグ */}
        <div
          style={{
            position: "absolute",
            left: 50,
            bottom: 40,
            display: "flex",
            gap: 10,
          }}
        >
          {["Branding", "Strategy"].map((tag) => (
            <div
              key={`tag-${tag}`}
              style={{
                fontFamily: font,
                fontSize: 11,
                color: C.gray[500],
                padding: "6px 12px",
                border: `1px solid ${C.gray[800]}`,
                borderRadius: 2,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* サブカード（右側、小さめ、上にオフセット） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 100,
          width: 280,
          background: C.gray[900],
          borderRadius: 4,
          padding: 30,
          transform: `translateY(${(1 - subProgress) * 50}px)`,
          opacity: subProgress,
          border: `1px solid ${C.gray[800]}`,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 11,
            color: C.gray[600],
            letterSpacing: 2,
            marginBottom: 15,
          }}
        >
          NEXT UP
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 22,
            fontWeight: 600,
            color: C.white,
            marginBottom: 10,
          }}
        >
          Digital Platform
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: 13,
            color: C.gray[500],
            lineHeight: 1.6,
          }}
        >
          Web application design and development
        </div>
      </div>

      {/* 右下の番号装飾 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 60,
          fontFamily: font,
          fontSize: 100,
          fontWeight: 200,
          color: C.gray[900],
          opacity: subProgress,
        }}
      >
        02
      </div>
    </AbsoluteFill>
  );
};
