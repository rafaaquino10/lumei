# Mobile Testing Checklist

## Devices to Test

Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)

## Per Calculator Testing

For each calculator (Margem de Lucro, Preço por Hora, Precificação, Faturamento, Fluxo de Caixa, DAS):

### Form Inputs
- [ ] Form inputs are easy to tap (44x44px minimum)
- [ ] Keyboard appears correctly (numeric for money/number inputs)
- [ ] Keyboard doesn't cover active input
- [ ] Can easily switch between inputs
- [ ] MoneyInput shows decimal keyboard
- [ ] NumberInput shows numeric keyboard

### Results Display
- [ ] Results are readable without zooming
- [ ] Text size is comfortable (minimum 16px)
- [ ] Charts render correctly and are interactive
- [ ] No content overflow
- [ ] Cards stack properly on mobile

### Navigation
- [ ] Hamburger menu opens/closes smoothly
- [ ] All menu items are tappable
- [ ] Navigation transitions are smooth
- [ ] Back button works correctly
- [ ] No horizontal scroll anywhere

### Interactive Elements
- [ ] All buttons are at least 44px tall
- [ ] Touch targets don't overlap
- [ ] Forms submit correctly
- [ ] Save functionality works
- [ ] Share functionality works (if applicable)
- [ ] Modals/dialogs work on mobile
- [ ] Toasts appear correctly and are dismissible

## General Mobile UX

### Performance
- [ ] Page loads quickly (<3s)
- [ ] No layout shift (CLS)
- [ ] Smooth scrolling
- [ ] Charts load without blocking

### Visual
- [ ] Logo is visible and sized correctly
- [ ] Brand colors display correctly
- [ ] Images load and are optimized
- [ ] Icons are clear and recognizable

### Authentication
- [ ] Sign-in page works on mobile
- [ ] Sign-up page works on mobile
- [ ] Clerk forms are mobile-friendly
- [ ] UserButton is accessible
- [ ] Can sign out from mobile menu

### Dashboard
- [ ] Stats cards stack properly
- [ ] Quick access calculators are tappable
- [ ] Recent calculations list is readable
- [ ] Dashboard navigation works

## Browser-Specific Tests

### iOS Safari
- [ ] Tap to focus works
- [ ] Pinch to zoom disabled on inputs
- [ ] Safari UI doesn't overlap content
- [ ] Bottom toolbar considered in layout

### Android Chrome
- [ ] Material design interactions work
- [ ] Chrome UI doesn't overlap
- [ ] Pull-to-refresh works correctly

### Tablet (iPad/Android)
- [ ] Layout adapts to larger screen
- [ ] Two-column layout used where appropriate
- [ ] Touch targets are still comfortable

## Edge Cases

- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] Works with text zoomed to 200%
- [ ] Works offline (shows appropriate message)
- [ ] Works with slow 3G connection

## Accessibility

- [ ] Can navigate with swipe gestures
- [ ] Screen reader announces elements correctly
- [ ] Focus indicators are visible
- [ ] Color contrast is sufficient
- [ ] Form labels are associated correctly

## Notes

- Use Chrome DevTools Device Mode for initial testing
- Test on real devices for final validation
- Check analytics for actual device usage
- Priority: iPhone + Android Chrome (covers 95%+ users)
