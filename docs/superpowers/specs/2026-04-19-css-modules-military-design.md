# CSS Modules + Military Design Refactor

**Goal:** Replace Tailwind utility classes with CSS Modules per component and apply a Tactical Military visual design inspired by CrossFit performance gear.

**Architecture:** One `.module.css` per component/page. Shared design tokens in `src/styles/variables.css` imported globally. `index.css` contains only resets and the variables import. Tailwind is removed entirely.

**Tech Stack:** React 18, TypeScript, Vite, CSS Modules (native browser feature, zero deps)

---

## Design Tokens (`src/styles/variables.css`)

```css
:root {
  /* Backgrounds */
  --bg-base:     #080C08;
  --bg-surface:  #0F1A0F;
  --bg-elevated: #162116;

  /* Borders */
  --border:      #2A3D2A;
  --border-hot:  #CC5500;

  /* Text */
  --text-primary:   #E8E8E0;
  --text-secondary: #7A8F7A;

  /* Accents */
  --red:          #C0392B;
  --red-dark:     #A93226;
  --orange:       #CC5500;
  --orange-dark:  #AA4400;
  --green:        #4A7A3A;
  --green-bright: #6BAF5A;
}
```

---

## Typography Rules

- Headings: `uppercase`, `font-weight: 900`, `letter-spacing: 0.1em`
- Labels: `uppercase`, `font-size: 11px`, `letter-spacing: 0.15em`, color `--text-secondary`
- Body: `--text-primary`, `font-size: 14px`
- Font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

---

## Components

### Layout (`Layout.module.css`)
- `--bg-base` background on main content area
- Mobile: sticky top bar (black, hamburger + logo), sidebar as slide-in drawer with dark overlay
- Desktop (`min-width: 1024px`): sidebar fixed left, content beside it

### Sidebar (`Sidebar.module.css`)
- Background `--bg-surface`, right border `1px solid --border`
- Logo: "SPORTLIFE" in `--red`, subtitle in `--text-secondary`, Dumbbell icon in `--orange`
- Section labels: `--text-secondary`, `10px`, uppercase, `letter-spacing: 0.15em`
- Inactive links: `--text-secondary`, no left border
- Active links: `3px solid --orange` left border, `--text-primary`, background `--bg-elevated`
- Logout: `--text-secondary` → hover `--red`

### Buttons
- **Primary:** `background: --red`, white text, `uppercase`, `font-weight: 900`, `letter-spacing: 0.1em`, `border-radius: 2px` — hover: `--red-dark`
- **Outline:** `border: 1px solid --border`, `--text-secondary` — hover: `border-color: --orange`, `--text-primary`
- **Success:** `background: --green`, white text
- **Warning:** `background: --orange`, white text

### Inputs
- Background `--bg-base`, border `1px solid --border`, `--text-primary`
- Focus: `border-color: --orange`, no native outline
- Placeholder: `--text-secondary`
- Labels: uppercase, `11px`, `letter-spacing: 0.15em`, `--text-secondary`

### Cards / Panels
- Background `--bg-surface`, border `1px solid --border`, `border-radius: 4px`
- No soft shadows — defined borders only

### StatusBadge (`StatusBadge.module.css`)
- Shape: `border-radius: 0` (square), uppercase, `10px`, `font-weight: 700`
- `active`: green background tint, `--green-bright` text, green border
- `pending`: orange background tint, `--orange` text, orange border
- `expired/inactive`: red background tint, `--red` text, red border

### Tables
- Header: `--bg-elevated`, `--text-secondary`, uppercase
- Row border-bottom: `--border`
- Row hover: `--bg-elevated`
- No zebra striping

---

## Pages

### Login / Register
- Full screen centered, `--bg-base`
- Narrow card with `4px solid --orange` left border
- "SPORTLIFE" in `--red`, large uppercase above form
- Subtitle "CrossFit Gym" in `--text-secondary`

### Dashboard (member)
- "BIENVENIDO, [NOMBRE]" uppercase header
- Membership card with left border color by status: green=active, red=expired
- "VER PLANES" button in `--red`

### Plans
- Grid of cards, each with `3px solid --orange` top border
- Price large and bold, duration in `--text-secondary`
- "SELECCIONAR" button in `--red`

### Admin Dashboard
- Stat cards with large number + uppercase label
- Each stat: distinct accent color on top border

### Admin Tables (Users, Plans, Payments, MercadoPago)
- Military table style: defined borders, no curves, uppercase headers
- Action icons (edit/delete) small, right-aligned

### Payment Success / Failure / Pending
- Centered full screen
- Large status icon colored by result
- Message in uppercase bold

---

## File Structure

```
src/
  styles/
    variables.css          ← design tokens (NEW)
  index.css                ← resets only, imports variables.css (MODIFIED)
  components/
    Layout.module.css      ← NEW
    Sidebar.module.css     ← NEW
    StatusBadge.module.css ← NEW
  pages/
    Login.module.css       ← NEW
    Register.module.css    ← NEW
    Dashboard.module.css   ← NEW
    Plans.module.css       ← NEW
    PaymentSuccess.module.css ← NEW
    PaymentFailure.module.css ← NEW
    PaymentPending.module.css ← NEW
    admin/
      AdminDashboard.module.css ← NEW
      AdminUsers.module.css     ← NEW
      AdminPlans.module.css     ← NEW
      AdminPayments.module.css  ← NEW
      AdminMercadoPago.module.css ← NEW
```

Each `.tsx` file imports its own `.module.css` and uses `styles.className` references. Tailwind classes are removed from all files. `tailwindcss`, `autoprefixer` and config files are removed.
