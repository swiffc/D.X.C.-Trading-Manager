# Trading Screenshot Manager Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern trading platforms like TradingView and productivity tools like Notion, focusing on dark themes optimized for chart analysis and professional trading workflows.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (optimized for chart viewing):
- Background: 210 15% 8% (deep blue-gray)
- Surface: 210 12% 12% (elevated surfaces)
- Primary: 210 100% 60% (bright blue for actions)
- Success: 140 60% 50% (trade profit green)
- Danger: 0 70% 55% (trade loss red)
- Text Primary: 210 10% 95% (high contrast white)
- Text Secondary: 210 8% 70% (muted text)

### B. Typography
- **Primary**: Inter (via Google Fonts CDN)
- **Headers**: 600-700 weight, sizes 24px-32px
- **Body**: 400-500 weight, 14px-16px
- **Captions**: 400 weight, 12px-13px

### C. Layout System
**Tailwind spacing units**: 2, 4, 6, 8, 12, 16
- Consistent padding: p-4, p-6, p-8
- Margins: m-2, m-4, m-8
- Grid gaps: gap-4, gap-6

### D. Component Library

**Navigation**:
- Sidebar navigation with collapsible sections for Trade Types 1-4
- Tab system switching between "Live Trades" and "Case Studies"
- Breadcrumb navigation for deep folder structures

**Cards & Containers**:
- Screenshot preview cards with rounded corners (rounded-lg)
- Elevated surfaces with subtle shadows
- Hover states with gentle scale transforms

**Forms & Inputs**:
- Confluence selector with multi-select checkboxes
- File drop zones with drag-and-drop styling
- Search bars with real-time filtering
- Metadata input forms with clean field grouping

**Data Display**:
- Screenshot galleries with masonry or grid layouts
- Trade timeline views showing multiple timeframes
- Annotation overlays for marking chart levels
- Filterable lists with sorting options

**Overlays**:
- Modal dialogs for trade details and editing
- Fullscreen screenshot viewer with annotation tools
- Dropdown menus for quick actions

### E. Specialized Trading Features

**Screenshot Organization**:
- Visual hierarchy showing H4 → H1 → M15 → M5 timeframe progression
- Color-coded borders for different trade types
- Thumbnail previews with zoom capabilities

**Confluence System**:
- Visual confluence indicators (EMA levels, session timings, patterns)
- Automated note templates based on selected confluences
- Quick-select confluence buttons with visual feedback

**Trade Analysis Tools**:
- Before/after comparison views for case studies
- Performance metrics display with color-coded outcomes
- Pattern recognition highlighting

## Visual Treatment
- **Minimal animations**: Subtle hover effects and smooth transitions only
- **Focus on functionality**: Clean, distraction-free interface prioritizing chart visibility
- **Professional aesthetic**: Dark theme optimized for extended trading sessions
- **Responsive design**: Seamless experience across desktop and tablet devices

## Images
No large hero images required. Focus on:
- Screenshot thumbnails as primary visual content
- Trading chart examples in empty states
- Simple iconography for trade types and confluences
- Minimal decorative elements that don't compete with chart screenshots

This design emphasizes clarity, professional functionality, and optimal viewing conditions for trading chart analysis while maintaining the sophisticated aesthetics expected by serious traders.