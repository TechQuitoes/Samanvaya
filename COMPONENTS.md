# Samanvaya UI Component Library Documentation

Comprehensive guide to standard core components (`E*` and `Sacred*` primitives) used across the Samanvaya frontend.

---

## Table of Contents

1. [Layout & Shell Components](#1-layout--shell-components)
   - [SacredPortalLayout](#sacredportallayout)
   - [SacredPageHeader](#sacredpageheader)
   - [ECard](#ecard)
   - [LotusDivider](#lotusdivider)
2. [Form & Input Primitives](#2-form--input-primitives)
   - [EInput](#einput)
   - [EPasswordInput](#epasswordinput)
   - [EMobileInput](#emobileinput)
   - [EEmailInput](#eemailinput)
   - [ETextarea](#etextarea)
   - [ESelect](#eselect)
   - [EDateTimePicker](#edatetimepicker)
3. [Modals, Drawers & Overlays](#3-modals-drawers--overlays)
   - [EResponsiveDrawer](#eresponsivedrawer)
   - [EModal](#emodal)
4. [File Upload & Avatars](#4-file-upload--avatars)
   - [S3Uploader](#s3uploader)
   - [SacredAvatarUpload](#sacredavatarupload)
   - [EAvatar](#eavatar)
5. [Actions, Badges & Navigation](#5-actions-badges--navigation)
   - [EButton](#ebutton)
   - [Badge](#badge)
   - [SacredPillTabs](#sacredpilltabs)
6. [Data Display, Feedback & Loading](#6-data-display-feedback--loading)
   - [ETable & SacredTableContainer](#etable--sacredtablecontainer)
   - [SacredStatCard](#sacredstatcard)
   - [ESkeleton](#eskeleton)
7. [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## 1. Layout & Shell Components

### `SacredPortalLayout`
**Path:** `@/components/layout/SacredPortalLayout`  
**Description:** The primary application shell containing the responsive sidebar navigation (`AdminSidebar`), top navigation header (`AdminHeader`), greeting bar, page title integration, and optional sacred artwork hero/footer banners.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Page body content |
| `title` | `string` | `undefined` | Integrated page title |
| `subtitle` | `string` | `undefined` | Subtitle description below title |
| `icon` | `LucideIcon` | `undefined` | Icon shown beside the page title |
| `actions` | `React.ReactNode` | `undefined` | Buttons/controls rendered on the top right |
| `showGreeting` | `boolean` | `true` | Show top devotee greeting bar |
| `heroArtwork` | `boolean \| SacredHeroArtworkProps` | `false` | Mobile decorative hero banner |
| `showFooterBanner` | `boolean` | `false` | Bottom artwork banner |

#### Example Usage
```tsx
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import { Plane, Plus } from "lucide-react";
import EButton from "@/components/common/EButton";

export default function TravelPage() {
  return (
    <SacredPortalLayout
      title="Travel Management"
      subtitle="Plan and review devotional tours and yatras"
      icon={Plane}
      actions={
        <EButton variant="sacred-primary" leftIcon={<Plus className="w-4 h-4" />}>
          Plan New Travel
        </EButton>
      }
    >
      <div className="space-y-6">{/* Page Content */}</div>
    </SacredPortalLayout>
  );
}
```

---

### `SacredPageHeader`
**Path:** `@/components/common/SacredPageHeader`  
**Description:** Standalone header block displaying page title, subtitle, icon inside a sacred emerald badge, and an action bar.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Main header text |
| `subtitle` | `string` | `undefined` | Contextual subtitle |
| `icon` | `LucideIcon` | **Required** | Lucide icon component |
| `actions` | `React.ReactNode` | `undefined` | Action buttons / search input on the right |

#### Example Usage
```tsx
import SacredPageHeader from "@/components/common/SacredPageHeader";
import { Users } from "lucide-react";

<SacredPageHeader
  title="Devotee Directory"
  subtitle="Manage community profiles and seva roles"
  icon={Users}
  actions={<button>Export</button>}
/>
```

---

### `ECard`
**Path:** `@/components/common/ECard`  
**Description:** Themed container card with warm ivory backgrounds, subtle borders, rounded corners, and built-in header, icon, subtitle, and divider support.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"sacred" \| "white" \| "subtle" \| "outline"` | `"sacred"` | Visual style |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Internal padding |
| `title` | `React.ReactNode` | `undefined` | Card header title |
| `subtitle` | `React.ReactNode` | `undefined` | Optional subtext under title |
| `icon` | `React.ReactNode` | `undefined` | Icon displayed before title |
| `headerAction` | `React.ReactNode` | `undefined` | Controls aligned to right of header |
| `headerDivider`| `boolean` | `false` | Line separator under header |

#### Example Usage
```tsx
import ECard from "@/components/common/ECard";
import { Building } from "lucide-react";

<ECard
  title="Stay Arrangements"
  icon={<Building className="w-5 h-5 text-[#174824]" />}
  headerDivider
>
  <p className="text-sm text-[#5a4836]">ISKCON Guest House, Delhi</p>
</ECard>
```

---

### `LotusDivider`
**Path:** `@/components/ui/LotusDivider`  
**Description:** Signature decorative divider line featuring a centered golden lotus icon or Devanagari sacred text flanked by thin golden rules with end dots.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `"xs" \| "sm" \| "md" \| "lg" \| "full"` | `"xs"` | Maximum width of divider |
| `iconSize` | `number` | `16` | Lotus icon width/height in px |
| `text` | `string` | `undefined` | Optional text replacement for icon |
| `isDevanagari` | `boolean` | `false` | Applies Devanagari spiritual styling |

#### Example Usage
```tsx
import LotusDivider from "@/components/ui/LotusDivider";

<LotusDivider maxWidth="sm" />
```

---

## 2. Form & Input Primitives

### `EInput`
**Path:** `@/components/common/EInput`  
**Description:** Core text input supporting labels, left/right icons, error states, size variants, and view-only inline editing.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Field label |
| `error` | `string` | `undefined` | Validation error message |
| `leftIcon` / `icon` | `ReactNode \| LucideIcon` | `undefined` | Icon inside input on the left |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon inside input on the right |
| `inputSize` | `"sm" \| "md" \| "lg"` | `"md"` | Input height and typography scale |
| `viewOnly` | `boolean` | `false` | Displays as plain text with edit trigger |

#### Example Usage
```tsx
import EInput from "@/components/common/EInput";
import { User } from "lucide-react";

<EInput
  label="Full Name"
  placeholder="Enter devotee name"
  leftIcon={<User className="w-4 h-4 text-stone-400" />}
  required
/>
```

---

### `EPasswordInput`
**Path:** `@/components/common/EPasswordInput`  
**Description:** Dedicated password field with a built-in eye toggle (`Eye` / `EyeOff`) to show/hide password, lock icon, and validation error styling.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"Password"` | Input label |
| `error` | `string` | `undefined` | Error text displayed below input |
| `showLeftIcon` | `boolean` | `true` | Displays Lock icon on left |

#### Example Usage
```tsx
import EPasswordInput from "@/components/common/EPasswordInput";

<EPasswordInput
  label="Account Password"
  placeholder="Enter password"
  error={errors.password}
  required
/>
```

---

### `EMobileInput`
**Path:** `@/components/common/EMobileInput`  
**Description:** Phone number input with phone icon prefix, fixed or selectable country code (`+91`), and mobile number formatting.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"Mobile Number"` | Input label |
| `countryCode` | `string` | `"+91"` | Country dial code prefix |
| `inputSize` | `"sm" \| "md" \| "lg"` | `"md"` | Size scale |
| `error` | `string` | `undefined` | Error feedback message |

#### Example Usage
```tsx
import EMobileInput from "@/components/common/EMobileInput";

<EMobileInput
  label="WhatsApp / Phone"
  placeholder="9876543210"
  countryCode="+91"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
```

---

### `EEmailInput`
**Path:** `@/components/common/EEmailInput`  
**Description:** Pre-configured email input with `Mail` icon, HTML5 email type, and consistent styling.

#### Example Usage
```tsx
import EEmailInput from "@/components/common/EEmailInput";

<EEmailInput
  label="Devotee Email"
  placeholder="devotee@samanvaya.org"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### `ETextarea`
**Path:** `@/components/common/ETextarea`  
**Description:** Multi-line textarea matching the design system with labels, error states, and responsive auto-stretch.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Field label |
| `error` | `string` | `undefined` | Validation error message |
| `rows` | `number` | `3` | Default number of rows |

#### Example Usage
```tsx
import ETextarea from "@/components/common/ETextarea";

<ETextarea
  label="Notes & Special Instructions"
  placeholder="Add prasadam instructions or travel remarks..."
  rows={3}
/>
```

---

### `ESelect`
**Path:** `@/components/common/ESelect`  
**Description:** Custom popover select dropdown with search filtering, custom option icons, sublabels, and error handling.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Select label |
| `value` | `string` | `undefined` | Currently selected value |
| `onChange` | `(val: string) => void` | `undefined` | Direct value change callback |
| `options` | `(ESelectOption \| string)[]` | `[]` | Array of options (`{ value, label, icon }`) |
| `searchable` | `boolean` | `false` | Enables filter search input in dropdown |
| `placeholder`| `string` | `"Select..."` | Empty placeholder |

#### Example Usage
```tsx
import ESelect from "@/components/common/ESelect";

<ESelect
  label="Transport Mode"
  value={mode}
  onChange={(val) => setMode(val)}
  options={[
    { value: "FLIGHT", label: "Flight Transit" },
    { value: "TRAIN", label: "Indian Railways" },
    { value: "CAR", label: "Private Vehicle / Cab" },
  ]}
  searchable
/>
```

---

### `EDateTimePicker`
**Path:** `@/components/common/EDateTimePicker`  
**Description:** Feature-rich date and time picker modal/popover supporting single dates, date-time picking, minimum/maximum limits, and smart positioning.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Datepicker label |
| `value` | `string` | `undefined` | ISO date string (`"2026-09-13T10:00"`) |
| `onChange` | `(val: string) => void` | **Required** | Date selection callback |
| `includeTime` | `boolean` | `true` | Whether to display time selector |
| `minDate` / `maxDate` | `string \| Date` | `undefined` | Bounds for selectable dates |

#### Example Usage
```tsx
import EDateTimePicker from "@/components/common/EDateTimePicker";

<EDateTimePicker
  label="Departure Date & Time"
  value={depTime}
  onChange={(newVal) => setDepTime(newVal)}
  includeTime={true}
  minDate={new Date()}
/>
```

---

## 3. Modals, Drawers & Overlays

### `EResponsiveDrawer`
**Path:** `@/components/common/EResponsiveDrawer`  
**Description:** Adaptive drawer using Radix UI. Renders as a **High Full-Feel Bottom Sheet on Mobile** (`< md`) and a **Sleek Right-Hand Side Drawer on Desktop** (`>= md`).

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **Required** | Open state |
| `onOpenChange` | `(open: boolean) => void` | **Required** | Close handler |
| `title` | `React.ReactNode` | `undefined` | Drawer header title |
| `description` | `React.ReactNode` | `undefined` | Header subtitle/description |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"lg"` | Desktop drawer width |
| `footer` | `React.ReactNode` | `undefined` | Bottom sticky action bar |

#### Example Usage
```tsx
import EResponsiveDrawer from "@/components/common/EResponsiveDrawer";
import EButton from "@/components/common/EButton";

<EResponsiveDrawer
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Devotee Details"
  description="Review membership profile"
  size="lg"
  footer={
    <div className="flex gap-2 justify-end">
      <EButton variant="outline" onClick={() => setIsOpen(false)}>Cancel</EButton>
      <EButton variant="sacred-primary">Save Changes</EButton>
    </div>
  }
>
  <div className="p-4 space-y-4">{/* Drawer Form */}</div>
</EResponsiveDrawer>
```

---

### `EModal`
**Path:** `@/components/common/EModal`  
**Description:** Centered modal dialog with backdrop blur, smooth entry animations, custom icon header, and responsive sizing.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **Required** | Open state |
| `onOpenChange` | `(open: boolean) => void` | **Required** | Close handler |
| `title` | `React.ReactNode` | `undefined` | Modal title |
| `subtitle` / `description` | `React.ReactNode` | `undefined` | Modal subtext |
| `icon` | `React.ReactNode` | `undefined` | Optional top icon |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "full"` | `"sm"` | Width scale |
| `footer` | `React.ReactNode` | `undefined` | Action buttons |

#### Example Usage
```tsx
import { EModal } from "@/components/common/EModal";
import EButton from "@/components/common/EButton";

<EModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  title="Confirm Deletion"
  subtitle="This action cannot be undone."
  size="sm"
  footer={
    <div className="flex gap-2 justify-end">
      <EButton variant="outline" onClick={() => setModalOpen(false)}>Cancel</EButton>
      <EButton variant="destructive">Delete Record</EButton>
    </div>
  }
>
  <p className="text-xs text-[#5a4836]">Are you sure you want to proceed?</p>
</EModal>
```

---

## 4. File Upload & Avatars

### `S3Uploader`
**Path:** `@/components/common/S3Uploader`  
**Description:** The unified Cloudflare R2 / AWS S3 file uploader and document viewer for the entire application. Handles drag & drop, multi-file attachments, max-file limits with auto-hiding, thumbnail previews, and **`viewOnly` mode** with click-to-open document links.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `folder` | `string` | `"uploads"` | S3 target directory prefix (e.g. `"travel/attachments"`) |
| `accept` | `string` | `"image/*,application/pdf"` | Accepted MIME types |
| `maxSizeMB` | `number` | `10` | Maximum file size in MB |
| `maxFiles` | `number` | `undefined` | Max allowed files before uploader auto-hides |
| `files` | `S3FileItem[]` | `undefined` | List of attachments `{ title, fileUrl, fileType, key }` |
| `onUploadSuccess`| `(key, url) => void` | `undefined` | Upload success callback |
| `onRemoveFile` | `(index: number) => void` | `undefined` | Delete file callback |
| `viewOnly` / `readOnly` | `boolean` | `false` | **View-only mode**: renders file list/grid with previews & click-to-open links; hides upload box and delete buttons |
| `variant` | `"dropzone" \| "compact" \| "avatar"` | `"dropzone"` | UI display variant |

#### Example Usages

**1. Upload Mode (with file list & max limit):**
```tsx
import S3Uploader from "@/components/common/S3Uploader";

<S3Uploader
  folder="travel/attachments"
  accept="image/*,application/pdf"
  maxSizeMB={15}
  maxFiles={5}
  files={formData.attachments}
  onUploadSuccess={(key, url) => addAttachment({ key, fileUrl: url })}
  onRemoveFile={(index) => removeAttachment(index)}
/>
```

**2. View-Only Mode (Review cards, detail pages, approval drawers):**
```tsx
import S3Uploader from "@/components/common/S3Uploader";

{/* Renders preview thumbnails, file names, file type, and click-to-open links in new tab */}
<S3Uploader
  files={travel.attachments}
  viewOnly
/>
```

---

### `SacredAvatarUpload`
**Path:** `@/components/common/SacredAvatarUpload`  
**Description:** Dedicated avatar uploader with circular preview, camera button overlay, upload progress, and direct S3 storage integration.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatarUrl` | `string` | `undefined` | Current avatar URL |
| `userName` | `string` | `"Devotee"` | Fallback initial name |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"lg"` | Avatar diameter |
| `editable` | `boolean` | `true` | Whether avatar can be changed |
| `onAvatarUpdated` | `(url, key) => void` | `undefined` | Update callback |

#### Example Usage
```tsx
import SacredAvatarUpload from "@/components/common/SacredAvatarUpload";

<SacredAvatarUpload
  avatarUrl={user.avatar}
  userName={user.name}
  size="lg"
  onAvatarUpdated={(url) => updateUserAvatar(url)}
/>
```

---

### `EAvatar`
**Path:** `@/components/common/EAvatar`  
**Description:** Lightweight user avatar display component with name initials fallback and border variants (`sacred`, `gold`, `muted`).

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image URL |
| `name` | `string` | `undefined` | Devotee name for initials |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` | Size scale |
| `variant` | `"sacred" \| "gold" \| "muted" \| "none"` | `"sacred"` | Border style |

#### Example Usage
```tsx
import EAvatar from "@/components/common/EAvatar";

<EAvatar
  src={devotee.avatar}
  name={devotee.name}
  size="md"
  variant="gold"
/>
```

---

## 5. Actions, Badges & Navigation

### `EButton`
**Path:** `@/components/common/EButton`  
**Description:** Primary button component with sacred color schemes, loading spinners, left/right icons, and link support (`href`).

#### Variants
- `"sacred-primary"` / `"primary"`: Deep Forest Emerald (`#174824`)
- `"outline"`: Clean white background with emerald hover border
- `"sacred-outline"`: Golden amber border and text
- `"secondary"`: Sand-toned neutral button
- `"destructive"`: Crimson danger button
- `"ghost"`: Transparent background

#### Example Usage
```tsx
import EButton from "@/components/common/EButton";
import { Check } from "lucide-react";

<EButton
  variant="sacred-primary"
  size="md"
  isLoading={isSaving}
  leftIcon={<Check className="w-4 h-4" />}
  onClick={handleSave}
>
  Save Travel Plan
</EButton>
```

---

### `Badge`
**Path:** `@/components/ui/badge`  
**Description:** Pill-shaped status indicator. Commonly customized with emerald (`UPCOMING`), amber (`ONGOING`), or neutral tones.

#### Example Usage
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">
  Approved
</Badge>
```

---

### `SacredPillTabs`
**Path:** `@/components/common/SacredPillTabs`  
**Description:** Rounded pill tab selector for table/list filtering with counter badges and pulse animations.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `SacredPillTabItem[]` | **Required** | Tab items `{ id, label, count, icon, countVariant }` |
| `activeTab` | `string` | **Required** | Currently active tab ID |
| `onChange` | `(tabId: string) => void` | **Required** | Tab switch callback |

#### Example Usage
```tsx
import SacredPillTabs from "@/components/common/SacredPillTabs";

<SacredPillTabs
  tabs={[
    { id: "ALL", label: "All Yatras", count: 12 },
    { id: "PENDING", label: "Pending Approval", count: 2, countVariant: "amber" },
    { id: "COMPLETED", label: "Completed", count: 10 },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

---

## 6. Data Display, Feedback & Loading

### `ETable` & `SacredTableContainer`
**Paths:** `@/components/common/ETable`, `@/components/common/SacredTableContainer`  
**Description:** Cohesive table primitives. `SacredTableContainer` provides the rounded corner wrapper with decorative leaf accents and empty state graphics, while `ETable` provides the clean responsive table markup.

#### Key Props for `SacredTableContainer`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isEmpty` | `boolean` | `false` | Displays themed empty state |
| `emptyTitle` | `string` | `"No records found"` | Empty state heading |
| `emptyDescription` | `string` | `...` | Empty state subtext |
| `emptyIcon` | `LucideIcon` | `undefined` | Empty state icon |
| `emptyAction` | `React.ReactNode` | `undefined` | Button to create new record |
| `showLeafAccent` | `boolean` | `true` | Corner sacred leaf illustration |

#### Example Usage
```tsx
import SacredTableContainer from "@/components/common/SacredTableContainer";
import { ETable, ETableHeader, ETableBody, ETableRow, ETableHead, ETableCell } from "@/components/common/ETable";
import { Plane } from "lucide-react";

<SacredTableContainer isEmpty={records.length === 0} emptyIcon={Plane}>
  <ETable>
    <ETableHeader>
      <ETableRow>
        <ETableHead>Devotee</ETableHead>
        <ETableHead>Destination</ETableHead>
        <ETableHead>Dates</ETableHead>
      </ETableRow>
    </ETableHeader>
    <ETableBody>
      {records.map((r) => (
        <ETableRow key={r.id}>
          <ETableCell>{r.name}</ETableCell>
          <ETableCell>{r.destination}</ETableCell>
          <ETableCell>{r.dates}</ETableCell>
        </ETableRow>
      ))}
    </ETableBody>
  </ETable>
</SacredTableContainer>
```

---

### `SacredStatCard`
**Path:** `@/components/common/SacredStatCard`  
**Description:** Metric card showcasing key statistics (e.g. "Active Yatras", "Pending Approvals") with colored icon boxes, numeric counters, and change indicators.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Metric label |
| `value` | `string \| number` | **Required** | Metric value |
| `subtitle` | `string` | `undefined` | Supporting explanation text |
| `icon` | `LucideIcon` | **Required** | Metric icon |
| `variant` | `"default" \| "emerald" \| "amber" \| "rose" \| "blue" \| "gold"` | `"emerald"` | Color theme |
| `isLoading` | `boolean` | `false` | Shows loading skeleton |

#### Example Usage
```tsx
import { SacredStatCard } from "@/components/common/SacredStatCard";
import { Plane } from "lucide-react";

<SacredStatCard
  title="Active Tours"
  value={4}
  subtitle="Currently ongoing devotional travels"
  icon={Plane}
  variant="emerald"
/>
```

---

### `ESkeleton`
**Path:** `@/components/common/ESkeleton`  
**Description:** Shimmer placeholder used during data loading states to prevent layout shifts.

#### Key Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"text" \| "circular" \| "rectangular" \| "card"` | `"rectangular"` | Shape of skeleton |
| `width` | `string \| number` | `undefined` | Width style |
| `height` | `string \| number` | `undefined` | Height style |

#### Example Usage
```tsx
import ESkeleton from "@/components/common/ESkeleton";

<ESkeleton variant="rectangular" className="w-full h-32 rounded-2xl" />
```

---

## Quick Reference Cheat Sheet

| Component | Common Usage | Import Path |
|-----------|--------------|-------------|
| **`SacredPortalLayout`** | Full Page Wrapper & Nav Shell | `@/components/layout/SacredPortalLayout` |
| **`SacredPageHeader`** | Page Title + Action Bar | `@/components/common/SacredPageHeader` |
| **`ECard`** | Themed Content Card | `@/components/common/ECard` |
| **`LotusDivider`** | Golden Lotus Accent Line | `@/components/ui/LotusDivider` |
| **`EInput`** | Form Text Input | `@/components/common/EInput` |
| **`EPasswordInput`** | Password Input with Eye toggle | `@/components/common/EPasswordInput` |
| **`EMobileInput`** | Phone (+91) Input | `@/components/common/EMobileInput` |
| **`EEmailInput`** | Email Input | `@/components/common/EEmailInput` |
| **`ETextarea`** | Multi-line Text Area | `@/components/common/ETextarea` |
| **`ESelect`** | Searchable Select Dropdown | `@/components/common/ESelect` |
| **`EDateTimePicker`** | Date & Time Picker Popover | `@/components/common/EDateTimePicker` |
| **`S3Uploader`** | Upload Dropzone OR View-Only Document Grid | `@/components/common/S3Uploader` |
| **`SacredAvatarUpload`**| Avatar File Uploader | `@/components/common/SacredAvatarUpload` |
| **`EAvatar`** | User Avatar Display with Fallback | `@/components/common/EAvatar` |
| **`EResponsiveDrawer`** | Bottom Sheet (Mobile) / Right Drawer (Desktop) | `@/components/common/EResponsiveDrawer` |
| **`EModal`** | Centered Modal Dialog | `@/components/common/EModal` |
| **`EButton`** | Sacred Emerald / Outline Buttons | `@/components/common/EButton` |
| **`Badge`** | Status Tag | `@/components/ui/badge` |
| **`SacredPillTabs`** | Filter Pill Segmented Tabs | `@/components/common/SacredPillTabs` |
| **`SacredTableContainer`**| Table Card with Empty State | `@/components/common/SacredTableContainer` |
| **`ETable`** | Styled Table Elements | `@/components/common/ETable` |
| **`SacredStatCard`** | Metric Counter Card | `@/components/common/SacredStatCard` |
| **`ESkeleton`** | Shimmer Loading State | `@/components/common/ESkeleton` |
