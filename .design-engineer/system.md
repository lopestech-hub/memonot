# MemoNot Design System

> Design system completo para o app de notas MemoNot.
> Atualizado automaticamente. Seguir rigorosamente em todas as interfaces.

---

## 🎯 Design Direction

**Personalidade:** Warmth & Approachability + Utility & Function
**Produto:** App de notas pessoais com Markdown
**Usuários:** Pessoas que querem organizar pensamentos de forma simples
**Emoção:** Foco, clareza, conforto

---

## 🎨 Color Foundation

### Base (Cool Neutrals)
```css
--bg-app: #f8fafc;           /* slate-50 - fundo principal */
--bg-card: #ffffff;          /* white - cards e superfícies */
--bg-elevated: #f1f5f9;      /* slate-100 - elementos elevados */
--bg-hover: #e2e8f0;         /* slate-200 - hover states */
```

### Text
```css
--text-primary: #0f172a;     /* slate-900 - títulos, texto principal */
--text-secondary: #475569;   /* slate-600 - texto secundário */
--text-muted: #94a3b8;       /* slate-400 - texto desabilitado */
--text-inverse: #ffffff;     /* white - texto em fundos escuros */
```

### Brand (Violet - criatividade e foco)
```css
--brand-50: #f5f3ff;
--brand-100: #ede9fe;
--brand-500: #8b5cf6;        /* violet-500 - accent principal */
--brand-600: #7c3aed;        /* violet-600 - hover */
--brand-700: #6d28d9;        /* violet-700 - active */
```

### Semantic
```css
--success: #10b981;          /* emerald-500 */
--success-bg: #ecfdf5;       /* emerald-50 */
--error: #ef4444;            /* red-500 */
--error-bg: #fef2f2;         /* red-50 */
--warning: #f59e0b;          /* amber-500 */
--warning-bg: #fffbeb;       /* amber-50 */
```

### Borders
```css
--border: #e2e8f0;           /* slate-200 */
--border-focus: #8b5cf6;     /* violet-500 */
```

---

## 📐 Spacing System (4px Grid)

```css
--space-1: 4px;    /* micro - icon gaps */
--space-2: 8px;    /* tight - within components */
--space-3: 12px;   /* standard - between related */
--space-4: 16px;   /* comfortable - section padding */
--space-6: 24px;   /* generous - between sections */
--space-8: 32px;   /* major - page sections */
--space-12: 48px;  /* hero - major separation */
```

---

## 🔤 Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Scale (Reduzido 20%)
```css
--text-xs: 0.6rem;     /* 9.6px - labels, badges */
--text-sm: 0.7rem;     /* 11.2px - body small, buttons */
--text-base: 0.8rem;   /* 12.8px - body */
--text-lg: 0.9rem;     /* 14.4px - lead text */
--text-xl: 1rem;       /* 16px - section titles */
--text-2xl: 1.2rem;    /* 19.2px - page titles */
--text-3xl: 1.5rem;    /* 24px - hero */
```

### Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 🔲 Border Radius (Soft System)

```css
--radius-sm: 6px;      /* inputs, badges */
--radius-md: 8px;      /* buttons, small cards */
--radius-lg: 12px;     /* cards, modals */
--radius-xl: 16px;     /* large containers */
--radius-full: 9999px; /* pills, avatars */
```

---

## 🌫️ Depth & Elevation (Subtle Single Shadows)

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);
```

---

## 🧩 Component Patterns

### Buttons

**Primary Button**
```
h-10 (40px) | px-4 | text-sm font-medium
bg-violet-600 text-white rounded-lg
hover:bg-violet-700 
focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
disabled:opacity-50 disabled:cursor-not-allowed
transition-colors duration-150
```

**Secondary Button**
```
h-10 | px-4 | text-sm font-medium
bg-white text-slate-700 border border-slate-200 rounded-lg
hover:bg-slate-50 hover:border-slate-300
focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
```

**Ghost Button**
```
h-10 | px-4 | text-sm font-medium
text-slate-600 rounded-lg
hover:bg-slate-100 hover:text-slate-900
```

**Icon Button**
```
h-9 w-9 | flex items-center justify-center
text-slate-500 rounded-lg
hover:bg-slate-100 hover:text-slate-700
```

### Inputs

**Text Input**
```
h-10 | px-3 | text-sm
bg-white border border-slate-200 rounded-lg
placeholder:text-slate-400
focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
```

**Textarea**
```
min-h-[120px] | p-3 | text-sm
bg-white border border-slate-200 rounded-lg
resize-none
focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
```

### Cards

**Default Card**
```
bg-white rounded-xl border border-slate-200
p-4 or p-6
hover:border-slate-300 hover:shadow-sm
transition-all duration-150
```

**Interactive Card**
```
bg-white rounded-xl border border-slate-200
p-4
cursor-pointer
hover:border-violet-300 hover:shadow-md hover:scale-[1.01]
transition-all duration-150
```

### Badges

**Default Badge**
```
inline-flex items-center
px-2.5 py-0.5 | text-xs font-medium
rounded-full
```

**Markdown Badge:** `bg-violet-100 text-violet-700`
**Text Badge:** `bg-slate-100 text-slate-600`

### Navigation

**Header**
```
h-16 | px-4 sm:px-6 lg:px-8
bg-white/80 backdrop-blur-sm
border-b border-slate-200
sticky top-0 z-40
```

**Sidebar (Left)**
```
w-64 | bg-white border-r border-slate-200
h-screen sticky top-0
flex flex-col
```

**Sidebar Logo**
```
h-16 | px-4 | border-b border-slate-200
flex items-center gap-3
```

**Sidebar Nav Item**
```
h-9 | px-3 | rounded-lg
flex items-center gap-3
text-sm font-medium
Active: bg-violet-50 text-violet-700
Inactive: text-slate-600 hover:bg-slate-50 hover:text-slate-900
```

**Sidebar Section Header**
```
text-xs font-semibold text-slate-500
uppercase tracking-wider
px-3 mb-2
```

---

## 📱 Layout Patterns

### Page Container
```
max-w-7xl mx-auto
px-4 sm:px-6 lg:px-8
py-6 sm:py-8
```

### Grid Layouts
```
/* Dashboard stats */
grid grid-cols-1 md:grid-cols-3 gap-6

/* Notes list */
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4

/* Two column with sidebar */
grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6
```

---

## ✨ Interactions & Animations

### Transitions
```css
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

### Hover States
- Cards: subtle border color change + slight shadow
- Buttons: background color shift
- Links: color change + optional underline
- Icons: color change

### Focus States
- Always visible ring: `ring-2 ring-violet-500 ring-offset-2`
- Never remove focus indicators

### Loading States
```
/* Spinner */
animate-spin h-5 w-5 border-2 border-violet-600 border-t-transparent rounded-full

/* Skeleton */
bg-slate-200 animate-pulse rounded-md
```

---

## 🎭 Dark Mode (Future)

```css
/* Dark mode variables - to implement */
--bg-app-dark: #0f172a;
--bg-card-dark: #1e293b;
--text-primary-dark: #f8fafc;
--text-secondary-dark: #94a3b8;
```

---

## ✅ Design Checklist

Before shipping any UI:
- [ ] Spacing follows 4px grid
- [ ] Colors from defined palette only
- [ ] Border radius consistent (soft system)
- [ ] Focus states visible and accessible
- [ ] Hover states on all interactive elements
- [ ] Loading states for async operations
- [ ] Error states with clear messaging
- [ ] Responsive at all breakpoints
- [ ] Typography hierarchy clear
