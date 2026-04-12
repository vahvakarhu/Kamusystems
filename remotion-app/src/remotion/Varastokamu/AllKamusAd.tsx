import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ─── Colors ───────────────────────────────────────────────────────────────────
const APP_BG = "#F2F2F7";
const CARD_BG = "#FFFFFF";
const GREEN = "#3A8C5C";
const GREEN_DARK = "#2D6E47";
const GREEN_LIGHT = "#E8F5EE";
const PURPLE = "#6C5CE7";
const PURPLE_LIGHT = "#F0EBFF";
const ORANGE_LIGHT = "#FEF3C7";
const TEXT_DARK = "#1C1C1E";
const TEXT_MID = "#6B6B6B";
const TEXT_LIGHT = "#AEAEB2";
const SHADOW = "0 2px 12px rgba(0,0,0,0.08)";
const VARASTOBLUE = "#2D6E9E";

// ─── Snappy spring helpers ────────────────────────────────────────────────────
function snap(frame: number, startFrame: number, fps: number) {
  return spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 200, mass: 0.5 } });
}
function soft(frame: number, startFrame: number, fps: number) {
  return spring({ frame: frame - startFrame, fps, config: { damping: 18, stiffness: 130, mass: 0.7 } });
}

function slideIn(p: number, dy = 50) {
  return {
    transform: `translateY(${interpolate(p, [0, 1], [dy, 0])}px)`,
    opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
  };
}
function slideInX(p: number, dx = 60) {
  return {
    transform: `translateX(${interpolate(p, [0, 1], [dx, 0])}px)`,
    opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
  };
}
function popIn(p: number) {
  const s = interpolate(p, [0, 1], [0.7, 1]);
  return {
    transform: `scale(${s})`,
    opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
  };
}

function useCountUp(target: number, start: number, end: number) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.round(target * p);
}

