import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ─── Real VarastoKamu colors ──────────────────────────────────────────────────
const APP_BG = "#F2F2F7";
const CARD_BG = "#FFFFFF";
const GREEN = "#3A8C5C";
const GREEN_LIGHT = "#E8F5EE";
const PURPLE_LIGHT = "#F0EBFF";
const ORANGE = "#F59E0B";
const ORANGE_LIGHT = "#FEF3C7";
const RED = "#EF4444";
const RED_LIGHT = "#FEE2E2";
const BLUE = "#3B82F6";
const BLUE_LIGHT = "#EFF6FF";
const TEXT_DARK = "#1C1C1E";
const TEXT_MID = "#6B6B6B";
const TEXT_LIGHT = "#AEAEB2";
const SHADOW = "0 2px 12px rgba(0,0,0,0.08)";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useSpr(startFrame: number, fps: number, damping = 16) {
  const frame = useCurrentFrame();
  return spring({
    frame: frame - startFrame,
    fps,
    config: { damping, stiffness: 130, mass: 0.7 },
  });
}

function useSlide(startFrame: number, fps: number, dy = 40) {
  const p = useSpr(startFrame, fps);
  return {
    transform: `translateY(${interpolate(p, [0, 1], [dy, 0])}px)`,
    opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
  };
}

