# 🏢 Room Reservation System

A modern room reservation system built with Next.js 15, designed and developed as part of a **Hello World Hippo Camp**. This project demonstrates the implementation of a complete room booking system with a clean, responsive interface.

## 🎯 Project Overview

This room reservation system allows users to:
- Browse available rooms across multiple buildings (CB2, LX, SIT)
- View room availability in real-time
- Make room reservations with date/time selection
- Report room issues and problems
- Manage bookings with an intuitive interface

## 📁 Project Structure

```
project-hello/
├── public/
│   ├── background/          # Building background images
│   ├── icons/              # SVG icons for UI
│   └── logo/               # Application logos
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Home page - building selection
│   │   ├── room/           # Room booking page
│   │   └── report/         # Issue reporting page
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Radix UI components
│   │   ├── announce.tsx    # Announcement component
│   │   ├── footer.tsx      # Footer component
│   │   ├── header.tsx      # Header component
│   │   ├── nav.tsx         # Navigation component
│   │   ├── renderBuilding.tsx # Building display
│   │   ├── renderTable.tsx # Room table display
│   │   ├── reportForm.tsx  # Issue reporting form
│   │   └── reserveForm.tsx # Reservation form
│   ├── context/            # React Context providers
│   │   ├── dateContext.tsx # Date management
│   │   └── roomContext.tsx # Room data management
│   ├── hooks/              # Custom React hooks
│   │   └── use-toast.ts    # Toast notification hook
│   └── lib/                # Utility functions
│       └── utils.ts        # Helper functions
├── components.json         # UI component configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── next.config.ts          # Next.js configuration
```

## 🚀 Features

<details>
<summary><strong>🏗️ Building Selection</strong></summary>

- **CB2 Building**: Modern classrooms and meeting rooms
- **LX Building**: Lecture halls and seminar rooms  
- **SIT Building**: Technical labs and workshop spaces

</details>

<details>
<summary><strong>📅 Reservation Management</strong></summary>

- Interactive calendar for date selection
- Real-time availability checking
- Time slot booking system
- Reservation confirmation

</details>

<details>
<summary><strong>🔧 Issue Reporting</strong></summary>

- Report room problems and maintenance issues
- Track issue status and resolution
- User-friendly reporting interface

</details>

<details>
<summary><strong>🎨 Modern UI/UX</strong></summary>

- Responsive design for all devices
- Clean, professional interface
- Smooth animations and transitions
- Accessibility-focused design

</details>

## 🛠️ Tech Stack

<details>
<summary><strong>Frontend Framework</strong></summary>

- **Next.js 15** - React framework with App Router
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development

</details>

<details>
<summary><strong>UI Components & Styling</strong></summary>

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Beautiful icons
- **Tailwind Animate** - Smooth animations

</details>

<details>
<summary><strong>Form Management</strong></summary>

- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

</details>

<details>
<summary><strong>State Management</strong></summary>

- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic

</details>

## 🏁 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.