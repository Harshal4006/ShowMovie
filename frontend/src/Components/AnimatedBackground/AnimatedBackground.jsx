import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  return (
    <div className="app-background" aria-hidden="true">
      <div className="app-background__base" />
      <div className="app-background__radial app-background__radial--top" />
      <div className="app-background__radial app-background__radial--bottom" />
      <div className="app-background__aurora" />
      <div className="app-background__beam app-background__beam--left" />
      <div className="app-background__beam app-background__beam--right" />
      <div className="app-background__glow app-background__glow--left" />
      <div className="app-background__glow app-background__glow--center" />
      <div className="app-background__glow app-background__glow--right" />
      <div className="app-background__ring app-background__ring--one" />
      <div className="app-background__ring app-background__ring--two" />
      <div className="app-background__spotlight" />
      <div className="app-background__grid" />
      <div className="app-background__lines" />
      <div className="app-background__particles" />
      <div className="app-background__grain" />
      <div className="app-background__vignette" />
    </div>
  );
};

export default AnimatedBackground;
