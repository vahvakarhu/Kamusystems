import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ─── Brand colors ─────────────────────────────────────────────────────────────
const BRAND_BG = "#0A1628";
const BRAND_BLUE = "#3B82F6";
const APP_BG = "#F1F5F9";
const SIDEBAR_BG = "#1E293B";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#0F172A";
const TEXT_MID = "#475569";
const TEXT_LIGHT = "#94A3B8";
const GREEN = "#10B981";
const RED = "#EF4444";
const ORANGE = "#F59E0B";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useSpring(startFrame: number, fps: number) {
  const frame = useCurrentFrame();
  return spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 16, stiffness: 130, mass: 0.7 },
  });
}

function useSlideIn(
  startFrame: number,
  fps: number,
  direction: "up" | "right" = "up",
  offset = 40,
) {
  const progress = useSpring(startFrame, fps);
  const val = interpolate(progress, [0, 1], [offset, 0]);
  return {
    transform:
      direction === "up" ? `translateY(${val}px)` : `translateX(${val}px)`,
    opacity: interpolate(progress, [0, 0.4], [0, 1], {
      extrapolateRight: "clamp",
    }),
  };
}

function useCountUp(target: number, startFrame: number, endFrame: number) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(target * progress);
}

// ─── Browser Chrome Wrapper ───────────────────────────────────────────────────
const BrowserFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      width: 1100,
      height: 680,
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
      display: "flex",
      flexDirection: "column",
      background: WHITE,
    }}
  >
    {/* Title bar */}
    <div
      style={{
        height: 38,
        background: "#E2E8F0",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 8,
        flexShrink: 0,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
      <div
        style={{
          marginLeft: 12,
          background: WHITE,
          borderRadius: 6,
          padding: "3px 16px",
          fontSize: 12,
          color: TEXT_MID,
          flex: 1,
          maxWidth: 320,
          textAlign: "center",
        }}
      >
        app.varastokamu.fi
      </div>
    </div>
    {/* App body */}
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar: React.FC<{ active: string }> = ({ active }) => {
  const items = [
    { icon: "📊", label: "Dashboard" },
    { icon: "📦", label: "Varasto" },
    { icon: "🚚", label: "Tilaukset" },
    { icon: "📋", label: "Raportit" },
  ];
  return (
    <div
      style={{
        width: 200,
        background: SIDEBAR_BG,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px 20px",
          borderBottom: "1px solid #334155",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>📦</span>
        <span
          style={{
            color: WHITE,
            fontWeight: 700,
            fontSize: 16,
            fontFamily: "sans-serif",
          }}
        >
          Varasto<span style={{ color: BRAND_BLUE }}>kamu</span>
        </span>
      </div>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            background: active === item.label ? `${BRAND_BLUE}22` : "transparent",
            borderLeft:
              active === item.label ? `3px solid ${BRAND_BLUE}` : "3px solid transparent",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <span
            style={{
              color: active === item.label ? WHITE : TEXT_LIGHT,
              fontSize: 14,
              fontFamily: "sans-serif",
              fontWeight: active === item.label ? 600 : 400,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: number | string;
  unit?: string;
  color: string;
  icon: string;
  style?: React.CSSProperties;
}> = ({ label, value, unit, color, icon, style }) => (
  <div
    style={{
      background: WHITE,
      borderRadius: 10,
      padding: "16px 20px",
      flex: 1,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      borderTop: `3px solid ${color}`,
      ...style,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, color: TEXT_LIGHT, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>
          {label}
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif", marginTop: 4 }}>
          {value}{unit && <span style={{ fontSize: 16, fontWeight: 400, color: TEXT_MID }}> {unit}</span>}
        </div>
      </div>
      <span style={{ fontSize: 28 }}>{icon}</span>
    </div>
  </div>
);

// ─── Scene 1: Dashboard (frames 0-150) ───────────────────────────────────────
const Dashboard: React.FC = () => {
  const { fps } = useVideoConfig();

  const browserIn = useSlideIn(5, fps, "up", 60);
  const card1 = useSlideIn(20, fps);
  const card2 = useSlideIn(30, fps);
  const card3 = useSlideIn(40, fps);
  const listIn = useSlideIn(55, fps);

  const totalProducts = useCountUp(284, 20, 80);
  const lowStock = useCountUp(7, 30, 90);
  const todayOrders = useCountUp(23, 40, 100);

  const activities = [
    { time: "14:32", text: "Tilaus #1042 vastaanotettu", dot: GREEN },
    { time: "13:15", text: "Tuote 'Ruuvit M8' — matala varasto", dot: ORANGE },
    { time: "11:50", text: "Tilaus #1041 toimitettu", dot: BRAND_BLUE },
    { time: "10:20", text: "Varasto päivitetty: +50 kpl 'Mutteri M6'", dot: GREEN },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #1E3A5F 0%, ${BRAND_BG} 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ ...browserIn }}>
        <BrowserFrame>
          <Sidebar active="Dashboard" />
          <div style={{ flex: 1, background: APP_BG, padding: 24, overflowY: "auto" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif", margin: "0 0 20px" }}>
              Dashboard
            </h1>
            {/* Stat cards */}
            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              <div style={{ ...card1, flex: 1 }}>
                <StatCard label="Tuotteet yhteensä" value={totalProducts} icon="📦" color={BRAND_BLUE} />
              </div>
              <div style={{ ...card2, flex: 1 }}>
                <StatCard label="Matala varasto" value={lowStock} unit="tuotetta" icon="⚠️" color={ORANGE} />
              </div>
              <div style={{ ...card3, flex: 1 }}>
                <StatCard label="Tilauksia tänään" value={todayOrders} icon="🚚" color={GREEN} />
              </div>
            </div>
            {/* Recent activity */}
            <div style={{ ...listIn, background: WHITE, borderRadius: 10, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif", marginBottom: 12 }}>
                Viimeisimmät tapahtumat
              </div>
              {activities.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < activities.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: TEXT_LIGHT, fontFamily: "sans-serif", width: 40 }}>{a.time}</span>
                  <span style={{ fontSize: 13, color: TEXT_MID, fontFamily: "sans-serif" }}>{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Inventory list (frames 150-300) ─────────────────────────────────
const InventoryScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const browserIn = useSlideIn(0, fps, "right", 80);

  const products = [
    { sku: "RUV-M8", name: "Ruuvit M8 50mm", qty: 4, location: "A-12", low: true },
    { sku: "MUT-M6", name: "Mutteri M6", qty: 156, location: "A-13", low: false },
    { sku: "PUL-10", name: "Pultit 10mm", qty: 89, location: "B-02", low: false },
    { sku: "VAS-500", name: "Vasarat 500g", qty: 12, location: "C-07", low: false },
    { sku: "TAR-A4", name: "Tarrat A4", qty: 3, location: "D-01", low: true },
  ];

  // Highlight row 0 (low stock) with a pulse
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 3),
    [-1, 1],
    [0.85, 1],
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #1E3A5F 0%, ${BRAND_BG} 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ ...browserIn }}>
        <BrowserFrame>
          <Sidebar active="Varasto" />
          <div style={{ flex: 1, background: APP_BG, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif", margin: 0 }}>
                Varasto
              </h1>
              <button
                style={{
                  background: BRAND_BLUE,
                  color: WHITE,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                }}
              >
                + Lisää tuote
              </button>
            </div>
            {/* Table */}
            <div style={{ background: WHITE, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 80px 80px 80px", padding: "10px 16px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["SKU", "Tuote", "Saldo", "Sijainti", "Tila"].map((h) => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, color: TEXT_LIGHT, fontFamily: "sans-serif", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {products.map((p, i) => {
                const rowStyle: React.CSSProperties = p.low
                  ? { background: `${RED}0D`, opacity: pulse }
                  : {};
                return (
                  <div
                    key={p.sku}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px 1fr 80px 80px 80px",
                      padding: "12px 16px",
                      borderBottom: i < products.length - 1 ? "1px solid #F1F5F9" : "none",
                      alignItems: "center",
                      ...rowStyle,
                    }}
                  >
                    <span style={{ fontSize: 12, color: TEXT_LIGHT, fontFamily: "monospace" }}>{p.sku}</span>
                    <span style={{ fontSize: 14, color: TEXT_DARK, fontFamily: "sans-serif", fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.low ? RED : TEXT_DARK, fontFamily: "sans-serif" }}>{p.qty} kpl</span>
                    <span style={{ fontSize: 12, color: TEXT_MID, fontFamily: "sans-serif" }}>{p.location}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 20,
                        background: p.low ? `${RED}20` : `${GREEN}20`,
                        color: p.low ? RED : GREEN,
                        fontFamily: "sans-serif",
                        display: "inline-block",
                      }}
                    >
                      {p.low ? "Matala" : "OK"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: New order notification (frames 300-420) ─────────────────────────
const OrderScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const browserIn = useSlideIn(0, fps, "up", 50);
  const notifIn = useSlideIn(15, fps, "right", 120);

  const statusProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const statusOpacity = interpolate(statusProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #1E3A5F 0%, ${BRAND_BG} 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ ...browserIn }}>
        <BrowserFrame>
          <Sidebar active="Tilaukset" />
          <div style={{ flex: 1, background: APP_BG, padding: 24, position: "relative" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif", margin: "0 0 20px" }}>
              Tilaukset
            </h1>
            {/* Order card */}
            <div style={{ background: WHITE, borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Tilaus #1043</div>
                  <div style={{ fontSize: 12, color: TEXT_LIGHT, fontFamily: "sans-serif" }}>Tänään 14:47 · Asiakkaalle: Rakennus Oy</div>
                </div>
                <div style={{ opacity: statusOpacity }}>
                  <span style={{ background: `${GREEN}20`, color: GREEN, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, fontFamily: "sans-serif" }}>
                    ✓ Käsitelty
                  </span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                {[
                  { name: "Ruuvit M8 50mm", qty: 50, price: "12,50 €" },
                  { name: "Mutteri M6", qty: 100, price: "8,00 €" },
                  { name: "Pultit 10mm", qty: 30, price: "15,00 €" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? "1px solid #F8FAFC" : "none" }}>
                    <span style={{ fontSize: 13, color: TEXT_MID, fontFamily: "sans-serif" }}>{item.name} × {item.qty} kpl</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif" }}>{item.price}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Yhteensä: 35,50 €</span>
                </div>
              </div>
            </div>
            {/* Notification popup */}
            <div
              style={{
                ...notifIn,
                position: "absolute",
                top: 20,
                right: 20,
                background: WHITE,
                borderRadius: 10,
                padding: "12px 16px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                borderLeft: `4px solid ${GREEN}`,
                width: 260,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>🔔 Uusi tilaus saapui!</div>
              <div style={{ fontSize: 12, color: TEXT_MID, fontFamily: "sans-serif", marginTop: 3 }}>Tilaus #1043 · Rakennus Oy</div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (frames 420-540) ────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const logo = useSlideIn(5, fps);
  const text = useSlideIn(20, fps);
  const btn = useSlideIn(35, fps);

  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #1E3A5F 0%, ${BRAND_BG} 65%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <div style={{ ...logo, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: BRAND_BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: `0 0 30px ${BRAND_BLUE}66` }}>📦</div>
        <span style={{ fontSize: 56, fontWeight: 800, color: WHITE, fontFamily: "sans-serif", letterSpacing: -1 }}>
          Varasto<span style={{ color: "#60A5FA" }}>kamu</span>
        </span>
      </div>
      <div style={{ ...text, textAlign: "center" }}>
        <div style={{ fontSize: 28, color: WHITE, fontFamily: "sans-serif", fontWeight: 600 }}>Aloita ilmaiseksi tänään</div>
        <div style={{ fontSize: 18, color: TEXT_LIGHT, fontFamily: "sans-serif", marginTop: 6 }}>Ei luottokorttia. Ei sitoumuksia.</div>
      </div>
      <div style={{ ...btn, background: BRAND_BLUE, color: WHITE, padding: "16px 48px", borderRadius: 12, fontSize: 24, fontWeight: 700, fontFamily: "sans-serif", boxShadow: `0 0 ${36 * glow}px ${BRAND_BLUE}` }}>
        varastokamu.fi
      </div>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const VarastokamuAppDemo: React.FC = () => (
  <AbsoluteFill style={{ background: BRAND_BG }}>
    <Sequence from={0} durationInFrames={150}>
      <Dashboard />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <InventoryScene />
    </Sequence>
    <Sequence from={300} durationInFrames={120}>
      <OrderScene />
    </Sequence>
    <Sequence from={420} durationInFrames={120}>
      <CTAScene />
    </Sequence>
  </AbsoluteFill>
);
