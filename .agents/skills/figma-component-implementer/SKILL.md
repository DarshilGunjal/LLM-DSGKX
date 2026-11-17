---
name: figma-component-implementer
description: Implement a Figma frame as a component in this project using get_design_context while keeping existing components and font/design tokens.
---

# Implement Figma Frame as Component

This skill defines the standardized workflow for translating a Figma frame link into a production-ready component within the project, preserving design tokens, font hierarchy, and reusable components.

## Trigger Instructions

When given a prompt such as:
> *"Implement this Figma frame as a component in our project: `<frame-url>`. Use `get_design_context`, keep our existing components and font tokens."*

Follow this step-by-step workflow:

---

### Step 1: Extract Design Context from Figma
1. Parse the Figma file key and node/frame ID from the provided URL.
2. Invoke the Figma MCP tool `get_design_context` (provided by the Figma plugin) with the frame identifier.
3. Review the extracted metadata:
   - Layout mode (Auto-layout, flex direction, padding, gap, alignment).
   - Color fills, strokes, and border radius.
   - Typography specifications (font family, weight, font size, line height, letter spacing).
   - Component variants and interactive states (hover, focus, disabled, active).

---

### Step 2: Audit & Map to Existing Project Tokens
Do not hardcode raw pixel values, arbitrary hex colors, or custom fonts if existing design tokens match:
1. **Font Tokens & Typography**:
   - Map Figma font families and sizes to existing typography classes / tokens (`Plus Jakarta Sans`, `JetBrains Mono`, `--text-primary`, `--text-secondary`, font sizes).
2. **Color Palette & Glassmorphism**:
   - Map background fills to `--bg-canvas`, `--bg-surface`, `--bg-surface-elevated`.
   - Map borders to `--border-subtle`, `--border-medium`, `--border-accent`.
   - Map accents to semantic jewel tones (`--accent-primary`, `--accent-cyan`, `--accent-emerald`, `--accent-amber`, `--accent-rose`).
3. **Spatial Scale**:
   - Align margins, paddings, and gaps to the 8-point spatial scale (`--space-1` to `--space-12`).
   - Match radii (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`).

---

### Step 3: Reuse Existing Components
1. Before authoring new UI primitives from scratch, check existing components in the codebase (e.g., buttons, badge pills, token chips, glass panels, metric cards).
2. Compose existing UI elements where applicable instead of reinventing them.

---

### Step 4: Component Implementation & Micro-Interactions
1. Implement the component cleanly with responsive behavior across mobile, tablet, and desktop viewports.
2. Add fluid micro-interactions (`--spring-smooth`, hover states, tactile clicks, accessible focus rings).
3. Ensure accessibility (WCAG 2.2 AAA): proper ARIA labels, contrast ratios, and keyboard navigation.

---

### Step 5: Verification & Integration
1. Mount or import the new component in the target container.
2. Verify visual fidelity against the Figma design specification and test responsive breakpoints.
