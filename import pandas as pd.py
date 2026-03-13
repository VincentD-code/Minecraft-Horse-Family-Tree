import pandas as pd
import numpy as np
import plotly.graph_objects as go
from bigtree import Node
from datetime import datetime
import os

# =====================================================
# 1. DATA LOADING & BIGTREE ENGINE
# =====================================================
csv_filename = "horse_data.csv"
if not os.path.exists(csv_filename):
    print(f"CRITICAL ERROR: '{csv_filename}' not found.")
    exit()

# Load and immediately clean strings to prevent KeyError Typos
df = pd.read_csv(csv_filename).fillna("")
for col in df.select_dtypes(include=['object']).columns:
    df[col] = df[col].astype(str).str.strip()

df = df.replace("Void Born", "Celestial Grass")
horse_db = df.set_index("Name").to_dict('index')

# --- Bigtree Hierarchy Logic ---
node_registry = {}

def build_hierarchy(name):
    if not name or name not in horse_db or name in node_registry:
        return node_registry.get(name)
    
    row = horse_db[name]
    node = Node(name)
    node_registry[name] = node
    
    # Primary lineage path
    p1_name = row.get("Parent1", "")
    if p1_name in horse_db:
        parent_node = build_hierarchy(p1_name)
        if parent_node:
            node.parent = parent_node
    return node

for name in horse_db:
    build_hierarchy(name)

# =====================================================
# 2. GENETICS & COLOR ENGINE
# =====================================================
origin_colors = {
    "Star Strider": "#FFD700", "Celestial Grass": "#008080", 
    "Thunder Blood": "#FF3333", "Frostmane": "#00F5FF", 
    "Emberhoof": "#FF4500", "Slothsoul": "#708090", "Unknown": "#444444"
}

data_registry = {}

def mix_rgb_colors(dna_weights):
    if not dna_weights: return "#444444"
    r, g, b = 0, 0, 0
    for bloodline, percentage in dna_weights.items():
        hex_c = origin_colors.get(bloodline, "#444444").lstrip('#')
        rgb = tuple(int(hex_c[i:i+2], 16) for i in (0, 2, 4))
        r += (rgb[0] / 255) * percentage
        g += (rgb[1] / 255) * percentage
        b += (rgb[2] / 255) * percentage
    return f'rgb({int(r*255)},{int(g*255)},{int(b*255)})'

def get_ancestors(name):
    if name == "" or name not in horse_db: return {}
    row = horse_db[name]
    p1, p2 = row.get("Parent1", ""), row.get("Parent2", "")
    if p1 == "" or p2 == "": return {name: 1.0}
    anc1, anc2 = get_ancestors(p1), get_ancestors(p2)
    combined = {name: 1.0}
    for k, v in anc1.items(): combined[k] = combined.get(k, 0) + v * 0.5
    for k, v in anc2.items(): combined[k] = combined.get(k, 0) + v * 0.5
    return combined

def process_horse(name):
    if name in data_registry: return data_registry[name]
    row = horse_db[name]
    p1, p2 = row.get("Parent1", ""), row.get("Parent2", "")
    
    if p1 == "" or p2 == "":
        blood = row.get("OriginBlood", "Unknown")
        dna, color, f_score = {blood: 1.0}, origin_colors.get(blood, "#444444"), 0.0
    else:
        res1, res2 = process_horse(p1), process_horse(p2)
        all_keys = set(res1["dna"].keys()) | set(res2["dna"].keys())
        dna = {k: (res1["dna"].get(k, 0) + res2["dna"].get(k, 0)) / 2 for k in all_keys}
        color = mix_rgb_colors(dna)
        anc1, anc2 = get_ancestors(p1), get_ancestors(p2)
        common = set(anc1.keys()) & set(anc2.keys())
        f_score = sum(anc1[anc] * anc2[anc] * 0.5 for anc in common)
    
    data_registry[name] = {"dna": dna, "color": color, "f": f_score}
    return data_registry[name]

for name in horse_db: 
    process_horse(name)

# =====================================================
# 3. POSITIONING & RANKING
# =====================================================
pos = {}
gen_counts = {}
for name, node in node_registry.items():
    depth = node.depth
    gen_counts[depth] = gen_counts.get(depth, 0) + 1
    # Adjust spacing for better readability
    pos[name] = (gen_counts[depth] * 22.0 - 100, -depth * 18.0)

alive_horses = [n for n, d in horse_db.items() if d.get("Status") == "Alive"]
top_16 = sorted(alive_horses, key=lambda x: float(horse_db[x].get("Speed", 0) or 0), reverse=True)[:16]
god_horse = top_16[0] if top_16 else None

# =====================================================
# 4. PLOTLY MULTI-VIEW BUILDER
# =====================================================
fig = go.Figure()
tree_idx, dash_idx, table_idx = [], [], []

# --- VIEW A: THE TREE ---
for name, row in horse_db.items():
    p1_n, p2_n = row["Parent1"], row["Parent2"]
    if p1_n in pos and p2_n in pos:
        p1, p2, child = pos[p1_n], pos[p2_n], pos[name]
        
        # Connection Line
        fig.add_trace(go.Scatter(x=[p1[0], p2[0]], y=[p1[1], p2[1]], mode='lines', 
                                 line=dict(color="rgba(255,255,255,0.1)", width=1), hoverinfo='skip', showlegend=False))
        tree_idx.append(len(fig.data)-1)

        # Signature Hybrid Curves
        mid_x, mid_y = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        t = np.linspace(0, 1, 20)
        curve_x = (1-t)**3 * mid_x + 3*(1-t)**2*t * mid_x + 3*(1-t)*t**2 * child[0] + t**3 * child[0]
        curve_y = (1-t)**3 * mid_y + 3*(1-t)**2*t * (mid_y - 6) + 3*(1-t)*t**2 * (child[1] + 6) + t**3 * child[1]
        fig.add_trace(go.Scatter(x=curve_x, y=curve_y, mode='lines', 
                                 line=dict(color=data_registry[name]["color"], width=2.5), opacity=0.5, hoverinfo='skip', showlegend=False))
        tree_idx.append(len(fig.data)-1)

