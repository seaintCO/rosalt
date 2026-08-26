"use client";

import { useEffect } from "react";

const interactiveSelector = [
  ".sv4-product-hero",
  ".bento-card",
  ".pv6-stage-shell",
  ".planner-shell",
  ".hs6-setup-card",
  ".guest-crm-workspace",
].join(",");

export function PrecisionInteractions() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>(interactiveSelector));
    const cleanups = surfaces.map((surface) => {
      const move = (event: PointerEvent) => {
        const bounds = surface.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        surface.style.setProperty("--pointer-x", `${x}px`);
        surface.style.setProperty("--pointer-y", `${y}px`);
        surface.style.setProperty("--tilt-x", `${((0.5 - y / bounds.height) * 1.2).toFixed(2)}deg`);
        surface.style.setProperty("--tilt-y", `${((x / bounds.width - 0.5) * 1.2).toFixed(2)}deg`);
        surface.dataset.pointer = "active";
      };
      const leave = () => { delete surface.dataset.pointer; };
      surface.addEventListener("pointermove", move, { passive: true });
      surface.addEventListener("pointerleave", leave);
      return () => {
        surface.removeEventListener("pointermove", move);
        surface.removeEventListener("pointerleave", leave);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