// ─── Phone frame ──────────────────────────────────────────────────────────────
const Phone: React.FC<{
  children: React.ReactNode;
  appName: string; appColor: string; appIcon: string;
  navItems: { icon: string; label: string; active?: boolean; color?: string }[];
  scale?: number;
}> = ({ children, appName, appColor, appIcon, navItems, scale = 1 }) => (
  <div style={{ width: 300 * scale, height: 600 * scale, borderRadius: 44 * scale, background: "#1C1C1E", padding: 9 * scale, boxShadow: "0 50px 100px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)", flexShrink: 0 }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 36 * scale, overflow: "hidden", background: APP_BG, display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ height: 36 * scale, background: CARD_BG, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${16 * scale}px`, flexShrink: 0, position: "relative" }}>
        <span style={{ fontSize: 10 * scale, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif" }}>9:41</span>
        <div style={{ width: 80 * scale, height: 20 * scale, background: "#1C1C1E", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 7 * scale }} />
        <span style={{ fontSize: 9 * scale, color: TEXT_MID }}>●●●</span>
      </div>
      {/* Header */}
      <div style={{ background: CARD_BG, padding: `5px ${10 * scale}px 7px`, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5E5EA", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 * scale, background: "#F2F2F7", borderRadius: 10 * scale, padding: `4px ${8 * scale}px`, border: `1.5px solid ${appColor}44` }}>
          <span style={{ fontSize: 13 * scale }}>{appIcon}</span>
          <span style={{ fontSize: 12 * scale, fontWeight: 700, color: appColor, fontFamily: "sans-serif" }}>{appName}</span>
          <span style={{ fontSize: 8 * scale, color: TEXT_MID }}>⌄</span>
        </div>
        <div style={{ display: "flex", gap: 8 * scale }}>
          <span style={{ fontSize: 13 * scale, color: TEXT_MID }}>?</span>
          <span style={{ fontSize: 11 * scale, color: TEXT_MID }}>☽</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>{children}</div>
      {/* Bottom nav */}
      <div style={{ background: CARD_BG, borderTop: "1px solid #E5E5EA", display: "flex", padding: `5px 0 ${10 * scale}px`, flexShrink: 0 }}>
        {navItems.map((item) => (
          <div key={item.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <span style={{ fontSize: 14 * scale, color: item.active ? (item.color ?? appColor) : TEXT_LIGHT }}>{item.icon}</span>
            <span style={{ fontSize: 7 * scale, color: item.active ? (item.color ?? appColor) : TEXT_LIGHT, fontFamily: "sans-serif" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const SC: React.FC<{ label: string; value: string | number; sub: string; iconBg: string; icon: string; s?: number }> = ({ label, value, sub, iconBg, icon, s = 1 }) => (
  <div style={{ background: CARD_BG, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, boxShadow: SHADOW }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 9 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>{label}</span>
      <div style={{ width: 26 * s, height: 26 * s, borderRadius: 7 * s, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 * s }}>{icon}</div>
    </div>
    <div style={{ fontSize: 24 * s, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif", lineHeight: 1, margin: `${3 * s}px 0 ${2 * s}px` }}>{value}</div>
    <div style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>{sub}</div>
  </div>
);

// ─── VARASTOKAMU screens ──────────────────────────────────────────────────────
const VDashboard: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const erät = useCountUp(18, 5, 50);
  const määrä = useCountUp(1017, 8, 55);
  const vähissä = useCountUp(3, 11, 48);
  const arvo = useCountUp(7872, 14, 60);
  return (
    <div style={{ padding: `${10 * s}px ${10 * s}px 0` }}>
      <div style={slideIn(snap(frame, 3, fps), 20)}>
        <div style={{ fontSize: 16 * s, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Yleiskatsaus</div>
        <div style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 8 * s }}>Varaston kokonaistilanne yhdellä silmäyksellä</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 * s, marginBottom: 7 * s }}>
        <div style={slideIn(snap(frame, 6, fps))}><SC s={s} label="Aktiiviset erät" value={erät} sub="Tuotteita: 19" iconBg={PURPLE_LIGHT} icon="📚" /></div>
        <div style={slideIn(snap(frame, 9, fps))}><SC s={s} label="Kokonaismäärä" value={määrä.toLocaleString("fi")} sub="Sijainteja: 10" iconBg={GREEN_LIGHT} icon="📦" /></div>
        <div style={slideIn(snap(frame, 12, fps))}><SC s={s} label="Viikon tapahtumat" value={0} sub="↑+0  ↓-0" iconBg={PURPLE_LIGHT} icon="📈" /></div>
        <div style={slideIn(snap(frame, 15, fps))}><SC s={s} label="Vähissä / loppu" value={vähissä} sub="Alle 10 yksikköä" iconBg={ORANGE_LIGHT} icon="⚠️" /></div>
      </div>
      <div style={slideIn(snap(frame, 18, fps))}>
        <div style={{ background: CARD_BG, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, boxShadow: SHADOW, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>Varaston arvo</div>
            <div style={{ fontSize: 22 * s, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif" }}>{arvo.toLocaleString("fi")} €</div>
            <div style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>Myyntiarvo: 9 200 €</div>
          </div>
          <div style={{ width: 30 * s, height: 30 * s, borderRadius: 9 * s, background: GREEN_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 * s }}>€</div>
        </div>
      </div>
    </div>
  );
};

const VArvo: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const k = useCountUp(7872, 5, 50);
  const m = useCountUp(9200, 8, 55);
  const ka = useCountUp(1328, 11, 58);
  const items = [
    { label: "Kustannusarvo", value: k, sub: "Eriä: 18", iconBg: GREEN_LIGHT, icon: "€", vc: TEXT_DARK },
    { label: "Myyntiarvo", value: m, sub: "Tuotteita: 15", iconBg: "#EFF6FF", icon: "📈", vc: TEXT_DARK },
    { label: "Potentiaalinen kate", value: ka, sub: "Myyntiarvo − kustannusarvo", iconBg: GREEN_LIGHT, icon: "↗", vc: GREEN },
  ];
  return (
    <div style={{ padding: `${10 * s}px ${10 * s}px 0` }}>
      <div style={slideIn(snap(frame, 3, fps), 20)}>
        <div style={{ fontSize: 16 * s, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Varaston arvo</div>
        <div style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 8 * s }}>Seuraa varastosi kokonaisarvoa</div>
      </div>
      {items.map((item, i) => (
        <div key={item.label} style={{ ...slideIn(snap(frame, 6 + i * 5, fps)), marginBottom: 7 * s }}>
          <div style={{ background: CARD_BG, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, boxShadow: SHADOW, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>{item.label}</div>
              <div style={{ fontSize: 22 * s, fontWeight: 800, color: item.vc, fontFamily: "sans-serif" }}>{item.value.toLocaleString("fi")} €</div>
              <div style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>{item.sub}</div>
            </div>
            <div style={{ width: 30 * s, height: 30 * s, borderRadius: 9 * s, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 * s }}>{item.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const VTapahtuma: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const sheetY = interpolate(spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 180, mass: 0.5 } }), [0, 1], [200, 0]);
  const actions = [
    { label: "Lisää varastoon", icon: "📦", bg: GREEN_LIGHT, color: GREEN },
    { label: "Poisto", icon: "🗑️", bg: "#FEE2E2", color: "#EF4444" },
    { label: "Siirto", icon: "↔️", bg: "#EFF6FF", color: "#3B82F6" },
    { label: "Inventointi", icon: "📋", bg: ORANGE_LIGHT, color: "#F59E0B" },
    { label: "Valmistus", icon: "🔧", bg: PURPLE_LIGHT, color: PURPLE },
  ];
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div style={{ padding: `${10 * s}px ${10 * s}px 0`, opacity: 0.3 }}>
        <div style={{ fontSize: 16 * s, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Yleiskatsaus</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 * s, marginTop: 8 * s }}>
          <SC s={s} label="Aktiiviset erät" value={18} sub="Tuotteita: 19" iconBg={PURPLE_LIGHT} icon="📚" />
          <SC s={s} label="Kokonaismäärä" value="1 017" sub="Sijainteja: 10" iconBg={GREEN_LIGHT} icon="📦" />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: CARD_BG, borderRadius: `${18 * s}px ${18 * s}px 0 0`, padding: `${12 * s}px ${12 * s}px ${10 * s}px`, transform: `translateY(${sheetY}px)` }}>
        <div style={{ width: 32 * s, height: 3.5 * s, background: "#E5E5EA", borderRadius: 2, margin: `0 auto ${10 * s}px` }} />
        <div style={{ fontSize: 8 * s, fontWeight: 700, color: TEXT_LIGHT, fontFamily: "sans-serif", letterSpacing: 1, marginBottom: 8 * s }}>UUSI TAPAHTUMA</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 * s }}>
          {actions.map((a) => (
            <div key={a.label} style={{ background: a.bg, borderRadius: 10 * s, padding: `${9 * s}px ${8 * s}px`, display: "flex", alignItems: "center", gap: 6 * s, gridColumn: a.label === "Valmistus" ? "1 / -1" : undefined }}>
              <span style={{ fontSize: 13 * s }}>{a.icon}</span>
              <span style={{ fontSize: 11 * s, fontWeight: 600, color: a.color, fontFamily: "sans-serif" }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── REKOKAMU screens ─────────────────────────────────────────────────────────
const RDashboard: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <div style={{ padding: `${10 * s}px ${10 * s}px 0` }}>
      <div style={slideIn(snap(frame, 3, fps), 20)}>
        <div style={{ fontSize: 16 * s, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Hallintapaneeli</div>
        <div style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 8 * s }}>Yleiskatsaus</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 * s, marginBottom: 7 * s }}>
        <div style={slideIn(snap(frame, 6, fps))}><SC s={s} label="Ringit" value={3} sub="6 yhteensä" iconBg={GREEN_LIGHT} icon="📍" /></div>
        <div style={slideIn(snap(frame, 9, fps))}><SC s={s} label="Tapahtumat" value={1} sub="6 yhteensä" iconBg={GREEN_LIGHT} icon="📅" /></div>
        <div style={slideIn(snap(frame, 12, fps))}><SC s={s} label="Tuotteet" value={11} sub="11 yhteensä" iconBg={GREEN_LIGHT} icon="📦" /></div>
        <div style={slideIn(snap(frame, 15, fps))}><SC s={s} label="Myynti" value="0,00 €" sub="0 tilausta tässä kk" iconBg={GREEN_LIGHT} icon="📊" /></div>
      </div>
      <div style={slideIn(snap(frame, 18, fps))}>
        <div style={{ background: GREEN_LIGHT, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, border: `1px solid ${GREEN}33` }}>
          <div style={{ fontSize: 10 * s, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif", marginBottom: 5 * s }}>✨ Alkuaskeleet</div>
          {["Täytä myyjäprofiili", "Luo REKO-rinki"].map((t) => (
            <div key={t} style={{ display: "flex", gap: 5 * s, marginBottom: 3 * s }}>
              <span style={{ fontSize: 9 * s, color: GREEN }}>✓</span>
              <span style={{ fontSize: 9 * s, color: TEXT_DARK, fontFamily: "sans-serif", fontWeight: 600 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MYYNTIKAMU screens ───────────────────────────────────────────────────────
const MDashboard: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const barP = interpolate(frame, [20, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ padding: `${10 * s}px ${10 * s}px 0` }}>
      <div style={slideIn(snap(frame, 3, fps), 20)}>
        <div style={{ fontSize: 16 * s, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Hallintapaneeli</div>
        <div style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 8 * s }}>huhtikuu 2026</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 * s, marginBottom: 7 * s }}>
        <div style={slideIn(snap(frame, 6, fps))}>
          <div style={{ background: CARD_BG, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, boxShadow: SHADOW }}>
            <div style={{ fontSize: 9 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>Laskutettu tässä kk</div>
            <div style={{ fontSize: 22 * s, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif" }}>0,00 €</div>
          </div>
        </div>
        <div style={slideIn(snap(frame, 9, fps))}>
          <div style={{ background: GREEN_LIGHT, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, border: `1px solid ${GREEN}33` }}>
            <div style={{ fontSize: 9 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>Maksettu tässä kk</div>
            <div style={{ fontSize: 22 * s, fontWeight: 800, color: GREEN_DARK, fontFamily: "sans-serif" }}>0,00 €</div>
            <div style={{ fontSize: 7 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>Kaikki: 324,41 €</div>
          </div>
        </div>
      </div>
      <div style={{ ...slideIn(snap(frame, 14, fps)), marginBottom: 7 * s }}>
        <div style={{ background: CARD_BG, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, boxShadow: SHADOW }}>
          <div style={{ fontSize: 9 * s, color: TEXT_DARK, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 7 * s }}>Laskutus — viimeiset 6 kk</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5 * s, height: 42 * s }}>
            {["Mar", "Jou", "Tam", "Hel", "Maa", "Huh"].map((m, i) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 * s }}>
                <div style={{ width: "100%", background: i === 4 ? PURPLE : "#E2E8F0", borderRadius: `${2 * s}px ${2 * s}px 0 0`, height: i === 4 ? 36 * s * barP : 2 * s }} />
                <span style={{ fontSize: 6 * s, color: TEXT_LIGHT, fontFamily: "sans-serif" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={slideIn(snap(frame, 20, fps))}>
        <div style={{ background: CARD_BG, borderRadius: 12 * s, padding: `${9 * s}px ${10 * s}px`, boxShadow: SHADOW }}>
          <div style={{ fontSize: 9 * s, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif", marginBottom: 5 * s }}>📦 Myydyimmät tuotteet</div>
          {[["Sisäfile", "4 kpl", "251,00 €"], ["Jauheliha", "3 kpl", "50,82 €"], ["Grillijuusto", "1 kpl", "22,59 €"]].map(([name, qty, price]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: `${2 * s}px 0` }}>
              <span style={{ fontSize: 8 * s, color: TEXT_MID, fontFamily: "sans-serif" }}>{name} · {qty}</span>
              <span style={{ fontSize: 8 * s, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>{price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Branded background ───────────────────────────────────────────────────────
const BG: React.FC<{ children: React.ReactNode; accent?: string }> = ({ children, accent = GREEN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Subtle floating dots
  const dots = [
    { x: 80, y: 120, r: 180, delay: 0 },
    { x: 1100, y: 500, r: 220, delay: 15 },
    { x: 600, y: 650, r: 150, delay: 8 },
  ];
  return (
    <AbsoluteFill style={{ background: "#080F1A", overflow: "hidden" }}>
      {dots.map((d, i) => {
        const pulse = interpolate(Math.sin(((frame + d.delay * 10) / fps) * 0.8), [-1, 1], [0.3, 0.55]);
        return (
          <div key={i} style={{ position: "absolute", left: d.x - d.r, top: d.y - d.r, width: d.r * 2, height: d.r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${accent}${Math.round(pulse * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`, pointerEvents: "none" }} />
        );
      })}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Feature label overlay ────────────────────────────────────────────────────
