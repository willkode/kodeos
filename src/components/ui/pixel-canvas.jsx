import { useEffect } from "react";
import * as React from "react";

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = Math.random() * (this.maxSizeInteger - this.minSize) + this.minSize;
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) { this.counter += this.counterStep; return; }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) { this.shimmer(); } else { this.size += this.sizeStep; }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) { this.isIdle = true; return; }
    this.size -= 0.1;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    if (this.isReverse) this.size -= this.speed;
    else this.size += this.speed;
  }
}

let _registered = false;

class PixelCanvasElement extends HTMLElement {
  constructor() {
    super();
    this._canvas = document.createElement("canvas");
    this._ctx = this._canvas.getContext("2d");
    this._pixels = [];
    this._animation = null;
    this._timeInterval = 1000 / 60;
    this._timePrevious = performance.now();
    this._reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this._initialized = false;
    this._resizeObserver = null;
    this._parent = null;

    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host { display: grid; inline-size: 100%; block-size: 100%; overflow: hidden; }`;
    shadow.appendChild(style);
    shadow.appendChild(this._canvas);
  }

  get colors() { return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"]; }
  get gap() { return Math.max(4, Math.min(50, Number(this.dataset.gap) || 5)); }
  get speed() { return this._reducedMotion ? 0 : Math.max(0, Math.min(100, Number(this.dataset.speed) || 35)) * 0.001; }
  get noFocus() { return this.hasAttribute("data-no-focus"); }
  get variant() { return this.dataset.variant || "default"; }

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    this._parent = this.parentElement;

    this._onEnter = () => this.handleAnimation("appear");
    this._onLeave = () => this.handleAnimation("disappear");

    requestAnimationFrame(() => {
      this.handleResize();
      const ro = new ResizeObserver(() => requestAnimationFrame(() => this.handleResize()));
      ro.observe(this);
      this._resizeObserver = ro;
    });

    this._parent?.addEventListener("mouseenter", this._onEnter);
    this._parent?.addEventListener("mouseleave", this._onLeave);
    if (!this.noFocus) {
      this._parent?.addEventListener("focus", this._onEnter, { capture: true });
      this._parent?.addEventListener("blur", this._onLeave, { capture: true });
    }
  }

  disconnectedCallback() {
    this._initialized = false;
    this._resizeObserver?.disconnect();
    this._parent?.removeEventListener("mouseenter", this._onEnter);
    this._parent?.removeEventListener("mouseleave", this._onLeave);
    if (!this.noFocus) {
      this._parent?.removeEventListener("focus", this._onEnter);
      this._parent?.removeEventListener("blur", this._onLeave);
    }
    if (this._animation) { cancelAnimationFrame(this._animation); this._animation = null; }
    this._parent = null;
  }

  handleResize() {
    if (!this._ctx || !this._initialized) return;
    const rect = this.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const w = Math.floor(rect.width), h = Math.floor(rect.height);
    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = w * dpr;
    this._canvas.height = h * dpr;
    this._canvas.style.width = `${w}px`;
    this._canvas.style.height = `${h}px`;
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.scale(dpr, dpr);
    this.createPixels();
  }

  getDistanceToCenter(x, y) {
    const dx = x - this._canvas.width / 2, dy = y - this._canvas.height / 2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getDistanceToBottomLeft(x, y) {
    const dx = x, dy = this._canvas.height - y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  createPixels() {
    if (!this._ctx) return;
    this._pixels = [];
    for (let x = 0; x < this._canvas.width; x += this.gap) {
      for (let y = 0; y < this._canvas.height; y += this.gap) {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const delay = this._reducedMotion ? 0 :
          this.variant === "icon" ? this.getDistanceToCenter(x, y) : this.getDistanceToBottomLeft(x, y);
        this._pixels.push(new Pixel(this._canvas, this._ctx, x, y, color, this.speed, delay));
      }
    }
  }

  handleAnimation(name) {
    if (this._animation) cancelAnimationFrame(this._animation);
    const animate = () => {
      this._animation = requestAnimationFrame(animate);
      const now = performance.now();
      const passed = now - this._timePrevious;
      if (passed < this._timeInterval) return;
      this._timePrevious = now - (passed % this._timeInterval);
      if (!this._ctx) return;
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      let allIdle = true;
      for (const pixel of this._pixels) {
        pixel[name]();
        if (!pixel.isIdle) allIdle = false;
      }
      if (allIdle) { cancelAnimationFrame(this._animation); this._animation = null; }
    };
    animate();
  }
}

const PixelCanvas = React.forwardRef(({ gap, speed, colors, variant, noFocus, style, ...props }, ref) => {
  useEffect(() => {
    if (!_registered && typeof window !== "undefined" && !customElements.get("pixel-canvas")) {
      customElements.define("pixel-canvas", PixelCanvasElement);
      _registered = true;
    }
  }, []);

  return React.createElement("pixel-canvas", {
    ref,
    "data-gap": gap,
    "data-speed": speed,
    "data-colors": colors?.join(","),
    "data-variant": variant,
    ...(noFocus && { "data-no-focus": "" }),
    style: { position: "absolute", inset: 0, pointerEvents: "none", width: "100%", height: "100%", ...style },
    ...props,
  });
});

PixelCanvas.displayName = "PixelCanvas";

export { PixelCanvas };