import pandas as pd
import numpy as np
import plotly.graph_objects as go
from datetime import datetime
import os

# =====================================================
# 1. DATA LOADING & LOGIC ENGINE
# =====================================================
csv_filename = "horse_data.csv"
if not os.path.exists(csv_filename):
    print(f"CRITICAL ERROR: '{csv_filename}' not found.")
    exit()

df = pd.read_csv(csv_filename).fillna("")
for col in df.select_dtypes(include=['object']).columns:
    df[col] = df[col].astype(str).str.strip()

df = df.replace("Void Born", "Celestial Grass")
horse_db = df.set_index("Name").to_dict('index')

origin_colors = {
    "Star Strider": "#FFD700", 
    "Celestial Grass": "#008080", 
    "Thunder Blood": "#FF3333",
    "Frostmane": "#00F5FF", 
    "Emberhoof": "#FF4500", 
    "Slothsoul": "#708090",      
    "Unknown": "#444444"
}

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

data_registry = {}

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

def calculate_inbreeding(p1, p2):
    if not p1 or not p2 or p1 not in horse_db or p2 not in horse_db: return 0.0
    anc1, anc2 = get_ancestors(p1), get_ancestors(p2)
    common = set(anc1.keys()) & set(anc2.keys())
    return sum(anc1[anc] * anc2[anc] * 0.5 for anc in common)

def process_horse(name, depth=0):
    if depth > 25 or name == "" or name not in horse_db: 
        return {"dna": {"Unknown": 1.0}, "color": "#444444", "level": 0, "f": 0}
    if name in data_registry: return data_registry[name]
    row = horse_db[name]
    p1, p2 = row.get("Parent1", ""), row.get("Parent2", "")
    if p1 == "" or p2 == "":
        blood = row.get("OriginBlood", "Unknown")
        dna, color, level, f_score = {blood: 1.0}, origin_colors.get(blood, "#444444"), 0, 0.0
    else:
        res1, res2 = process_horse(p1, depth + 1), process_horse(p2, depth + 1)
        all_keys = set(res1["dna"].keys()) | set(res2["dna"].keys())
        dna = {k: (res1["dna"].get(k, 0) + res2["dna"].get(k, 0)) / 2 for k in all_keys}
        color = mix_rgb_colors(dna)
        level = max(res1["level"], res2["level"]) + 1
        f_score = calculate_inbreeding(p1, p2)
    data_registry[name] = {"dna": dna, "color": color, "level": level, "f": f_score}
    return data_registry[name]

for name in horse_db: process_horse(name)

# =====================================================
# 2. POSITIONING & STATS PREP
# =====================================================
generation_groups = {}
for name, data in data_registry.items():
    generation_groups.setdefault(data["level"], []).append(name)

pos = {}
for level, names in generation_groups.items():
    names.sort(key=lambda x: float(horse_db[x].get("Speed", 0) or 0), reverse=True)
    width = len(names) * 15.0
    for idx, name in enumerate(names):
        pos[name] = ((idx * 15.0) - (width / 2), -level * 12.0) 

alive_horses = [n for n, d in horse_db.items() if d.get("Status") == "Alive"]
top_16 = sorted(alive_horses, key=lambda x: float(horse_db[x].get("Speed", 0) or 0), reverse=True)[:16]
god_horse = top_16[0] if top_16 else None

# =====================================================
# 3. PLOTLY MULTI-MODE BUILDER
# =====================================================
fig = go.Figure()

tree_indices = []
dash_indices = []
table_indices = []

# --- A. TREE VIEW TRACES ---
for name, row in horse_db.items():
    p1_n, p2_n = row["Parent1"], row["Parent2"]
    if p1_n in pos and p2_n in pos:
        p1, p2, child = pos[p1_n], pos[p2_n], pos[name]
        
        # Horizontal Parent Line
        fig.add_trace(go.Scatter(x=[p1[0], p2[0]], y=[p1[1], p2[1]], mode='lines', 
                                 line=dict(color="rgba(200,200,200,0.2)", width=1), hoverinfo='skip', showlegend=False))
        tree_indices.append(len(fig.data)-1)

        # Hybrid Curved Connection
        mid_x, mid_y = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        t = np.linspace(0, 1, 15)
        curve_x = (1-t)**3 * mid_x + 3*(1-t)**2*t * mid_x + 3*(1-t)*t**2 * child[0] + t**3 * child[0]
        curve_y = (1-t)**3 * mid_y + 3*(1-t)**2*t * (mid_y - 4) + 3*(1-t)*t**2 * (child[1] + 4) + t**3 * child[1]
        fig.add_trace(go.Scatter(x=curve_x, y=curve_y, mode='lines', 
                                 line=dict(color=data_registry[name]["color"], width=2), opacity=0.5, hoverinfo='skip', showlegend=False))
        tree_indices.append(len(fig.data)-1)

