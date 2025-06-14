# Interactive Data Viewer

Uncountable Frontend Assignment - A Next.js application for visualizing and exploring experimental data.

## 📋 Project Overview

This is an interactive data visualization tool built to explore a dataset of polymer experiments. The application provides multiple views for analyzing experimental inputs and outputs through:

- **Scatterplot Viewer** - X/Y property correlations with interactive selection
- **Histogram Viewer** - Range-based filtering and distribution analysis  
- **Correlation Matrix** - Heatmap visualization of input/output relationships
- **Similarity Search** - Find experiments with similar input compositions
- **Time Trends** - Temporal analysis of experimental outcomes
- **Advanced Filtering** - Query and filter experiments by properties

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.3 with TypeScript
- **UI Library**: Ant Design 5.26.0
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: Redux Toolkit with React Redux
- **Styling**: Tailwind CSS
- **Date Handling**: Day.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
