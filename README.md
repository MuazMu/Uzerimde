# Virtual Try-On MVP

A web-based virtual try-on application that allows users to see how clothing items would look on them in both 2D and 3D.

## Features

- **Photo Upload**: Upload a selfie or photo to use for virtual try-on
- **2D Image Overlay**: See clothing items overlaid on your photo
- **3D Avatar Generation**: Create a 3D avatar from a single photo
- **Clothing Selection**: Choose from various clothing items to try on
- **360° View**: View your 3D avatar from all angles
- **Basic Animations**: See your avatar in idle, walking, and turning modes

## Technology Stack

- **Frontend**: Next.js with React, TypeScript, and TailwindCSS
- **3D Rendering**: Three.js with React Three Fiber
- **Image Processing**: Simulated with placeholder API endpoints
- **Avatar Generation**: Placeholder implementation (would use ReadyPlayerMe or similar in production)

## Getting Started

### Prerequisites

- Node.js 14+ installed
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/virtual-tryon-mvp.git
cd virtual-tryon-mvp
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
virtual-tryon-mvp/
├── public/              # Static assets
│   ├── images/          # Sample clothing images
│   └── models/          # 3D models and avatars
├── src/
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   │   ├── api/         # API endpoints
│   │   ├── try-on-2d.tsx    # 2D try-on experience
│   │   └── try-on-3d.tsx    # 3D try-on experience
│   ├── services/        # API client and services
│   └── styles/          # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## Development Notes

- For MVP purposes, the application uses placeholder images and models
- In a production implementation, you would integrate with:
  - A 3D avatar generation API (e.g., ReadyPlayerMe)
  - Body measurement and pose estimation libraries
  - Real-time clothing physics simulation
  - A database of 3D clothing models

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Sample clothing images are placeholders and should be replaced with actual product images
- The 3D avatar model used is a placeholder for demonstration purposes 