function useCountUp(target: number, start: number, end: number) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(target * p);
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
const Phone: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 340,
      height: 680,
      borderRadius: 44,
      background: "#1C1C1E",
      padding: 10,
      boxShadow:
        "0 60px 120px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 36,
        overflow: "hidden",
        background: APP_BG,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Status bar */}
      <div
        style={{
          height: 44,
          background: CARD_BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif" }}>9:41</span>
        <div
          style={{
            width: 100,
            height: 28,
            background: "#1C1C1E",
            borderRadius: 20,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 8,
          }}
        />
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: TEXT_DARK }}>●●●</span>
        </div>
      </div>
      {/* App header */}
      <div
        style={{
          background: CARD_BG,
          padding: "8px 16px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E5E5EA",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F2F2F7",
            borderRadius: 12,
            padding: "6px 12px",
          }}
        >
          <span style={{ fontSize: 16 }}>🏭</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif" }}>VarastoKamu</span>
          <span style={{ fontSize: 10, color: TEXT_MID }}>⌄</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 18, color: TEXT_MID }}>?</span>
          <span style={{ fontSize: 16, color: TEXT_MID }}>☽</span>
        </div>
      </div>
      {/* Screen content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {children}
      </div>
      {/* Bottom nav */}
      <div
        style={{
          background: CARD_BG,
          borderTop: "1px solid #E5E5EA",
          display: "flex",
          padding: "8px 0 16px",
          flexShrink: 0,
        }}
      >
        {[
          { icon: "☰", label: "Valikko", active: false },
          { icon: "+", label: "Tapahtuma", active: false },
          { icon: "⌕", label: "Haku", active: false },
          { icon: "···", label: "Lisää", active: false },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span style={{ fontSize: 18, color: item.active ? GREEN : TEXT_MID }}>{item.icon}</span>
            <span style={{ fontSize: 9, color: item.active ? GREEN : TEXT_MID, fontFamily: "sans-serif" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Stat Card (matches real app) ─────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub: string;
  iconBg: string;
  icon: string;
}> = ({ label, value, sub, iconBg, icon }) => (
  <div
    style={{
      background: CARD_BG,
      borderRadius: 14,
      padding: "12px 14px",
      boxShadow: SHADOW,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 11, color: TEXT_MID, fontFamily: "sans-serif" }}>{label}</span>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}
      >
        {icon}
      </div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif", lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ fontSize: 10, color: TEXT_MID, fontFamily: "sans-serif" }}>{sub}</div>
  </div>
);

// ─── Scene 1: Yleiskatsaus Dashboard (0-150) ──────────────────────────────────
const DashboardScreen: React.FC = () => {
  const { fps } = useVideoConfig();
  const h1 = useSlide(5, fps, 30);
  const c1 = useSlide(18, fps);
  const c2 = useSlide(24, fps);
  const c3 = useSlide(30, fps);
  const c4 = useSlide(36, fps);
  const c5 = useSlide(44, fps);

  const erät = useCountUp(18, 18, 70);
  const määrä = useCountUp(1017, 24, 80);
  const vähissä = useCountUp(3, 36, 75);
  const arvo = useCountUp(7872, 44, 90);

  return (
    <div style={{ padding: "14px 14px 0", overflowY: "hidden", height: "100%" }}>
      <div style={h1}>
        <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Yleiskatsaus</div>
        <div style={{ fontSize: 11, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 12 }}>
          Varaston kokonaistilanne yhdellä silmäyksellä
        </div>
      </div>
      {/* 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={c1}><StatCard label="Aktiiviset erät" value={erät} sub="Tuotteita: 19" iconBg={PURPLE_LIGHT} icon="📚" /></div>
        <div style={c2}><StatCard label="Kokonaismäärä" value={määrä.toLocaleString("fi")} sub="Sijainteja: 10" iconBg={GREEN_LIGHT} icon="📦" /></div>
        <div style={c3}><StatCard label="Viikon tapahtumat" value={0} sub="↑+0  ↓-0" iconBg={PURPLE_LIGHT} icon="📈" /></div>
        <div style={c4}><StatCard label="Vähissä / loppu" value={vähissä} sub="Erää alle 10 yksikköä" iconBg={ORANGE_LIGHT} icon="⚠️" /></div>
      </div>
      {/* Arvo card */}
      <div style={c5}>
        <div style={{ background: CARD_BG, borderRadius: 14, padding: "12px 14px", boxShadow: SHADOW, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: TEXT_MID, fontFamily: "sans-serif" }}>Varaston arvo</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif" }}>{arvo.toLocaleString("fi")} €</div>
            <div style={{ fontSize: 10, color: TEXT_MID, fontFamily: "sans-serif" }}>Myyntiarvo: 9 200 €</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: GREEN_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>€</div>
        </div>
      </div>
    </div>
  );
};

// ─── Scene 2: Uusi tapahtuma bottom sheet (150-300) ───────────────────────────
const ActionScreen: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const sheetY = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 120 } }),
    [0, 1],
    [300, 0],
  );

  const actions = [
    { label: "Lisää varastoon", icon: "📦", bg: GREEN_LIGHT, color: GREEN },
    { label: "Poisto", icon: "🗑️", bg: RED_LIGHT, color: RED },
    { label: "Siirto", icon: "↔️", bg: BLUE_LIGHT, color: BLUE },
    { label: "Inventointi", icon: "📋", bg: ORANGE_LIGHT, color: ORANGE },
    { label: "Valmistus", icon: "🔧", bg: GREEN_LIGHT, color: GREEN },
  ];

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* Dimmed dashboard behind */}
      <div style={{ padding: "14px 14px 0", opacity: 0.35 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Yleiskatsaus</div>
        <div style={{ fontSize: 11, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 12 }}>Varaston kokonaistilanne yhdellä silmäyksellä</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <StatCard label="Aktiiviset erät" value={18} sub="Tuotteita: 19" iconBg={PURPLE_LIGHT} icon="📚" />
          <StatCard label="Kokonaismäärä" value="1 017" sub="Sijainteja: 10" iconBg={GREEN_LIGHT} icon="📦" />
        </div>
      </div>
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
      {/* Bottom sheet */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: CARD_BG,
          borderRadius: "20px 20px 0 0",
          padding: "14px 14px 12px",
          transform: `translateY(${sheetY}px)`,
        }}
      >
        <div style={{ width: 36, height: 4, background: "#E5E5EA", borderRadius: 2, margin: "0 auto 14px" }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: TEXT_LIGHT, fontFamily: "sans-serif", letterSpacing: 1, marginBottom: 10 }}>
          UUSI TAPAHTUMA
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {actions.map((a) => (
            <div
              key={a.label}
              style={{
                background: a.bg,
                borderRadius: 12,
                padding: "12px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                gridColumn: a.label === "Valmistus" ? "1 / -1" : undefined,
              }}
            >
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: a.color, fontFamily: "sans-serif" }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Scene 3: Varaston arvo (300-420) ─────────────────────────────────────────
const ValueScreen: React.FC = () => {
  const { fps } = useVideoConfig();
  const h1 = useSlide(5, fps, 30);
  const c1 = useSlide(15, fps);
  const c2 = useSlide(22, fps);
  const c3 = useSlide(29, fps);

  const kust = useCountUp(7872, 15, 70);
  const myynti = useCountUp(9200, 22, 80);
  const kate = useCountUp(1328, 29, 85);

  return (
    <div style={{ padding: "14px 14px 0" }}>
      <div style={h1}>
        <div style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Varaston arvo</div>
        <div style={{ fontSize: 11, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 14 }}>
          Seuraa varastosi kokonaisarvoa ja sen jakautumista
        </div>
      </div>
      {[
        { label: "Kustannusarvo", value: kust, sub: "Eriä: 18", iconBg: GREEN_LIGHT, icon: "€", valueColor: TEXT_DARK },
        { label: "Myyntiarvo", value: myynti, sub: "Tuotteita: 15", iconBg: BLUE_LIGHT, icon: "📈", valueColor: TEXT_DARK },
        { label: "Potentiaalinen kate", value: kate, sub: "Myyntiarvo − kustannusarvo", iconBg: GREEN_LIGHT, icon: "↗", valueColor: GREEN },
      ].map((item, i) => {
        const s = [c1, c2, c3][i];
        return (
          <div key={item.label} style={{ ...s, marginBottom: 10 }}>
            <div style={{ background: CARD_BG, borderRadius: 14, padding: "14px", boxShadow: SHADOW, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: item.valueColor, fontFamily: "sans-serif", lineHeight: 1 }}>
                  {item.value.toLocaleString("fi")} €
                </div>
                <div style={{ fontSize: 10, color: TEXT_MID, fontFamily: "sans-serif", marginTop: 3 }}>{item.sub}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {item.icon}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── CTA (420-540) ────────────────────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const logo = useSlide(5, fps, 50);
  const tagline = useSlide(20, fps, 35);
  const btn = useSlide(32, fps, 30);
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.6, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #0F2A18 0%, #0A1628 60%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div style={{ ...logo, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: `0 0 40px ${GREEN}88` }}>
          🏭
        </div>
        <span style={{ fontSize: 52, fontWeight: 800, color: "#FFFFFF", fontFamily: "sans-serif", letterSpacing: -1 }}>
          Varasto<span style={{ color: "#4ADE80" }}>Kamu</span>
        </span>
      </div>
      <div style={{ ...tagline, textAlign: "center" }}>
        <div style={{ fontSize: 26, color: "#E2E8F0", fontFamily: "sans-serif", fontWeight: 600 }}>Älykkäin tapa hallita varastoa</div>
        <div style={{ fontSize: 17, color: "#64748B", fontFamily: "sans-serif", marginTop: 6 }}>Kokeile ilmaiseksi — ei sitoumuksia</div>
      </div>
      <div style={{
        ...btn,
        background: GREEN,
        color: "#FFFFFF",
        padding: "16px 52px",
        borderRadius: 16,
        fontSize: 24,
        fontWeight: 700,
        fontFamily: "sans-serif",
        boxShadow: `0 0 ${40 * glow}px ${GREEN}`,
        letterSpacing: 0.3,
      }}>
        varastokamu.fi
      </div>
    </AbsoluteFill>
  );
};

// ─── Branded background ───────────────────────────────────────────────────────
const BrandedBG: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(145deg, #0F2A18 0%, #0A1628 60%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

// ─── Phone scene helper ───────────────────────────────────────────────────────
const PhoneScene: React.FC<{
  startFrame: number;
  children: React.ReactNode;
}> = ({ startFrame, children }) => {
  const { fps } = useVideoConfig();
  const p = useSpr(startFrame, fps, 14);
  const y = interpolate(p, [0, 1], [80, 0]);
  const scale = interpolate(p, [0, 1], [0.92, 1]);
  const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <BrandedBG>
      <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity }}>
        <Phone>{children}</Phone>
      </div>
    </BrandedBG>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const VarastokamuAppDemo: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={150}>
      <PhoneScene startFrame={5}><DashboardScreen /></PhoneScene>
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <PhoneScene startFrame={0}><ActionScreen /></PhoneScene>
    </Sequence>
    <Sequence from={300} durationInFrames={120}>
      <PhoneScene startFrame={0}><ValueScreen /></PhoneScene>
    </Sequence>
    <Sequence from={420} durationInFrames={120}>
      <CTAScene />
    </Sequence>
  </AbsoluteFill>
);
