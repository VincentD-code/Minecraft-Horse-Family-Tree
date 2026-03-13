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

# Identify the fastest horse for the "God Horse" glow effect
fastest_horse_name = df.loc[pd.to_numeric(df['Speed']).idxmax(), 'Name']

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

def process_horse(name, depth=0):
    if depth > 25 or name == "" or name not in horse_db: 
        return {"dna": {"Unknown": 1.0}, "color": "#444444", "level": 0, "mutation": 0}
    if name in data_registry: return data_registry[name]
    
    row = horse_db[name]
    p1, p2 = row.get("Parent1", ""), row.get("Parent2", "")
    current_speed = float(row.get("Speed") or 0)
    
    if p1 == "" or p2 == "":
        blood = row.get("OriginBlood", "Unknown")
        dna, color, level, mutation = {blood: 1.0}, origin_colors.get(blood, "#444444"), 0, 0.0
    else:
        res1, res2 = process_horse(p1, depth + 1), process_horse(p2, depth + 1)
        all_keys = set(res1["dna"].keys()) | set(res2["dna"].keys())
        dna = {k: (res1["dna"].get(k, 0) + res2["dna"].get(k, 0)) / 2 for k in all_keys}
        color = mix_rgb_colors(dna)
        level = max(res1["level"], res2["level"]) + 1
        
        # Mutation = (3 * ChildSpeed) - Parent1Speed - Parent2Speed
        s1 = float(horse_db[p1].get("Speed") or 0)
        s2 = float(horse_db[p2].get("Speed") or 0)
        mutation = (3 * current_speed) - s1 - s2

    data_registry[name] = {"dna": dna, "color": color, "level": level, "mutation": mutation}
    return data_registry[name]

for name in horse_db: process_horse(name)

# =====================================================
# 2. POSITIONING
# =====================================================
generation_groups = {}
for name, data in data_registry.items():
    generation_groups.setdefault(data["level"], []).append(name)

pos = {}
for level, names in generation_groups.items():
    names.sort(key=lambda x: float(horse_db[x].get("Speed", 0) or 0), reverse=True)
    width = len(names) * 20.0
    for idx, name in enumerate(names):
        pos[name] = ((idx * 20.0) - (width / 2), -level * 15.0) 

# =====================================================
# 3. PLOTLY TREE BUILDER
# =====================================================
fig = go.Figure()

# --- CONNECTIONS (LINES) ---
for name, row in horse_db.items():
    p1_n, p2_n = row["Parent1"], row["Parent2"]
    if p1_n in pos and p2_n in pos:
        p1, p2, child = pos[p1_n], pos[p2_n], pos[name]
        
        # 1. LIGHT GRAY PARENT-TO-PARENT LINE (Essential)
        fig.add_trace(go.Scatter(
            x=[p1[0], p2[0]], y=[p1[1], p2[1]], 
            mode='lines', 
            line=dict(color="rgba(180,180,180,0.4)", width=1.5), 
            hoverinfo='skip', showlegend=False
        ))

        # 2. COLORED CURVES TO CHILD
        mid_x, mid_y = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        t = np.linspace(0, 1, 15)
        curve_x = (1-t)**3 * mid_x + 3*(1-t)**2*t * mid_x + 3*(1-t)*t**2 * child[0] + t**3 * child[0]
        curve_y = (1-t)**3 * mid_y + 3*(1-t)**2*t * (mid_y - 4) + 3*(1-t)*t**2 * (child[1] + 4) + t**3 * child[1]
        fig.add_trace(go.Scatter(
            x=curve_x, y=curve_y, 
            mode='lines', 
            line=dict(color=data_registry[name]["color"], width=2), 
            opacity=0.3, hoverinfo='skip', showlegend=False
        ))

# --- NODES ---
for name, (x, y) in pos.items():
    h_data = data_registry[name]
    row = horse_db[name]
    is_dead = row.get("Status") == "Dead"
    is_god = (name == fastest_horse_name)
    
    display_name = f"★ GOD HORSE: {name.upper()} ★" if is_god else name.upper()
    node_size = 22 if is_god else 14
    text_color = "#FFD700" if is_god else "rgba(255,255,255,0.8)"

    # Glow Effect for God Horse
    if is_god:
        fig.add_trace(go.Scatter(
            x=[x], y=[y], mode='markers',
            marker=dict(size=node_size+18, color=h_data["color"], opacity=0.25),
            hoverinfo='skip', showlegend=False
        ))

    # DNA & Parent Tooltips
    dna_sorted = sorted(h_data["dna"].items(), key=lambda x: x[1], reverse=True)
    dna_str = "<br>".join([f"  • {k}: {v*100:.1f}%" for k, v in dna_sorted if v > 0])
    p1, p2 = row.get("Parent1"), row.get("Parent2")
    parent_info = "Foundation Horse"
    if p1 and p2:
        s1, s2 = horse_db[p1].get("Speed"), horse_db[p2].get("Speed")
        parent_info = f"Parents: {p1} ({s1}) & {p2} ({s2})<br>Breeding Roll: {h_data['mutation']:.2f}"

    hover_label = (
        f"<b>{display_name}</b><br>"
        f"Speed: {row['Speed']}<br>"
        f"{parent_info}<br>"
        f"<b>Bloodline Density:</b><br>{dna_str}"
    )

    fig.add_trace(go.Scatter(
        x=[x], y=[y], mode='markers+text',
        text=[display_name],
        textposition="bottom center", 
        textfont=dict(size=10 if is_god else 8, color=text_color),
        marker=dict(
            size=node_size, 
            color='black' if is_dead else h_data["color"],
            line=dict(width=3 if is_god else 1.5, color="#FFD700" if is_god else "rgba(255,255,255,0.3)"),
            symbol="star" if is_god else "circle"
        ),
        hovertext=hover_label, hoverinfo="text", showlegend=False
    ))

# --- LEGEND ---
for blood, color in origin_colors.items():
    fig.add_trace(go.Scatter(x=[None], y=[None], mode='markers', marker=dict(color=color, size=10), name=blood))

# =====================================================
# 4. LAYOUT
# =====================================================
fig.update_layout(
    title=f"Horse Pedigree Tree | Fastest: {fastest_horse_name}",
    template="plotly_dark", paper_bgcolor='#050505', plot_bgcolor='#050505',
    xaxis=dict(visible=False), yaxis=dict(visible=False),
    showlegend=True, margin=dict(t=80, b=50, l=50, r=50),
    hoverlabel=dict(bgcolor="#111", font_size=12, font_family="monospace")
)

fig.write_html("index.html", config={'scrollZoom': True})
print(f"Build Successful. Horizontal parent lines restored. God Horse: {fastest_horse_name}.")