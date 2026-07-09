/**
 * DemoWizard - ステップウィザードデモ
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, EASE, lerp, font } from "../../common";
import { Cursor } from "./shared/Cursor";

export const DemoWizard = ({ startDelay = 0 }: {
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 現在のステップ
  const step1End = startDelay + 35;
  const step2End = startDelay + 70;

  const currentStep = frame < step1End ? 1 : frame < step2End ? 2 : 3;

  const steps = [
    { number: 1, label: "Account", completed: currentStep > 1 },
    { number: 2, label: "Profile", completed: currentStep > 2 },
    { number: 3, label: "Complete", completed: false },
  ];

  // ボタンクリック
  const click1 = step1End - 5;
  const click2 = step2End - 5;

  // カーソル
  let cursorX = 800;
  let cursorY = 520;

  if (frame < click1) {
    cursorX = lerp(frame, [startDelay, click1], [600, 800], EASE.smooth);
    cursorY = lerp(frame, [startDelay, click1], [300, 520], EASE.smooth);
  } else if (frame < click2) {
    cursorX = lerp(frame, [step1End + 5, click2], [600, 800], EASE.smooth);
    cursorY = lerp(frame, [step1End + 5, click2], [300, 520], EASE.smooth);
  }

  return (
    <AbsoluteFill style={{ background: C.gray[950] }}>
      {/* ステッププログレス */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 100,
          right: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {steps.map((step, i) => {
          const isActive = currentStep === step.number;
          const isCompleted = step.completed;

          const stepProgress = spring({
            frame: frame - startDelay - i * 15,
            fps,
            config: { damping: 15, stiffness: 150 },
          });

          return (
            <React.Fragment key={`step-${step.number}`}>
              {/* ステップサークル */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  transform: `scale(${stepProgress})`,
                  opacity: stepProgress,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: isCompleted ? C.success : isActive ? C.accent : C.gray[800],
                    border: `2px solid ${isCompleted ? C.success : isActive ? C.accent : C.gray[700]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: font,
                    fontSize: 18,
                    fontWeight: 600,
                    color: isCompleted || isActive ? C.white : C.gray[500],
                  }}
                >
                  {isCompleted ? "✓" : step.number}
                </div>
                <div
                  style={{
                    fontFamily: font,
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? C.white : C.gray[500],
                  }}
                >
                  {step.label}
                </div>
              </div>

              {/* コネクターライン */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: C.gray[800],
                    marginTop: -30,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: step.completed ? "100%" : "0%",
                      background: C.success,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ステップコンテンツ */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 220,
          right: 200,
          bottom: 150,
          background: C.gray[900],
          borderRadius: 12,
          padding: 30,
        }}
      >
        <div
          style={{
            fontFamily: font,
            fontSize: 20,
            fontWeight: 600,
            color: C.white,
            marginBottom: 20,
          }}
        >
          {steps[currentStep - 1].label} Information
        </div>

        {/* ダミー入力フィールド */}
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {[1, 2].map((i) => (
            <div
              key={`field-${currentStep}-${i}`}
              style={{
                height: 48,
                background: C.gray[800],
                borderRadius: 8,
                border: `1px solid ${C.gray[700]}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          bottom: 80,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          style={{
            fontFamily: font,
            fontSize: 14,
            color: currentStep === 1 ? C.gray[600] : C.gray[300],
            background: C.gray[800],
            border: "none",
            borderRadius: 8,
            padding: "12px 30px",
            cursor: currentStep === 1 ? "not-allowed" : "pointer",
          }}
        >
          Back
        </button>
        <button
          type="button"
          style={{
            fontFamily: font,
            fontSize: 14,
            fontWeight: 500,
            color: C.white,
            background: currentStep === 3 ? C.success : C.accent,
            border: "none",
            borderRadius: 8,
            padding: "12px 30px",
            cursor: "pointer",
          }}
        >
          {currentStep === 3 ? "Finish" : "Next"}
        </button>
      </div>

      {/* カーソル */}
      {currentStep < 3 && (
        <Cursor
          x={cursorX}
          y={cursorY}
          clicking={
            (frame >= click1 - 2 && frame < click1 + 3) ||
            (frame >= click2 - 2 && frame < click2 + 3)
          }
        />
      )}
    </AbsoluteFill>
  );
};
