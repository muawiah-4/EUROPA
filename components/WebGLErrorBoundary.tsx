"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Catches render/effect errors from a WebGL subtree (most commonly a
 * failed context creation when WebGL is disabled, blocklisted or out of
 * contexts) and swaps in a static fallback, so a decorative canvas can
 * never take the whole page down with it.
 */
export default class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("WebGL scene failed; showing static fallback.", error, info.componentStack);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
