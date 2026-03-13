import pandas as pd
import numpy as np
import plotly.graph_objects as go
from datetime import datetime
import os
import json

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
# Dictionary to store ancestors for the JS highlighter
ancestor_map = {}

def get_ancestor_list(name):
    if not name or name not in horse_db: return []
    p1 = horse_db[name].get("Parent1")
    p2 = horse_db[name].get("Parent2")
    ancestors = [name]
    if p1: ancestors.extend(get_ancestor_list(p1))
    if p2: ancestors.extend(get_ancestor_list(p2))
    return list(set(ancestors))

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
        mutation = (3 * current_speed) - float(horse_db[p1]['Speed']) - float(horse_db[p2]['Speed'])

    data_registry[name] = {"dna": dna, "color": color, "level": level, "mutation": mutation}
    ancestor_map[name] = get_ancestor_list(name)
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

# --- CONNECTIONS ---
for name, row in horse_db.items():
    p1_n, p2_n = row["Parent1"], row["Parent2"]
    if p1_n in pos and p2_n in pos:
        p1, p2, child = pos[p1_n], pos[p2_n], pos[name]
        
        # Parent-to-Parent Horizontal
        fig.add_trace(go.Scatter(
            x=[p1[0], p2[0]], y=[p1[1], p2[1]], mode='lines', 
            line=dict(color="rgba(180,180,180,0.4)", width=1.5), 
            hoverinfo='skip', showlegend=False,
            customdata=[name], # Store child name to know which lineage this belongs to
            name="line"
        ))

        # Colored Curves
        mid_x, mid_y = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        t = np.linspace(0, 1, 15)
        curve_x = (1-t)**3 * mid_x + 3*(1-t)**2*t * mid_x + 3*(1-t)*t**2 * child[0] + t**3 * child[0]
        curve_y = (1-t)**3 * mid_y + 3*(1-t)**2*t * (mid_y - 4) + 3*(1-t)*t**2 * (child[1] + 4) + t**3 * child[1]
        fig.add_trace(go.Scatter(
            x=curve_x, y=curve_y, mode='lines', 
            line=dict(color=data_registry[name]["color"], width=2), 
            opacity=0.3, hoverinfo='skip', showlegend=False,
            customdata=[name],
            name="line"
        ))

# --- NODES ---
for name, (x, y) in pos.items():
    h_data = data_registry[name]
    row = horse_db[name]
    is_god = (name == fastest_horse_name)
    
    display_name = f"★ GOD HORSE: {name.upper()} ★" if is_god else name.upper()
    
    # Hover Info
    dna_sorted = sorted(h_data["dna"].items(), key=lambda x: x[1], reverse=True)
    dna_str = "<br>".join([f"  • {k}: {v*100:.1f}%" for k, v in dna_sorted if v > 0])
    p1, p2 = row.get("Parent1"), row.get("Parent2")
    parent_info = f"Parents: {p1} & {p2}<br>Roll: {h_data['mutation']:.2f}" if p1 else "Foundation"

    fig.add_trace(go.Scatter(
        x=[x], y=[y], mode='markers+text',
        text=[display_name], textposition="bottom center",
        marker=dict(size=22 if is_god else 14, color=h_data["color"], 
                    symbol="star" if is_god else "circle",
                    line=dict(width=3 if is_god else 1.5, color="#FFD700" if is_god else "white")),
        hovertext=f"<b>{display_name}</b><br>Speed: {row['Speed']}<br>{parent_info}<br>{dna_str}",
        hoverinfo="text",
        customdata=[name],
        name="node"
    ))

# Legend
for blood, color in origin_colors.items():
    fig.add_trace(go.Scatter(x=[None], y=[None], mode='markers', marker=dict(color=color), name=blood))

fig.update_layout(
    title="Pedigree Tree: Click a Horse to Highlight Ancestors",
    template="plotly_dark", paper_bgcolor='#050505', plot_bgcolor='#050505',
    xaxis=dict(visible=False), yaxis=dict(visible=False),
    clickmode='event+select'
)

# =====================================================
# 4. JAVASCRIPT INJECTION FOR HIGHLIGHTING
# =====================================================
anc_json = json.dumps(ancestor_map)

html_content = fig.to_html(include_plotlyjs='cdn', config={'scrollZoom': True})

# Injected script: Listens for click, checks ancestor map, dims everyone else
js_script = f"""
<script>
var ancestorMap = {anc_json};
var graphDiv = document.getElementsByClassName('plotly-graph-div')[0];

graphDiv.on('plotly_click', function(data){{
    var selectedHorse = data.points[0].customdata;
    var ancestors = ancestorMap[selectedHorse] || [];
    
    var update = {{
        'opacity': [],
        'marker.opacity': [],
        'line.width': []
    }};

    var totalTraces = graphDiv.data.length;
    for(var i=0; i<totalTraces; i++){{
        var trace = graphDiv.data[i];
        var traceHorse = trace.customdata ? trace.customdata[0] : null;
        
        // If trace is a node or line belonging to an ancestor, keep it bright
        if (traceHorse && ancestors.includes(traceHorse)) {{
            update.opacity.push(1.0);
            update['line.width'].push(trace.name === "line" ? 4 : null);
        }} else if (trace.name === "line" || trace.name === "node") {{
            update.opacity.push(0.05);
            update['line.width'].push(trace.name === "line" ? 0.5 : null);
        }} else {{
            update.opacity.push(1.0); // Legend items
            update['line.width'].push(null);
        }}
    }}
    Plotly.restyle(graphDiv, update);
}});

// Reset on double click
graphDiv.on('plotly_doubleclick', function() {{
    Plotly.restyle(graphDiv, {{'opacity': 1.0, 'line.width': 2}});
}});
</script>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_content.replace('</body>', js_script + '</body>'))

print("Interactive tree built. Open 'index.html' and click a horse!")