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
const GREEN_LIGHT = "#E8F5EE";
const GREEN_DARK = "#2D6E47";
const PURPLE = "#6C5CE7";
const PURPLE_LIGHT = "#F0EBFF";
const ORANGE_LIGHT = "#FEF3C7";
const TEXT_DARK = "#1C1C1E";
const TEXT_MID = "#6B6B6B";
const TEXT_LIGHT = "#AEAEB2";
const SHADOW = "0 2px 12px rgba(0,0,0,0.08)";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useSpr(startFrame: number, fps: number, cfg = { damping: 16, stiffness: 130, mass: 0.7 }) {
  const frame = useCurrentFrame();
  return spring({ frame: frame - startFrame, fps, config: cfg });
}

function useSlide(startFrame: number, fps: number, dy = 36) {
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

// ─── Phone frame ──────────────────────────────────────────────────────────────
const Phone: React.FC<{
  children: React.ReactNode;
  appName: string;
  appColor: string;
  appIcon: string;
  navItems: { icon: string; label: string; active?: boolean; color?: string }[];
  scale?: number;
}> = ({ children, appName, appColor, appIcon, navItems, scale = 1 }) => (
  <div
    style={{
      width: 300 * scale,
      height: 600 * scale,
      borderRadius: 44 * scale,
      background: "#1C1C1E",
      padding: 9 * scale,
      boxShadow: "0 50px 100px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 36 * scale,
        overflow: "hidden",
        background: APP_BG,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Status bar */}
      <div style={{ height: 38 * scale, background: CARD_BG, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${16 * scale}px`, flexShrink: 0, position: "relative" }}>
        <span style={{ fontSize: 11 * scale, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif" }}>9:41</span>
        <div style={{ width: 80 * scale, height: 22 * scale, background: "#1C1C1E", borderRadius: 20 * scale, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 7 * scale }} />
        <span style={{ fontSize: 10 * scale, color: TEXT_MID }}>●●●</span>
      </div>
      {/* App header */}
      <div style={{ background: CARD_BG, padding: `6px ${12 * scale}px 8px`, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5E5EA", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 * scale, background: "#F2F2F7", borderRadius: 10 * scale, padding: `5px ${10 * scale}px`, border: `1.5px solid ${appColor}44` }}>
          <span style={{ fontSize: 14 * scale }}>{appIcon}</span>
          <span style={{ fontSize: 13 * scale, fontWeight: 700, color: appColor, fontFamily: "sans-serif" }}>{appName}</span>
          <span style={{ fontSize: 9 * scale, color: TEXT_MID }}>⌄</span>
        </div>
        <div style={{ display: "flex", gap: 10 * scale }}>
          <span style={{ fontSize: 14 * scale, color: TEXT_MID }}>?</span>
          <span style={{ fontSize: 13 * scale, color: TEXT_MID }}>☽</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
      {/* Bottom nav */}
      <div style={{ background: CARD_BG, borderTop: "1px solid #E5E5EA", display: "flex", padding: `6px 0 ${12 * scale}px`, flexShrink: 0 }}>
        {navItems.map((item) => (
          <div key={item.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <span style={{ fontSize: 15 * scale, color: item.active ? (item.color ?? appColor) : TEXT_LIGHT }}>{item.icon}</span>
            <span style={{ fontSize: 8 * scale, color: item.active ? (item.color ?? appColor) : TEXT_LIGHT, fontFamily: "sans-serif" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; sub: string; iconBg: string; icon: string; scale?: number }> = ({ label, value, sub, iconBg, icon, scale = 1 }) => (
  <div style={{ background: CARD_BG, borderRadius: 14 * scale, padding: `${10 * scale}px ${12 * scale}px`, boxShadow: SHADOW }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 10 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>{label}</span>
      <div style={{ width: 28 * scale, height: 28 * scale, borderRadius: 8 * scale, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 * scale }}>{icon}</div>
    </div>
    <div style={{ fontSize: 26 * scale, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif", lineHeight: 1, margin: `${4 * scale}px 0 ${2 * scale}px` }}>{value}</div>
    <div style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>{sub}</div>
  </div>
);

// ─── VarastoKamu screen ───────────────────────────────────────────────────────
const VarastoScreen: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const { fps } = useVideoConfig();
  const h = useSlide(5, fps, 28);
  const c1 = useSlide(15, fps); const c2 = useSlide(20, fps);
  const c3 = useSlide(25, fps); const c4 = useSlide(30, fps);
  const c5 = useSlide(38, fps);
  const erät = useCountUp(18, 15, 65);
  const määrä = useCountUp(1017, 20, 72);
  const vähissä = useCountUp(3, 30, 68);
  const arvo = useCountUp(7872, 38, 80);
  return (
    <div style={{ padding: `${12 * scale}px ${12 * scale}px 0` }}>
      <div style={h}>
        <div style={{ fontSize: 18 * scale, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Yleiskatsaus</div>
        <div style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 10 * scale }}>Varaston kokonaistilanne yhdellä silmäyksellä</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 * scale, marginBottom: 8 * scale }}>
        <div style={c1}><StatCard scale={scale} label="Aktiiviset erät" value={erät} sub="Tuotteita: 19" iconBg={PURPLE_LIGHT} icon="📚" /></div>
        <div style={c2}><StatCard scale={scale} label="Kokonaismäärä" value={määrä.toLocaleString("fi")} sub="Sijainteja: 10" iconBg={GREEN_LIGHT} icon="📦" /></div>
        <div style={c3}><StatCard scale={scale} label="Viikon tapahtumat" value={0} sub="↑+0  ↓-0" iconBg={PURPLE_LIGHT} icon="📈" /></div>
        <div style={c4}><StatCard scale={scale} label="Vähissä / loppu" value={vähissä} sub="Alle 10 yksikköä" iconBg={ORANGE_LIGHT} icon="⚠️" /></div>
      </div>
      <div style={c5}>
        <div style={{ background: CARD_BG, borderRadius: 14 * scale, padding: `${10 * scale}px ${12 * scale}px`, boxShadow: SHADOW, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>Varaston arvo</div>
            <div style={{ fontSize: 24 * scale, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif" }}>{arvo.toLocaleString("fi")} €</div>
            <div style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>Myyntiarvo: 9 200 €</div>
          </div>
          <div style={{ width: 32 * scale, height: 32 * scale, borderRadius: 10 * scale, background: GREEN_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 * scale }}>€</div>
        </div>
      </div>
    </div>
  );
};

// ─── RekoKamu screen ──────────────────────────────────────────────────────────
const RekoScreen: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const { fps } = useVideoConfig();
  const h = useSlide(5, fps, 28);
  const c1 = useSlide(15, fps); const c2 = useSlide(20, fps);
  const c3 = useSlide(25, fps); const c4 = useSlide(30, fps);
  const steps = useSlide(40, fps, 40);
  return (
    <div style={{ padding: `${12 * scale}px ${12 * scale}px 0` }}>
      <div style={h}>
        <div style={{ fontSize: 18 * scale, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Hallintapaneeli</div>
        <div style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 10 * scale }}>Yleiskatsaus</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 * scale, marginBottom: 8 * scale }}>
        <div style={c1}><StatCard scale={scale} label="Ringit" value={3} sub="6 yhteensä" iconBg={GREEN_LIGHT} icon="📍" /></div>
        <div style={c2}><StatCard scale={scale} label="Tapahtumat" value={1} sub="6 yhteensä" iconBg={GREEN_LIGHT} icon="📅" /></div>
        <div style={c3}><StatCard scale={scale} label="Tuotteet" value={11} sub="11 yhteensä" iconBg={GREEN_LIGHT} icon="📦" /></div>
        <div style={c4}><StatCard scale={scale} label="Myynti" value="0,00 €" sub="0 tilausta tässä kk" iconBg={GREEN_LIGHT} icon="📊" /></div>
      </div>
      <div style={steps}>
        <div style={{ background: GREEN_LIGHT, borderRadius: 12 * scale, padding: `${10 * scale}px ${12 * scale}px`, border: `1px solid ${GREEN}33` }}>
          <div style={{ fontSize: 11 * scale, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif", marginBottom: 6 * scale }}>✨ Alkuaskeleet</div>
          {["Täytä myyjäprofiili", "Luo REKO-rinki"].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 * scale, marginBottom: 4 * scale }}>
              <span style={{ fontSize: 10 * scale, color: GREEN }}>✓</span>
              <span style={{ fontSize: 10 * scale, color: TEXT_DARK, fontFamily: "sans-serif", fontWeight: 600 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MyyntiKamu screen ────────────────────────────────────────────────────────
const MyyntiScreen: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const h = useSlide(5, fps, 28);
  const c1 = useSlide(15, fps); const c2 = useSlide(22, fps);
  const chart = useSlide(32, fps, 50);
  const list = useSlide(45, fps);

  // Animated bar chart
  const barH = interpolate(frame, [32, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ padding: `${12 * scale}px ${12 * scale}px 0` }}>
      <div style={h}>
        <div style={{ fontSize: 18 * scale, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>Hallintapaneeli</div>
        <div style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif", marginBottom: 10 * scale }}>huhtikuu 2026</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 * scale, marginBottom: 8 * scale }}>
        <div style={c1}>
          <div style={{ background: CARD_BG, borderRadius: 12 * scale, padding: `${10 * scale}px ${12 * scale}px`, boxShadow: SHADOW }}>
            <div style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>Laskutettu tässä kk</div>
            <div style={{ fontSize: 22 * scale, fontWeight: 800, color: TEXT_DARK, fontFamily: "sans-serif" }}>0,00 €</div>
          </div>
        </div>
        <div style={c2}>
          <div style={{ background: GREEN_LIGHT, borderRadius: 12 * scale, padding: `${10 * scale}px ${12 * scale}px`, boxShadow: SHADOW, border: `1px solid ${GREEN}33` }}>
            <div style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>Maksettu tässä kk</div>
            <div style={{ fontSize: 22 * scale, fontWeight: 800, color: GREEN_DARK, fontFamily: "sans-serif" }}>0,00 €</div>
            <div style={{ fontSize: 8 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>Kaikki aikoina: 324,41 €</div>
          </div>
        </div>
      </div>
      {/* Bar chart */}
      <div style={{ ...chart, background: CARD_BG, borderRadius: 12 * scale, padding: `${10 * scale}px ${12 * scale}px`, boxShadow: SHADOW, marginBottom: 8 * scale }}>
        <div style={{ fontSize: 9 * scale, color: TEXT_DARK, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 8 * scale }}>Laskutus — viimeiset 6 kk</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 * scale, height: 50 * scale }}>
          {["Mar", "Jou", "Tam", "Hel", "Maa", "Huh"].map((m, i) => (
            <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 * scale }}>
              <div style={{ width: "100%", background: i === 4 ? PURPLE : "#E2E8F0", borderRadius: `${3 * scale}px ${3 * scale}px 0 0`, height: i === 4 ? 40 * scale * barH : 3 * scale }} />
              <span style={{ fontSize: 7 * scale, color: TEXT_LIGHT, fontFamily: "sans-serif" }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Top products */}
      <div style={list}>
        <div style={{ background: CARD_BG, borderRadius: 12 * scale, padding: `${10 * scale}px ${12 * scale}px`, boxShadow: SHADOW }}>
          <div style={{ fontSize: 9 * scale, fontWeight: 600, color: TEXT_DARK, fontFamily: "sans-serif", marginBottom: 6 * scale }}>📦 Myydyimmät tuotteet</div>
          {[["Sisäfile", "4 kpl", "251,00 €"], ["Jauheliha", "3 kpl", "50,82 €"], ["Grillijuusto", "1 kpl", "22,59 €"]].map(([name, qty, price], i) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: `${3 * scale}px 0` }}>
              <span style={{ fontSize: 9 * scale, color: TEXT_MID, fontFamily: "sans-serif" }}>{i + 1}. {name}  {qty}</span>
              <span style={{ fontSize: 9 * scale, fontWeight: 700, color: TEXT_DARK, fontFamily: "sans-serif" }}>{price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Branded background ───────────────────────────────────────────────────────
const BG: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "linear-gradient(145deg, #0A1F12 0%, #0A1628 65%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {children}
  </AbsoluteFill>
);

// ─── Single phone scene ───────────────────────────────────────────────────────
const SinglePhoneScene: React.FC<{
  appName: string; appColor: string; appIcon: string;
  navItems: { icon: string; label: string; active?: boolean; color?: string }[];
  label: string; labelColor: string;
  children: React.ReactNode;
}> = ({ appName, appColor, appIcon, navItems, label, labelColor, children }) => {
  const { fps } = useVideoConfig();
  const p = useSpr(5, fps, { damping: 14, stiffness: 120, mass: 0.8 });
  const y = interpolate(p, [0, 1], [60, 0]);
  const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const tagP = useSpr(20, fps);
  const tagStyle = {
    transform: `translateY(${interpolate(tagP, [0, 1], [20, 0])}px)`,
    opacity: interpolate(tagP, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
  };
  return (
    <BG>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ transform: `translateY(${y}px)`, opacity }}>
          <Phone appName={appName} appColor={appColor} appIcon={appIcon} navItems={navItems}>
            {children}
          </Phone>
        </div>
        <div style={{ ...tagStyle, fontSize: 28, fontWeight: 700, color: labelColor, fontFamily: "sans-serif", letterSpacing: 0.3 }}>
          {label}
        </div>
      </div>
    </BG>
  );
};

// ─── Scene 1: Intro ───────────────────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const { fps } = useVideoConfig();
  const t1 = useSlide(8, fps, 50);
  const t2 = useSlide(22, fps, 35);
  const icons = useSlide(36, fps, 30);
  return (
    <BG>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={t1}>
          <span style={{ fontSize: 62, fontWeight: 900, color: "#FFFFFF", fontFamily: "sans-serif", letterSpacing: -2 }}>
            Kamu<span style={{ color: "#4ADE80" }}>Systems</span>
          </span>
        </div>
        <div style={{ ...t2, fontSize: 22, color: "#94A3B8", fontFamily: "sans-serif", textAlign: "center" }}>
          Kolme sovellusta. Yksi ekosysteemi.
        </div>
        <div style={{ ...icons, display: "flex", gap: 32, marginTop: 8 }}>
          {[
            { icon: "🏭", name: "VarastoKamu", color: GREEN },
            { icon: "🌿", name: "RekoKamu", color: GREEN },
            { icon: "💰", name: "MyyntiKamu", color: PURPLE },
          ].map((a) => (
            <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `${a.color}22`, border: `1.5px solid ${a.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                {a.icon}
              </div>
              <span style={{ fontSize: 13, color: a.color, fontFamily: "sans-serif", fontWeight: 600 }}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </BG>
  );
};

// ─── Scene 5: All three phones ────────────────────────────────────────────────
const ThreePhones: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const makeP = (delay: number) => {
    const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 110, mass: 0.9 } });
    return {
      transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
      opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
    };
  };

  const cta = useSpr(55, fps);
  const ctaStyle = {
    transform: `translateY(${interpolate(cta, [0, 1], [30, 0])}px)`,
    opacity: interpolate(cta, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
  };
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1]);

  const s = 0.72;
  return (
    <BG>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
          {/* VarastoKamu */}
          <div style={{ ...makeP(5), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Phone scale={s} appName="VarastoKamu" appColor="#2D6E9E" appIcon="🏭"
              navItems={[{ icon: "☰", label: "Valikko" }, { icon: "+", label: "Tapahtuma" }, { icon: "⌕", label: "Haku" }, { icon: "···", label: "Lisää" }]}>
              <VarastoScreen scale={s} />
            </Phone>
            <span style={{ fontSize: 14, fontWeight: 700, color: GREEN, fontFamily: "sans-serif" }}>VarastoKamu</span>
          </div>
          {/* RekoKamu */}
          <div style={{ ...makeP(15), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Phone scale={s} appName="RekoKamu" appColor={GREEN} appIcon="🌿"
              navItems={[{ icon: "☰", label: "Valikko", active: true, color: GREEN }, { icon: "🏪", label: "Myynti" }, { icon: "📋", label: "Tilauslista" }]}>
              <RekoScreen scale={s} />
            </Phone>
            <span style={{ fontSize: 14, fontWeight: 700, color: GREEN, fontFamily: "sans-serif" }}>RekoKamu</span>
          </div>
          {/* MyyntiKamu */}
          <div style={{ ...makeP(25), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Phone scale={s} appName="MyyntiKamu" appColor={PURPLE} appIcon="💰"
              navItems={[{ icon: "☰", label: "Valikko", active: true, color: PURPLE }, { icon: "⊞", label: "Etusivu" }, { icon: "📄", label: "Laskut" }, { icon: "👤", label: "Asiakkaat" }, { icon: "📦", label: "Tuotteet" }]}>
              <MyyntiScreen scale={s} />
            </Phone>
            <span style={{ fontSize: 14, fontWeight: 700, color: PURPLE, fontFamily: "sans-serif" }}>MyyntiKamu</span>
          </div>
        </div>
        {/* CTA */}
        <div style={{ ...ctaStyle, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 20, color: "#94A3B8", fontFamily: "sans-serif" }}>Kaikki yhdestä paikasta</div>
          <div style={{ background: GREEN, color: "#FFFFFF", padding: "12px 44px", borderRadius: 14, fontSize: 22, fontWeight: 700, fontFamily: "sans-serif", boxShadow: `0 0 ${32 * glow}px ${GREEN}` }}>
            varastokamu.fi
          </div>
        </div>
      </div>
    </BG>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const AllKamusAd: React.FC = () => (
  <AbsoluteFill>
    {/* Intro */}
    <Sequence from={0} durationInFrames={90}>
      <IntroScene />
    </Sequence>
    {/* VarastoKamu */}
    <Sequence from={90} durationInFrames={150}>
      <SinglePhoneScene appName="VarastoKamu" appColor="#2D6E9E" appIcon="🏭" label="Varastonhallinta" labelColor={GREEN}
        navItems={[{ icon: "☰", label: "Valikko" }, { icon: "+", label: "Tapahtuma" }, { icon: "⌕", label: "Haku" }, { icon: "···", label: "Lisää" }]}>
        <VarastoScreen />
      </SinglePhoneScene>
    </Sequence>
    {/* RekoKamu */}
    <Sequence from={240} durationInFrames={150}>
      <SinglePhoneScene appName="RekoKamu" appColor={GREEN} appIcon="🌿" label="REKO-myynti" labelColor={GREEN}
        navItems={[{ icon: "☰", label: "Valikko", active: true, color: GREEN }, { icon: "🏪", label: "Myynti" }, { icon: "📋", label: "Tilauslista" }]}>
        <RekoScreen />
      </SinglePhoneScene>
    </Sequence>
    {/* MyyntiKamu */}
    <Sequence from={390} durationInFrames={150}>
      <SinglePhoneScene appName="MyyntiKamu" appColor={PURPLE} appIcon="💰" label="Myynti & laskutus" labelColor={PURPLE}
        navItems={[{ icon: "☰", label: "Valikko", active: true, color: PURPLE }, { icon: "⊞", label: "Etusivu" }, { icon: "📄", label: "Laskut" }, { icon: "👤", label: "Asiakkaat" }, { icon: "📦", label: "Tuotteet" }]}>
        <MyyntiScreen />
      </SinglePhoneScene>
    </Sequence>
    {/* All three */}
    <Sequence from={540} durationInFrames={180}>
      <ThreePhones />
    </Sequence>
  </AbsoluteFill>
);
