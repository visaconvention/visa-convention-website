# VISUAL_DESIGN_AUDIT.md — Visual Design System & UI Specification Audit

**Project:** Visa Convention — Official Website  
**Date:** November 12, 2026  
**Auditor:** Principal Creative Director & Design Systems Architect  
**Version:** 1.21.0  
**Status:** **APPROVED & FULLY IMPLEMENTED**

---

## 1. Design Philosophy & Brand Direction

Visa Convention projects the polish, authority, and elegance of a premier international education and visa consultancy. The design strictly rejects the visual anti-patterns common to local visa agent templates (garish high-saturation gradients, low-res clip-art airplanes, cluttered banners, and flashing badges), replacing them with an authentic, refined global aesthetic:
- **Atmosphere:** Clean, modern, trustworthy, and internationally oriented.
- **Visual Weight:** Balanced 52/48 content-to-image distribution in heroes, generous vertical whitespace, and structured 3-column desktop grids.
- **Photographic Standard:** Authentic editorial photography of world-renowned landmarks, prestigious university campuses, and verified destination environments.

---

## 2. Core Color Palette & Contrast Specifications

| Token Name | Hex Code | Purpose & Application | Contrast on White | Contrast on Navy | WCAG 2.2 AA Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Brand Navy** | `#102A53` | Primary structural brand color, main headings, header, footer background | **14.21:1** | N/A | **PASS (Exceeds 4.5:1)** |
| **Travel Blue** | `#1769B3` | Vibrant brand accent, interactive links, subheadings, icons | **5.14:1** | 2.76:1 | **PASS** |
| **Signature Red** | `#C91D32` | High-converting primary CTA buttons, urgency badges, active indicators | **5.67:1** | 2.50:1 | **PASS (Exceeds 4.5:1)** |
| **Sky Blue** | `#EAF4FF` | Atmospheric hero gradient backgrounds, subtle card surfaces | 1.18:1 | **12.04:1** | Decorative Surface |
| **Clean Background** | `#F5F8FC` | Alternating section backgrounds, form field surfaces | 1.05:1 | **13.53:1** | Section Surface |
| **Pure White** | `#FFFFFF` | Primary card surfaces, content containers, contrast text | N/A | **14.21:1** | High-Contrast Surface |

---

## 3. Typographic Hierarchy & Scale

The system standardizes on **Plus Jakarta Sans**, a modern geometric grotesque typeface with warm, approachable open counters:

```
[Display H1]     : 2.25rem – 3.35rem (36px – 54px) | Font-Weight: 900 (Black) | Leading: 1.08 | text-balance
[Section H2]     : 1.75rem – 2.50rem (28px – 40px) | Font-Weight: 800 (Extrabold) | Leading: 1.15 | text-balance
[Card H3]        : 1.125rem – 1.35rem (18px – 22px) | Font-Weight: 700 (Bold) | Leading: 1.25
[Subheadline]    : 0.75rem – 0.875rem (12px – 14px) | Font-Weight: 700 (Bold) | Tracking: 0.05em (Uppercase)
[Body Text]      : 0.9375rem – 1.0625rem (15px – 17px) | Font-Weight: 400 (Normal) | Leading: 1.60 | Max-Width: 62ch
[Small / Meta]   : 0.75rem – 0.8125rem (12px – 13px) | Font-Weight: 500 (Medium) | Leading: 1.40
[Badge / Pill]   : 0.625rem – 0.75rem (10px – 12px) | Font-Weight: 800 (Extrabold) | Tracking: 0.08em (Uppercase)
```

---

## 4. Layout, Spacing & Container System

- **Site Container:**
  - Formula: `width: min(calc(100% - 2.5rem), 1160px); margin-inline: auto;`
  - Ensures a comfortable 20px gutter on mobile devices while capping max desktop reading line width to 1160px.
- **Section Rhythm:**
  - Standard Section Padding: `clamp(3rem, 5vw, 4.5rem)` (48px–72px).
  - Compact Section Padding: `clamp(2rem, 3.5vw, 3rem)` (32px–48px).
- **Grid Architecture:**
  - Desktop: 3-column balanced grid (`grid-cols-3 gap-6 items-stretch`).
  - Tablet: 2-column balanced grid (`md:grid-cols-2`).
  - Mobile: Single-column full-width card stack (`grid-cols-1`).

---

## 5. Reusable Component Specifications

### 5.1 Buttons & Interactive Touch Targets
- **Primary CTA (`.btn-primary`):** Signature Red (`#C91D32`), white bold text, `rounded-xl`, subtle shadow (`shadow-sm`), minimum height `48px` to guarantee WCAG touch target compliance. Hover: darkens to `#A81729` with `transform: translateY(-1px)`.
- **Secondary CTA (`.btn-secondary`):** Deep Navy (`#102A53`), white bold text, `rounded-xl`, minimum height `48px`.
- **Outline Action (`.btn-outline`):** White surface, 1.5px border (`#E2E8F0`), Deep Navy text. Hover: light blue surface (`#F0F6FB`) with border color transition to Travel Blue (`#1769B3`).

### 5.2 Service & Country Cards (`.card-premium`)
- **Container:** Pure white surface (`#FFFFFF`), 1px refined border (`#E2E8F0`), `rounded-2xl` (20px border radius), subtle elevation (`shadow-2xs`).
- **Image Header:** `h-40 sm:h-44`, `w-full`, `object-fit: cover`, smooth hover zoom (`group-hover:scale-105 transition-transform duration-300`).
- **Pill Badge Overlay:** Absolute position (`top-3 left-3`), semi-transparent backdrop blur (`bg-brand-navy/90 text-white backdrop-blur-xs`), `text-[10px] font-extrabold uppercase`.
- **Pinned Bottom Actions:** `mt-auto pt-2 border-t border-brand-border/60`, ensuring all cards maintain identical vertical heights regardless of description text variations.

### 5.3 Forms & Inputs
- **Inputs:** Height `48px`, `rounded-xl`, border `#E2E8F0`, padding `0.75rem 1rem`, accessible visible focus ring (`focus-visible:ring-2 focus-visible:ring-brand-blue`).
- **Validation State:** `aria-invalid="true"` adds red border (`#C91D32`) and reveals inline accessible error text.

---

## 6. Visual Anti-Pattern Enforcement

| Prohibited Anti-Pattern | Enforced Standard |
| :--- | :--- |
| **Garish neon gradients** | Refined Sky Blue-to-White atmosphere (`#EAF4FF` fading to `#FFFFFF`). |
| **Generic clip-art planes** | Stylized minimalist SVG flight motif integrated cleanly in brand mark. |
| **Oversized decorative banners** | Compact, content-led cards with pinned actions. |
| **Unresponsive wide tables** | Responsive grid cards with horizontal scroll prevention on mobile. |
| **Unfocused stock photography** | Sourced iconic cityscapes, verified campus architecture, and licensed clinical labs. |