# Nodes & Legend
for name, (x, y) in pos.items():
    h_data = data_registry[name]
    is_dead = horse_db[name].get("Status") == "Dead"
    fig.add_trace(go.Scatter(
        x=[x], y=[y], mode='markers+text',
        text=[name.upper() if name != god_horse else f"★ {name.upper()}"],
        textposition="bottom center", textfont=dict(size=7, color="rgba(255,255,255,0.7)"),
        marker=dict(size=22 if name == god_horse else 12, color='black' if is_dead else h_data["color"],
                    line=dict(width=2, color=h_data["color"]), symbol="star" if name == god_horse else "circle"),
        hovertext=f"<b>{name.upper()}</b><br>Speed: {horse_db[name]['Speed']}<br>F: {h_data['f']*100:.1f}%", showlegend=False
    ))
    tree_indices.append(len(fig.data)-1)

for blood, color in origin_colors.items():
    fig.add_trace(go.Scatter(x=[None], y=[None], mode='markers', marker=dict(color=color, size=10), name=blood))
    tree_indices.append(len(fig.data)-1)

# --- B. DASHBOARD TRACES ---
avg_f = np.mean([d['f'] for d in data_registry.values()])
god_f = data_registry[god_horse]['f'] if god_horse else 0
fig.add_trace(go.Bar(y=["Global Avg", f"Fastest ({god_horse})"], x=[avg_f, god_f], orientation='h',
                     marker=dict(color=['#888', '#FFD700']), visible=False, xaxis='x2', yaxis='y2', name="Inbreeding"))
dash_indices.append(len(fig.data)-1)

gens = sorted(generation_groups.keys())
avgs = [np.mean([float(horse_db[n]['Speed'] or 0) for n in generation_groups[g]]) for g in gens]
fig.add_trace(go.Scatter(x=gens, y=avgs, mode='lines+markers', line=dict(color='gold', width=4), 
                         visible=False, xaxis='x3', yaxis='y3', name="Avg Speed"))
dash_indices.append(len(fig.data)-1)

# --- C. LEADERBOARD TABLE ---
table_data = []
for i, name in enumerate(top_16, 1):
    dna_list = sorted(data_registry[name]["dna"].items(), key=lambda x: x[1], reverse=True)
    comp = " | ".join([f"{int(v*100)}% {k}" for k, v in dna_list[:3]])
    table_data.append([i, name, horse_db[name]['Speed'], f"{data_registry[name]['f']*100:.1f}%", comp])

fig.add_trace(go.Table(
    header=dict(values=['RANK', 'NAME', 'SPD', 'F-SCORE', 'TOP DNA'], fill_color='#1a1a1a', font=dict(color='white')),
    cells=dict(values=list(zip(*table_data)), fill_color='#050505', font=dict(color='white')),
    visible=False
))
table_indices.append(len(fig.data)-1)

# =====================================================
# 4. FINAL LAYOUT & MASTER TOGGLE
# =====================================================
total = len(fig.data)
def get_vis(indices): return [True if i in indices else False for i in range(total)]

fig.update_layout(
    updatemenus=[dict(
        type="dropdown", direction="down", x=0.01, y=0.99, showactive=True,
        buttons=[
            dict(label="Family Tree View", method="update", 
                 args=[{"visible": get_vis(tree_indices)}, 
                       {"xaxis.visible": False, "yaxis.visible": False, "xaxis2.visible": False, "yaxis2.visible": False, "xaxis3.visible": False, "yaxis3.visible": False, "showlegend": True}]),
            dict(label="Stats Dashboard", method="update", 
                 args=[{"visible": get_vis(dash_indices)}, 
                       {"xaxis2.visible": True, "yaxis2.visible": True, "xaxis3.visible": True, "yaxis3.visible": True, "xaxis.visible": False, "yaxis.visible": False, "showlegend": False}]),
            dict(label="Leaderboard Table", method="update", 
                 args=[{"visible": get_vis(table_indices)}, 
                       {"xaxis.visible": False, "yaxis.visible": False, "xaxis2.visible": False, "yaxis2.visible": False, "xaxis3.visible": False, "yaxis3.visible": False, "showlegend": False}])
        ],
        bgcolor="#111", font=dict(color="white")
    )],
    template="plotly_dark", paper_bgcolor='#050505', plot_bgcolor='#050505',
    xaxis2=dict(domain=[0.05, 0.45], anchor='y2', visible=False, title="Inbreeding Coeff"),
    yaxis2=dict(domain=[0.6, 0.9], anchor='x2', visible=False),
    xaxis3=dict(domain=[0.55, 0.95], anchor='y3', visible=False, title="Generation"),
    yaxis3=dict(domain=[0.6, 0.9], anchor='x3', visible=False, title="Avg Speed"),
    margin=dict(t=50, b=50, l=50, r=50)
)

now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
fig.add_annotation(text=f"Last Sync: {now}", xref="paper", yref="paper", x=1, y=0, showarrow=False, font=dict(color="gray"))

fig.write_html("index.html", config={'scrollZoom': True})
print(f"Build Successful at {now}. Open 'index.html' to view.")