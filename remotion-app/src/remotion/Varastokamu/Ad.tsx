import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

const NAVY = "#0A1628";
const BLUE = "#3B82F6";
const BLUE_LIGHT = "#60A5FA";
const WHITE = "#F8FAFC";
const GRAY = "#94A3B8";

function useSlideUp(
  startFrame: number,
  { fps }: { fps: number },
  offset = 30,
) {
  const frame = useCurrentFrame();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const y = interpolate(progress, [0, 1], [offset, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  return { y, opacity };
}

// ─── Scene 1: Intro (frames 0–90) ───────────────────────────────────────────
const Intro: React.FC = () => {
  const { fps } = useVideoConfig();
  const logo = useSlideUp(10, { fps }, 40);
  const tagline = useSlideUp(30, { fps }, 30);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #1E3A5F 0%, ${NAVY} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Logo box */}
      <div
        style={{
          transform: `translateY(${logo.y}px)`,
          opacity: logo.opacity,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            boxShadow: `0 0 40px ${BLUE}66`,
          }}
        >
          📦
        </div>
        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: WHITE,
            fontFamily: "sans-serif",
            letterSpacing: -1,
          }}
        >
          Varasto<span style={{ color: BLUE_LIGHT }}>kamu</span>
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          transform: `translateY(${tagline.y}px)`,
          opacity: tagline.opacity,
          fontSize: 26,
          color: GRAY,
          fontFamily: "sans-serif",
          fontWeight: 400,
          letterSpacing: 0.5,
        }}
      >
        Älykäs varastonhallinta pienyrityksille
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Feature (frames 90–240) ────────────────────────────────────────
interface FeatureSceneProps {
  icon: string;
  title: string;
  subtitle: string;
  accentColor?: string;
}

const FeatureScene: React.FC<FeatureSceneProps> = ({
  icon,
  title,
  subtitle,
  accentColor = BLUE,
}) => {
  const { fps } = useVideoConfig();
  const icon_ = useSlideUp(5, { fps }, 50);
  const title_ = useSlideUp(20, { fps }, 35);
  const sub_ = useSlideUp(35, { fps }, 25);

  return (
    <AbsoluteFill
      style={{
        background: NAVY,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      {/* Icon circle */}
      <div
        style={{
          transform: `translateY(${icon_.y}px)`,
          opacity: icon_.opacity,
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: `${accentColor}22`,
          border: `2px solid ${accentColor}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 46,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${title_.y}px)`,
          opacity: title_.opacity,
          fontSize: 52,
          fontWeight: 700,
          color: WHITE,
          fontFamily: "sans-serif",
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${sub_.y}px)`,
          opacity: sub_.opacity,
          fontSize: 26,
          color: GRAY,
          fontFamily: "sans-serif",
          textAlign: "center",
          maxWidth: 700,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: CTA (frames 330–450) ───────────────────────────────────────────
const CTA: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const heading = useSlideUp(5, { fps }, 40);
  const btn = useSlideUp(25, { fps }, 30);

  // Pulse glow on button
  const glow = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.5, 1],
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #1E3A5F 0%, ${NAVY} 65%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <div
        style={{
          transform: `translateY(${heading.y}px)`,
          opacity: heading.opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: WHITE,
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          Aloita ilmaiseksi tänään
        </div>
        <div style={{ fontSize: 24, color: GRAY, fontFamily: "sans-serif" }}>
          Ei luottokorttia. Ei sitoumuksia.
        </div>
      </div>

      {/* Button */}
      <div
        style={{
          transform: `translateY(${btn.y}px)`,
          opacity: btn.opacity,
          background: BLUE,
          color: WHITE,
          padding: "20px 56px",
          borderRadius: 14,
          fontSize: 30,
          fontWeight: 700,
          fontFamily: "sans-serif",
          boxShadow: `0 0 ${40 * glow}px ${BLUE}`,
          letterSpacing: 0.3,
        }}
      >
        varastokamu.fi
      </div>
    </AbsoluteFill>
  );
};

// ─── Root composition ────────────────────────────────────────────────────────
export const VarastokamuAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* Scene 1: Intro 0-90 */}
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>

      {/* Scene 2: Feature 1 — saldo  90-210 */}
      <Sequence from={90} durationInFrames={120}>
        <FeatureScene
          icon="📊"
          title="Varastosaldo reaaliajassa"
          subtitle="Tiedät aina mitä on hyllyssä — millä laitteella tahansa"
          accentColor={BLUE}
        />
      </Sequence>

      {/* Scene 3: Feature 2 — tilaukset  210-330 */}
      <Sequence from={210} durationInFrames={120}>
        <FeatureScene
          icon="🚚"
          title="Tilaukset & toimitukset"
          subtitle="Hallinnoi ostoja ja myyntejä yhdestä paikasta"
          accentColor="#10B981"
        />
      </Sequence>

      {/* Scene 4: CTA  330-450 */}
      <Sequence from={330} durationInFrames={120}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
