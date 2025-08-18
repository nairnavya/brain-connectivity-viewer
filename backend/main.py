import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

# Adding CORS Middleware to allow React frontend (on a different port)
# to communicate with this backend.

origins = [
    "http://localhost:3000", # default port for React apps
    "http://localhost:5173", # default port for Vite React apps
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
    # Loading data using pandas
    nodes_df = pd.read_csv("regions.csv")
    edges_df = pd.read_csv("connectivity.csv")

    # Converting dataframes to JSON format
    nodes = nodes_df.to_dict(orient="records")
    edges = edges_df.to_dict(orient="records")

    return {"nodes": nodes, "edges": edges}