# 3D Brain Connectivity Viewer

An interactive, full-stack web application for visualizing functional brain connectivity in 3D space. This tool parses coordinate and connectivity matrix data on the backend and renders an interactive 3D network graph on the frontend, enabling researchers to explore and filter brain connections based on connection strength.

![Interactive Brain Viewer](Screenshot 2025-12-29 at 11.41.49 AM.png)


## Features

- **3D Visualization** — Renders brain regions as nodes accurately placed in 3D MNI coordinate space
- **Interactive Filtering** — Real-time UI slider to threshold connections based on weight
- **Dynamic Hover Effects** — Highlights nodes and their associated edges for improved visual clarity
- **Decoupled Architecture** — Python-based analysis backend with a React + Three.js frontend

## Tech Stack

### Backend
- **Language:** Python 3.13
- **Framework:** FastAPI (high-performance REST API)
- **Data Processing:** Pandas, NumPy
- **Server:** Uvicorn (ASGI server)

### Frontend
- **Framework:** React (via Vite)
- **3D Engine:** React Three Fiber (Three.js wrapper for React)
- **Helpers:** @react-three/drei (camera controls, helpers, HTML overlays)
- **Language:** JavaScript / JSX

## Project Structure

```
brain-connectivity-viewer/
├── backend/
│   ├── main.py
│   ├── regions.csv
│   ├── connectivity.csv
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── image_7.png
└── README.md
```

## Prerequisites

- Node.js (v20+ recommended)
- Python (v3.13 recommended)
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd brain-connectivity-viewer
```

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # macOS / Linux
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server (runs on port 5002)
uvicorn main:app --reload --port 5002
```

The backend API will be available at `http://localhost:5002`

### 3. Frontend Setup

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Vite will output a local URL (typically `http://localhost:5173`). Open this URL in your browser to view the 3D brain connectivity visualization.

## Data Structure

The backend expects two CSV files located in the `backend/` directory:

### regions.csv

Defines the 3D coordinates of brain regions.

**Columns:**
- `region_name` — Name of the brain region
- `x` — X coordinate in MNI space
- `y` — Y coordinate in MNI space
- `z` — Z coordinate in MNI space

Each row corresponds to a node in the 3D graph.

### connectivity.csv

Defines the connectivity strength between regions.

**Format:**
- Square adjacency matrix
- Dimensions must match the number of rows in `regions.csv`
- Cell values represent connection weights between regions

## Usage

1. Start both the backend and frontend servers as described above
2. Open your browser to the frontend URL
3. Use the slider to adjust the connection strength threshold
4. Hover over nodes to highlight them and their connections
5. Click and drag to rotate the 3D view
6. Scroll to zoom in/out

## Future Enhancements

This project is designed with extensibility in mind for future neuroimaging workflows:
- Support for multiple connectivity matrices
- Time-series animation of brain connectivity
- Integration with additional neuroimaging data formats
