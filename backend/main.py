# main.py — VectorShift pipeline backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from collections import defaultdict, deque

app = FastAPI(title="VectorShift Pipeline API")

# Allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request model ────────────────────────────────────────
class Pipeline(BaseModel):
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]


# ── DAG check via Kahn's algorithm ──────────────────────
def check_is_dag(nodes: list[dict], edges: list[dict]) -> bool:
    """
    Returns True iff the directed graph formed by `edges` is acyclic.
    Uses Kahn's topological sort algorithm (BFS with in-degree tracking).
    """
    node_ids = {n["id"] for n in nodes}

    # Build adjacency list and in-degree map
    adj: dict[str, list[str]] = defaultdict(list)
    in_degree: dict[str, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # Start with every node that has no incoming edges
    queue = deque(nid for nid, deg in in_degree.items() if deg == 0)
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1
        for neighbour in adj[current]:
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)

    # If we processed every node the graph has no cycle → it's a DAG
    return visited_count == len(node_ids)


# ── Endpoints ────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    """
    Accepts a pipeline (nodes + edges) and returns:
      - num_nodes : total node count
      - num_edges : total edge count
      - is_dag    : whether the graph forms a directed acyclic graph
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag    = check_is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag":    is_dag,
    }
