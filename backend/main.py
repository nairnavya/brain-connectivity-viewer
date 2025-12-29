import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
import numpy as np

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Brain Connectivity API is running!"}

@app.get("/api/graph")
def get_graph_data():
    # 1. Load coordinates
    nodes_df = pd.read_csv("regions.csv")
    nodes = nodes_df.to_dict(orient="records")
    
    # Give each node an 'id' based on its row in regions.csv
    for i, node in enumerate(nodes):
        node["id"] = i

    # 2. Load connectivity matrix
    # Use index_col=0 to skip the first column if it contains region labels
    edges_df = pd.read_csv("connectivity.csv", index_col=0)
    matrix = edges_df.values
    
    # Determine the size based on the matrix itself, not the nodes list
    num_rows, num_cols = matrix.shape
    
    edges = []
    # Loop through the actual dimensions of the matrix
    for i in range(num_rows):
        for j in range(num_cols):
            # Only process if we are within the bounds of our nodes list
            if i < len(nodes) and j < len(nodes):
                try:
                    weight = float(matrix[i][j])
                    # Draw edge if it's the upper triangle and weight exists
                    if i < j and weight > 0: 
                        edges.append({
                            "source": i, 
                            "target": j, 
                            "weight": weight
                        })
                except (ValueError, TypeError):
                    continue 

    return {"nodes": nodes, "edges": edges}