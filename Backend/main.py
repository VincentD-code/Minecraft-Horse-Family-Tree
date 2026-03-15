# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from datetime import datetime
import os

app = FastAPI()

# Allow React to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Default Vite port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/horse-data")
def get_data():
    # =====================================================
    # 1. DATA LOADING & LOGIC ENGINE
    # =====================================================
    csv_filename = "horse_data.csv"
    if not os.path.exists(csv_filename):
        return {"error": f"CRITICAL ERROR: '{csv_filename}' not found."}

    # Load data
    df = pd.read_csv(csv_filename)

    # Define text columns and handle strings safely
    text_cols = ['Name', 'Parent1', 'Parent2', 'Status', 'OriginBlood', 'Appearance']
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().replace(["nan", "None", ""], np.nan)

    df['OriginBlood'] = df['OriginBlood'].replace("Void Born", "Celestial Grass")

    # SAFE NUMERIC CONVERSION
    df['Speed'] = pd.to_numeric(df['Speed'], errors='coerce').fillna(0)
    df['Jump'] = pd.to_numeric(df['Jump'], errors='coerce').fillna(0)
    df['Health'] = pd.to_numeric(df['Health'], errors='coerce').fillna(0)
    df['Generation'] = pd.to_numeric(df['Generation'], errors='coerce')

    horse_db = df.fillna("").set_index("Name").to_dict('index')

    origin_colors = {
        "Star Strider": "#FFD700", 
        "Celestial Grass": "#00FF7F", 
        "Thunder Blood": "#FF004F",
        "Frostmane": "#00D4FF", 
        "Emberhoof": "#FF8C00", 
        "Slothsoul": "#708090",      
        "Unknown": "#444444"
    }

    def mix_rgb_colors(dna_weights):
        if not dna_weights:
            return "#444444"
        r, g, b = 0, 0, 0
        valid_weight_sum = sum(dna_weights.values())
        if valid_weight_sum == 0: return "#444444"
        
        for bloodline, percentage in dna_weights.items():
            hex_c = origin_colors.get(bloodline, "#444444").lstrip('#')
            rgb = tuple(int(hex_c[i:i+2], 16) for i in (0, 2, 4))
            r += (rgb[0] / 255) * (percentage / valid_weight_sum)
            g += (rgb[1] / 255) * (percentage / valid_weight_sum)
            b += (rgb[2] / 255) * (percentage / valid_weight_sum)
        return f'rgb({int(r*255)},{int(g*255)},{int(b*255)})'

    data_registry = {}
    ancestor_map = {}

    def get_ancestor_list(name):
        if not name or name not in horse_db:
            return []
        p1 = horse_db[name].get("Parent1")
        p2 = horse_db[name].get("Parent2")
        ancestors = [name]
        if p1 and p1 in horse_db:
            ancestors.extend(get_ancestor_list(p1))
        if p2 and p2 in horse_db:
            ancestors.extend(get_ancestor_list(p2))
        return list(set(ancestors))

    def process_horse(name, depth=0):
        if depth > 25 or name == "" or name not in horse_db:
            return {"dna": {"Unknown": 1.0}, "color": "#444444", "level": 0, "mutation": 0}

        if name in data_registry:
            return data_registry[name]

        row = horse_db[name]
        p1 = row.get("Parent1", "")
        p2 = row.get("Parent2", "")
        current_speed = float(row.get("Speed", 0))

        if p1 == "" or p2 == "":
            blood = row.get("OriginBlood")
            if not blood or blood == "": blood = "Unknown"
            dna = {blood: 1.0}
            color = origin_colors.get(blood, "#444444")
            level = 0
            mutation = 0.0
        else:
            res1 = process_horse(p1, depth + 1)
            res2 = process_horse(p2, depth + 1)
            
            all_keys = set(res1["dna"].keys()) | set(res2["dna"].keys())
            dna = {k: (res1["dna"].get(k, 0) + res2["dna"].get(k, 0)) / 2 for k in all_keys}
            color = mix_rgb_colors(dna)
            level = max(res1["level"], res2["level"]) + 1
            
            p1_spd = float(horse_db.get(p1, {}).get("Speed", 0))
            p2_spd = float(horse_db.get(p2, {}).get("Speed", 0))
            mutation = (3 * current_speed) - p1_spd - p2_spd

        data_registry[name] = {
            "dna": dna, "color": color, "level": level, "mutation": mutation
        }
        ancestor_map[name] = get_ancestor_list(name)
        return data_registry[name]

    for name in horse_db:
        process_horse(name)

    descendant_rel_map = {name: [] for name in horse_db}
    for child, row in horse_db.items():
        for p in [row.get("Parent1"), row.get("Parent2")]:
            if p and p in descendant_rel_map:
                descendant_rel_map[p].append(child)

    full_descendant_map = {}
    def get_all_descendants(name):
        if name in full_descendant_map:
            return full_descendant_map[name]
        direct = descendant_rel_map.get(name, [])
        all_desc = list(direct)
        for child in direct:
            all_desc.extend(get_all_descendants(child))
        full_descendant_map[name] = list(set(all_desc))
        return full_descendant_map[name]

    final_desc_map = {name: get_all_descendants(name) + [name] for name in horse_db}

    # =====================================================
    # 2. POSITIONING & TOP 3 COMPUTATIONS
    # =====================================================
    generation_groups = {}
    for name, data in data_registry.items():
        generation_groups.setdefault(data["level"], []).append(name)

    pos = {}
    for level, names in generation_groups.items():
        names.sort(key=lambda x: horse_db[x].get("Speed", 0), reverse=True)
        width = len(names) * 20.0
        for idx, name in enumerate(names):
            pos[name] = ((idx * 20.0) - (width / 2), -level * 15.0)

    top_3_speed = df.nlargest(3, 'Speed')['Name'].tolist()
    top_3_jump = df.nlargest(3, 'Jump')['Name'].tolist()
    top_3_health = df.nlargest(3, 'Health')['Name'].tolist()

    # =====================================================
    # 3. PLOTLY TREE BUILDER
    # =====================================================
    fig = go.Figure()

    for name, row in horse_db.items():
        p1_n, p2_n = row["Parent1"], row["Parent2"]
        if p1_n in pos and p2_n in pos:
            p1, p2 = pos[p1_n], pos[p2_n]
            fig.add_trace(go.Scatter(
                x=[p1[0], p2[0]], y=[p1[1], p2[1]],
                mode='lines', line=dict(color="rgb(180,180,180)", width=1.5),
                opacity=0.30, hoverinfo='skip', showlegend=False,
                customdata=[{"child": name, "parents": [p1_n, p2_n]}] * 2,
                name="line_parent"
            ))

    for name, row in horse_db.items():
        if name not in pos: continue
        p1_n, p2_n = row["Parent1"], row["Parent2"]
        if p1_n in pos and p2_n in pos:
            p1, p2, child = pos[p1_n], pos[p2_n], pos[name]
            mid_x, mid_y = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
            t = np.linspace(0, 1, 15)
            curve_x = (1-t)**3 * mid_x + 3*(1-t)**2*t * mid_x + 3*(1-t)*t**2 * child[0] + t**3 * child[0]
            curve_y = (1-t)**3 * mid_y + 3*(1-t)**2*t * (mid_y - 4) + 3*(1-t)*t**2 * (child[1] + 4) + t**3 * child[1]
            fig.add_trace(go.Scatter(
                x=curve_x, y=curve_y,
                mode='lines', line=dict(color=data_registry[name]["color"], width=2.5),
                opacity=0.45, hoverinfo='skip', showlegend=False,
                customdata=[{"child": name, "parents": [p1_n, p2_n]}] * 15,
                name="line_child"
            ))

    rank_colors = {0: "#FFD700", 1: "#C0C0C0", 2: "#CD7F32"}
    rank_shapes = {0: "star", 1: "diamond", 2: "triangle-up"}

    for name, (x, y) in pos.items():
        h_data = data_registry[name]
        row = horse_db[name]
        
        for stat_name, top_list in [("speed", top_3_speed), ("jump", top_3_jump), ("health", top_3_health)]:
            if name in top_list:
                rank = top_list.index(name)
                if rank <= 2:
                    fig.add_trace(go.Scatter(
                        x=[x], y=[y], mode='markers',
                        marker=dict(size=55 if rank == 0 else 45, color=rank_colors[rank], opacity=0.25),
                        hoverinfo='skip', showlegend=False, name=f"glow_{stat_name}", customdata=[name],
                        visible=(stat_name == "speed") 
                    ))

        rank = top_3_speed.index(name) if name in top_3_speed else None
        is_god, is_dead = (rank == 0), row.get("Status") == "Dead"
        node_fill = "#050505" if is_dead else h_data["color"]
        line_width = 4 if rank is not None else 1.5
        display_name = f"★ GOD HORSE: {name.upper()} ★" if is_god else name.upper()

        dna_sorted = sorted(h_data["dna"].items(), key=lambda x: x[1], reverse=True)
        dna_str = "<br>".join([f"  • {k}: {v*100:.1f}%" for k, v in dna_sorted if v > 0])
        p1, p2 = row.get("Parent1"), row.get("Parent2")
        parent_info = f"Parents: {p1} & {p2}<br>Roll Luck: {h_data['mutation']:.2f}" if p1 and p2 else f"Origin: {row.get('OriginBlood', 'Unknown')}"

        gen_val = int(row['Generation']) if (row.get('Generation') != "" and pd.notna(row.get('Generation'))) else h_data['level']
        appearance_val = row.get("Appearance") if row.get("Appearance") else "Standard"
        hp = float(row.get('Health', 0))
        hearts = round(hp / 2, 1)

        hover_label = (
            f"<b>{name.upper()}</b> "
            f"({'DEAD' if is_dead else 'ALIVE'})<br>"
            f"Gen: {gen_val}<br>"
            f"Appearance: {appearance_val}<br>"
            f"Speed: {row['Speed']:.2f} bps<br>"
            f"Jump: {row.get('Jump', 0):.2f} blocks<br>"
            f"Health: {hp:.2f} ({hearts} ❤)<br>"
            f"-------------------------<br>"
            f"{parent_info}<br>"
            f"<b>DNA Breakdown:</b><br>{dna_str}"
        )

        fig.add_trace(go.Scatter(
            x=[x], y=[y], mode='markers+text', text=[display_name], textposition="bottom center",
            marker=dict(size=26 if rank is not None else 14, color=node_fill, symbol=rank_shapes.get(rank, "circle"),
                        line=dict(width=line_width, color=rank_colors.get(rank, h_data["color"]))),
            hovertext=hover_label, hoverinfo="text", customdata=[name], name="node"
        ))

    fig.update_layout(
        template="plotly_dark", paper_bgcolor='#050505', plot_bgcolor='#050505',
        xaxis=dict(visible=False), yaxis=dict(visible=False), clickmode='event+select',
        showlegend=False, margin=dict(t=120, b=50, l=50, r=50),
        hoverlabel=dict(bgcolor="#111", font_size=12, font_family="monospace")
    )
        
    # =====================================================
    # 4. FINAL STATS & RETURN OBJECT
    # =====================================================
    alive_df = df[df['Status'].astype(str).str.strip().str.lower() != 'dead']

    gen_speeds = {}
    for name, data in data_registry.items():
        if horse_db[name].get("OriginBlood") == "Slothsoul": continue
        lvl, spd = data['level'], float(horse_db[name].get('Speed', 0))
        gen_speeds.setdefault(lvl, []).append(spd)

    avg_speed_gen = {lvl: round(sum(spds)/len(spds), 2) for lvl, spds in sorted(gen_speeds.items())}

    def calculate_global_genetics(include_dead=True):
        totals = {}
        for name, data in data_registry.items():
            if not include_dead and horse_db[name].get("Status") == "Dead": continue
            for bloodline, percent in data["dna"].items():
                if bloodline not in ["Unknown", "Slothsoul", ""]:
                    totals[bloodline] = totals.get(bloodline, 0) + percent
        total_sum = sum(totals.values())
        return {k: round((v / total_sum) * 100, 1) for k, v in totals.items()} if total_sum > 0 else {}

    # Return raw dictionaries, let FastAPI handle the JSON conversion
    return {
        "graph": fig.to_plotly_json(),
        "stats": {
            "top_16_speed": alive_df.nlargest(16, 'Speed')[['Name', 'Speed']].to_dict('records'),
            "top_16_jump": alive_df.nlargest(16, 'Jump')[['Name', 'Jump']].to_dict('records'),
            "top_16_health": alive_df.nlargest(16, 'Health')[['Name', 'Health']].to_dict('records'),
            "avg_speed": avg_speed_gen,
            "blood_all": calculate_global_genetics(include_dead=True),
            "blood_alive": calculate_global_genetics(include_dead=False)
        },
        "maps": {
            "ancestors": ancestor_map,
            "descendants": final_desc_map,
            "baseColors": {name: d["color"] for name, d in data_registry.items()},
            "top3Ranks": {"speed": top_3_speed, "jump": top_3_jump, "health": top_3_health},
            "bloodColors": origin_colors
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)