const FeatureLabel: React.FC<{ text: string; sub: string; color: string; startFrame: number }> = ({ text, sub, color, startFrame }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const p = snap(frame, startFrame, fps);
  return (
    <div style={{ ...slideInX(p, -60), textAlign: "left" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF", fontFamily: "sans-serif", lineHeight: 1.1 }}>{text}</div>
      <div style={{ fontSize: 16, color, fontFamily: "sans-serif", marginTop: 6, fontWeight: 500 }}>{sub}</div>
    </div>
  );
};

// ─── App screen scene (phone left + label right) ──────────────────────────────
const AppScene: React.FC<{
  appName: string; appColor: string; appIcon: string;
  navItems: { icon: string; label: string; active?: boolean; color?: string }[];
  screens: { screen: React.ReactNode; label: string; sub: string }[];
  accent: string;
}> = ({ appName, appColor, appIcon, navItems, screens, accent }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Each screen gets equal time
  const perScreen = Math.floor(150 / screens.length);
  const screenIdx = Math.min(Math.floor(frame / perScreen), screens.length - 1);
  const screenFrame = frame % perScreen;

  // Phone entrance
  const phoneP = snap(frame, 3, fps);
  const phoneStyle = { transform: `scale(${interpolate(phoneP, [0, 1], [0.85, 1])}) translateY(${interpolate(phoneP, [0, 1], [40, 0])}px)`, opacity: interpolate(phoneP, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }) };

  // Screen slide transition
  const transP = snap(screenFrame, 0, fps);
  const screenSlide = { transform: `translateX(${interpolate(transP, [0, 1], [30, 0])}px)`, opacity: interpolate(transP, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) };

  const current = screens[screenIdx];

  return (
    <BG accent={accent}>
      <div style={{ display: "flex", alignItems: "center", gap: 60, width: 1100, justifyContent: "center" }}>
        {/* Phone */}
        <div style={phoneStyle}>
          <Phone appName={appName} appColor={appColor} appIcon={appIcon} navItems={navItems}>
            <div style={screenSlide}>{current.screen}</div>
          </Phone>
        </div>
        {/* Label */}
        <div style={{ width: 440 }}>
          {/* App badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}33`, border: `1.5px solid ${accent}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{appIcon}</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: accent, fontFamily: "sans-serif" }}>{appName}</span>
          </div>
          <FeatureLabel text={current.label} sub={current.sub} color={accent} startFrame={2} />
          {/* Screen indicators */}
          {screens.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              {screens.map((_, i) => (
                <div key={i} style={{ height: 4, borderRadius: 2, background: i === screenIdx ? accent : `${accent}44`, width: i === screenIdx ? 24 : 8, transition: "all 0.2s" }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </BG>
  );
};

// ─── Intro scene ──────────────────────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const t1 = snap(frame, 5, fps);
  const t2 = snap(frame, 15, fps);
  const t3 = snap(frame, 25, fps);
  return (
    <BG accent={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={popIn(t1)}>
          <span style={{ fontSize: 72, fontWeight: 900, color: "#FFFFFF", fontFamily: "sans-serif", letterSpacing: -3 }}>
            Kamu<span style={{ color: "#4ADE80" }}>Systems</span>
          </span>
        </div>
        <div style={{ ...slideIn(t2, 24), fontSize: 24, color: "#94A3B8", fontFamily: "sans-serif" }}>
          Kolme sovellusta. Yksi ekosysteemi.
        </div>
        <div style={{ ...slideIn(t3, 20), display: "flex", gap: 28, marginTop: 6 }}>
          {[{ icon: "🏭", name: "VarastoKamu", color: VARASTOBLUE }, { icon: "🌿", name: "RekoKamu", color: GREEN }, { icon: "💰", name: "MyyntiKamu", color: PURPLE }].map((a) => (
            <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${a.color}22`, border: `1.5px solid ${a.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{a.icon}</div>
              <span style={{ fontSize: 12, color: a.color, fontFamily: "sans-serif", fontWeight: 600 }}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </BG>
  );
};

// ─── Three phones finale ──────────────────────────────────────────────────────
const ThreePhones: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = 0.68;

  const makeEntry = (delay: number) => {
    const p = soft(frame, delay, fps);
    return { transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${interpolate(p, [0, 1], [0.88, 1])})`, opacity: interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }) };
  };
  const ctaP = soft(frame, 50, fps);
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1]);

  const VARASTONAV = [{ icon: "☰", label: "Valikko" }, { icon: "+", label: "Tapahtuma" }, { icon: "⌕", label: "Haku" }, { icon: "···", label: "Lisää" }];
  const REKONAV = [{ icon: "☰", label: "Valikko", active: true, color: GREEN }, { icon: "🏪", label: "Myynti" }, { icon: "📋", label: "Tilauslista" }];
  const MYYNTINAV = [{ icon: "☰", label: "Valikko", active: true, color: PURPLE }, { icon: "⊞", label: "Etusivu" }, { icon: "📄", label: "Laskut" }, { icon: "👤", label: "Asiakkaat" }, { icon: "📦", label: "Tuotteet" }];

  return (
    <BG accent={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
          <div style={{ ...makeEntry(5), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Phone scale={s} appName="VarastoKamu" appColor={VARASTOBLUE} appIcon="🏭" navItems={VARASTONAV}>
              <VDashboard s={s} />
            </Phone>
            <span style={{ fontSize: 13, fontWeight: 700, color: VARASTOBLUE, fontFamily: "sans-serif" }}>VarastoKamu</span>
          </div>
          <div style={{ ...makeEntry(12), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Phone scale={s} appName="RekoKamu" appColor={GREEN} appIcon="🌿" navItems={REKONAV}>
              <RDashboard s={s} />
            </Phone>
            <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, fontFamily: "sans-serif" }}>RekoKamu</span>
          </div>
          <div style={{ ...makeEntry(19), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Phone scale={s} appName="MyyntiKamu" appColor={PURPLE} appIcon="💰" navItems={MYYNTINAV}>
              <MDashboard s={s} />
            </Phone>
            <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE, fontFamily: "sans-serif" }}>MyyntiKamu</span>
          </div>
        </div>
        <div style={{ transform: `translateY(${interpolate(ctaP, [0, 1], [30, 0])}px)`, opacity: interpolate(ctaP, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 18, color: "#94A3B8", fontFamily: "sans-serif" }}>Kaikki yhdestä paikasta</div>
          <div style={{ background: GREEN, color: "#FFFFFF", padding: "12px 48px", borderRadius: 14, fontSize: 22, fontWeight: 700, fontFamily: "sans-serif", boxShadow: `0 0 ${36 * glow}px ${GREEN}` }}>
            varastokamu.fi
          </div>
        </div>
      </div>
    </BG>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const VARASTONAV = [{ icon: "☰", label: "Valikko" }, { icon: "+", label: "Tapahtuma" }, { icon: "⌕", label: "Haku" }, { icon: "···", label: "Lisää" }];
const REKONAV = [{ icon: "☰", label: "Valikko", active: true, color: GREEN }, { icon: "🏪", label: "Myynti" }, { icon: "📋", label: "Tilauslista" }];
const MYYNTINAV = [{ icon: "☰", label: "Valikko", active: true, color: PURPLE }, { icon: "⊞", label: "Etusivu" }, { icon: "📄", label: "Laskut" }, { icon: "👤", label: "Asiakkaat" }, { icon: "📦", label: "Tuotteet" }];

export const AllKamusAd: React.FC = () => (
  <AbsoluteFill>
    {/* Intro 0-75 */}
    <Sequence from={0} durationInFrames={75}>
      <IntroScene />
    </Sequence>

    {/* VarastoKamu 75-225: 3 screens × 50 frames each */}
    <Sequence from={75} durationInFrames={150}>
      <AppScene
        appName="VarastoKamu" appColor={VARASTOBLUE} appIcon="🏭"
        navItems={VARASTONAV} accent={VARASTOBLUE}
        screens={[
          { screen: <VDashboard />, label: "Yleiskatsaus", sub: "Varastosaldo reaaliajassa" },
          { screen: <VTapahtuma />, label: "Uusi tapahtuma", sub: "Lisää, poista tai siirrä nopeasti" },
          { screen: <VArvo />, label: "Varaston arvo", sub: "Kustannus-, myynti- ja kateanalyysi" },
        ]}
      />
    </Sequence>

    {/* RekoKamu 225-375 */}
    <Sequence from={225} durationInFrames={150}>
      <AppScene
        appName="RekoKamu" appColor={GREEN} appIcon="🌿"
        navItems={REKONAV} accent={GREEN}
        screens={[
          { screen: <RDashboard />, label: "Hallintapaneeli", sub: "Ringit, tapahtumat ja myynti" },
          { screen: <RDashboard />, label: "Alkuaskeleet", sub: "Pääset alkuun minuuteissa" },
        ]}
      />
    </Sequence>

    {/* MyyntiKamu 375-525 */}
    <Sequence from={375} durationInFrames={150}>
      <AppScene
        appName="MyyntiKamu" appColor={PURPLE} appIcon="💰"
        navItems={MYYNTINAV} accent={PURPLE}
        screens={[
          { screen: <MDashboard />, label: "Hallintapaneeli", sub: "Laskutus ja myyntianalyysi" },
          { screen: <MDashboard />, label: "Myydyimmät tuotteet", sub: "Seuraa tuloksiasi kuukausittain" },
        ]}
      />
    </Sequence>

    {/* All three 525-720 */}
    <Sequence from={525} durationInFrames={195}>
      <ThreePhones />
    </Sequence>
  </AbsoluteFill>
);
