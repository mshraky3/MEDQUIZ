# MEDQIZE Landing Page

## Overview
The MEDQIZE landing page is a modern, SEO-friendly introduction to the SMLE (Saudi Medical Licensing Examination) question bank application.

## Features

### 🎯 SEO Optimized
- Comprehensive meta tags for search engines
- Open Graph and Twitter Card support
- Sitemap.xml and robots.txt included
- Semantic HTML structure
- Mobile-responsive design

### 🎨 Design
- Matches existing app styling and color scheme
- Uses the same font family and design patterns
- Responsive design for all devices
- Smooth animations and hover effects

### 📱 User Experience
- Clear value proposition highlighting 5,000+ questions in 3 monthly collections
- Monthly Collections Feature: October, November, and December 2025 question sets
- Feature cards showcasing key benefits
- Statistics section for credibility
- Two call-to-action buttons:
  - "Get Started Now" - Shows beta version popup
  - "Login" - Direct navigation to login page

### 🎯 Monthly Collections (تجميعات)
- **October 2025 Collection** - Comprehensive question set
- **November 2025 Collection** - 395 focused medical questions
- **December 2025 Collection** - 1,540+ comprehensive questions
- All organized by specialty: Pediatric, Medicine, Surgery, Obstetrics & Gynecology

### 🚀 Beta Version Integration
- Popup notification about beta status
- WhatsApp integration for account creation
- Clear messaging about account creation process
- Direct link to WhatsApp chat: https://wa.link/pzhg6j

## File Structure

```
src/components/landing/
├── Landing.jsx          # Main landing page component
└── Landing.css          # Styling for landing page

public/
├── sitemap.xml          # SEO sitemap
└── robots.txt           # Search engine directives

index.html               # Updated with SEO meta tags
```

## Key Components

### Landing Page Sections
1. **Header** - Main title, subtitle, and description
2. **Collections Highlight** - Monthly question collections (October, November, December 2025)
   - October 2025: Comprehensive collection
   - November 2025: 395 focused questions
   - December 2025: 1,540+ questions
3. **Features** - 4 feature cards highlighting key benefits + monthly collections
4. **Statistics** - Key numbers (5,000+ questions across 3 collections, 100% SMLE focused, 4 specialties, 24/7 available)
5. **Call-to-Action** - Buttons for getting started and login
6. **Footer** - Animated gradient footer matching existing design

### Beta Popup
- Appears when "Get Started Now" is clicked
- Explains beta version status
- Provides WhatsApp contact option
- Includes close functionality

## Styling
- Uses existing color scheme (#0296c9, #00b6e0)
- Matches font family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
- Responsive breakpoints for mobile, tablet, and desktop
- Smooth transitions and hover effects
- Gradient backgrounds and shadows

## SEO Features
- Title: "MEDQIZE - Ultimate SMLE Question Bank | 5,000+ Medical Questions + Monthly Collections"
- Meta description highlighting monthly collections (November, December, October 2025)
- Keywords targeting: SMLE, Prometric, تجميعات (Collections), medical exam preparation
- Open Graph tags for social media sharing with collection highlights
- Twitter Card support with collection announcements
- Structured data for better search visibility
- Collection-based keywords for improved SEO ranking

## Navigation
- Landing page is the default route (/)
- Login page accessible at /login
- All existing routes preserved
- No API calls required for landing page

## Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Optimized for landscape and portrait orientations
- Touch-friendly button sizes

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach 