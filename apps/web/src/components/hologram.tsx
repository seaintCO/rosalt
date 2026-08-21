export function Hologram({ size = "standard", label }: { size?: "micro" | "compact" | "standard"; label?: string }) {
  return <div className={`voynue-hologram is-${size}`} aria-hidden="true">
    <span className="holo-grid" />
    <i className="holo-ring ring-one" />
    <i className="holo-ring ring-two" />
    <i className="holo-ring ring-three" />
    <i className="holo-plane plane-one" />
    <i className="holo-plane plane-two" />
    <span className="holo-core"><b>{label ?? "V"}</b></span>
    <span className="holo-scan" />
    <span className="holo-node node-one" />
    <span className="holo-node node-two" />
    <span className="holo-node node-three" />
    <span className="holo-telemetry">01·ALMA</span>
  </div>;
}
