# FoodLens Landing Page Component

A production-ready React landing page component for FoodLens - a food detection and nutrition tracking app.

## Features

- ✅ Full-viewport responsive hero section
- ✅ Smooth animations with reduced-motion support
- ✅ Accessible keyboard navigation and ARIA labels
- ✅ Mobile-first responsive design
- ✅ Performance optimized with CSS-only animations
- ✅ Customizable theme via CSS variables
- ✅ TypeScript support

## Quick Start

\`\`\`tsx
import Landing from './components/Landing'

function App() {
  const handleGetHealthy = () => {
    // Open login modal or navigate to dashboard
    console.log('User wants to get healthy!')
  }

  return (
    <Landing 
      onGetHealthy={handleGetHealthy}
      onSeeDemo={() => console.log('Show demo')}
      showDemoPreview={true}
    />
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onGetHealthy` | `() => void` | `undefined` | Callback when "Get Healthy!" CTA is clicked |
| `onSeeDemo` | `() => void` | `undefined` | Callback when "See Demo" CTA is clicked |
| `showDemoPreview` | `boolean` | `false` | Show inline demo section below hero |

## Integration Guide

### 1. Wire up the "Get Healthy!" CTA

\`\`\`tsx
const handleGetHealthy = () => {
  // Option 1: Open login modal
  setShowLoginModal(true)
  
  // Option 2: Navigate to dashboard
  router.push('/dashboard')
  
  // Option 3: Navigate to signup
  router.push('/signup')
}

<Landing onGetHealthy={handleGetHealthy} />
\`\`\`

### 2. Customize the theme

Edit the CSS variables in `Landing.css`:

\`\`\`css
:root {
  --color-bg: #f7fcfb;        /* Background color */
  --color-accent: #0fb39a;    /* Primary brand color */
  --color-accent-dark: #086f58; /* Darker accent for hover */
  --color-warm: #ff8a4b;      /* Warm accent color */
  --color-muted: #6b7280;     /* Muted text color */
}
\`\`\`

### 3. Replace placeholder assets

Replace the SVG assets in `/assets/landing/` with your own:

- `food-icon.svg` - Food/nutrition related icon
- `leaf-icon.svg` - Wellness/health related icon
- Add your own Lottie animations or illustrations

For the phone mockup dashboard, update the `.dashboard-preview` section in the CSS to match your actual app design.

### 4. Add real images

Replace placeholder elements with real assets:

\`\`\`tsx
// Replace the SVG plate illustration with a real food photo
<img 
  src="/images/healthy-plate.jpg" 
  alt="Colorful healthy meal on a plate"
  className="plate-image"
/>

// Add Lottie animation (lazy loaded)
import { Player } from '@lottiefiles/react-lottie-player'

<Player
  autoplay
  loop
  src="/animations/food-scan.json"
  style={{ height: '300px', width: '300px' }}
/>
\`\`\`

## Accessibility Features

- ✅ Keyboard navigation support
- ✅ Focus indicators on all interactive elements
- ✅ ARIA labels and roles
- ✅ Screen reader announcements
- ✅ High contrast mode support
- ✅ Reduced motion preferences respected
- ✅ Color contrast meets WCAG AA standards

## Performance Optimizations

- CSS-only animations (no heavy JS libraries)
- Optimized SVG assets
- Lazy loading for non-critical assets
- Mobile-first responsive design
- Minimal JavaScript footprint

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure

\`\`\`
components/
├── Landing.tsx          # Main component
├── Landing.css          # Styles and animations
assets/landing/
├── food-icon.svg        # Food detection icon
├── leaf-icon.svg        # Wellness icon
demo/
├── index.tsx           # Demo component
├── index.html          # Demo HTML
README.md               # This file
\`\`\`

## Customization Examples

### Change the headline and copy

\`\`\`tsx
// Edit the JSX in Landing.tsx
<h1 className="hero-headline">
  Your App Name
</h1>
<p className="hero-subheadline">
  Your custom value proposition here.
</p>
\`\`\`

### Add more floating elements

\`\`\`css
.floating-element-4 {
  top: 40%;
  right: 25%;
  animation: float4 14s;
}

@keyframes float4 {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-30px) rotate(-5deg); }
}
\`\`\`

### Customize button styles

\`\`\`css
.cta-primary {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
  /* Add your custom button styles */
}
\`\`\`

## Recommended Assets Sources

- **Photos**: [Unsplash](https://unsplash.com/s/photos/healthy-food)
- **Illustrations**: [unDraw](https://undraw.co/)
- **Animations**: [LottieFiles](https://lottiefiles.com/)
- **Icons**: [Heroicons](https://heroicons.com/) or [Lucide](https://lucide.dev/)

## Support

For issues or questions about this component, please check:

1. Ensure all required props are passed
2. Verify CSS variables are properly defined
3. Check browser console for any errors
4. Test with reduced motion preferences

## License

This component is provided as-is for the FoodLens project. Customize as needed for your use case.