for name, (x, y) in pos.items():
    h_data = data_registry[name]
    is_dead = horse_db[name].get("Status") == "Dead"
    sorted_dna = sorted(h_data["dna"].items(), key=lambda x: x[1], reverse=True)
    
    fig.add_trace(go.Scatter(
        x=[x], y=[y], mode='markers+text',
        text=[f"★ {name.upper()}" if name == god_horse else name.upper()],
        textposition="bottom center", textfont=dict(size=8, color="rgba(255,255,255,0.8)"),
        marker=dict(size=25 if name == god_horse else 14, color='black' if is_dead else h_data["color"],
                    line=dict(width=2, color=h_data["color"]), symbol="star" if name == god_horse else "circle"),
        hovertext=f"<b>{name.upper()}</b><br>Speed: {horse_db[name]['Speed']}<br>DNA: {int(sorted_dna[0][1]*100)}% {sorted_dna[0][0]}<br>F: {h_data['f']*100:.1f}%",
        showlegend=False
    ))
    tree_idx.append(len(fig.data)-1)

for blood, color in origin_colors.items():
    fig.add_trace(go.Scatter(x=[None], y=[None], mode='markers', marker=dict(color=color, size=10), name=blood, visible=True))
    tree_idx.append(len(fig.data)-1)

# --- VIEW B: DASHBOARD ---
avg_f = np.mean([d['f'] for d in data_registry.values()])
god_f = data_registry[god_horse]['f'] if god_horse else 0
fig.add_trace(go.Bar(y=["Avg", f"Fastest"], x=[avg_f, god_f], orientation='h',
                     marker=dict(color=['#888', '#FFD700']), visible=False, xaxis='x2', yaxis='y2', name="F-Score"))
dash_idx.append(len(fig.data)-1)

gens = sorted(gen_counts.keys())
gen_avgs = [np.mean([float(horse_db[n]['Speed']) for n in node_registry if node_registry[n].depth == g]) for g in gens]
fig.add_trace(go.Scatter(x=gens, y=gen_avgs, mode='lines+markers', line=dict(color='cyan', width=3), 
                         visible=False, xaxis='x3', yaxis='y3', name="Trend"))
dash_idx.append(len(fig.data)-1)

# --- VIEW C: LEADERBOARD ---
table_rows = []
for i, name in enumerate(top_16, 1):
    dna_list = sorted(data_registry[name]["dna"].items(), key=lambda x: x[1], reverse=True)
    comp = " | ".join([f"{int(v*100)}% {k}" for k, v in dna_list[:3]])
    table_rows.append([i, name, horse_db[name]['Speed'], f"{data_registry[name]['f']*100:.2f}%", comp])

fig.add_trace(go.Table(
    header=dict(values=['RANK', 'NAME', 'SPD', 'F-SCORE', 'TOP DNA'], fill_color='#222', font=dict(color='white', size=12)),
    cells=dict(values=list(zip(*table_rows)), fill_color='#050505', font=dict(color='white', size=11), height=30),
    visible=False
))
table_idx.append(len(fig.data)-1)

# =====================================================
# 6. FINAL LAYOUT & LOGIC ISOLATION
# =====================================================
total = len(fig.data)
def get_vis(indices): return [True if i in indices else False for i in range(total)]

fig.update_layout(
    updatemenus=[dict(
        type="dropdown", direction="down", x=0.01, y=0.99, showactive=True,
        buttons=[
            dict(label=" Dynasty Tree View ", method="update", 
                 args=[{"visible": get_vis(tree_idx)}, 
                       {"xaxis.visible": False, "yaxis.visible": False, "xaxis2.visible": False, "yaxis2.visible": False, 
                        "xaxis3.visible": False, "yaxis3.visible": False, "showlegend": True}]),
            dict(label=" Stats Dashboard ", method="update", 
                 args=[{"visible": get_vis(dash_idx)}, 
                       {"xaxis2.visible": True, "yaxis2.visible": True, "xaxis3.visible": True, "yaxis3.visible": True, 
                        "xaxis.visible": False, "yaxis.visible": False, "showlegend": False}]),
            dict(label=" Top 16 Leaderboard ", method="update", 
                 args=[{"visible": get_vis(table_idx)}, 
                       {"xaxis.visible": False, "yaxis.visible": False, "xaxis2.visible": False, "yaxis2.visible": False, 
                        "xaxis3.visible": False, "yaxis3.visible": False, "showlegend": False}])
        ],
        bgcolor="#111", font=dict(color="white")
    )],
    template="plotly_dark", paper_bgcolor='#050505', plot_bgcolor='#050505',
    xaxis2=dict(domain=[0.05, 0.45], anchor='y2', visible=False, title="Inbreeding (F)"),
    yaxis2=dict(domain=[0.6, 0.9], anchor='x2', visible=False),
    xaxis3=dict(domain=[0.55, 0.95], anchor='y3', visible=False, title="Generation Depth"),
    yaxis3=dict(domain=[0.6, 0.9], anchor='x3', visible=False, title="Avg Speed"),
    margin=dict(t=80, b=50, l=50, r=50)
)

fig.write_html("index.html", config={'scrollZoom': True})
print("Build Successful: Open 'index.html' to interact with your data.")