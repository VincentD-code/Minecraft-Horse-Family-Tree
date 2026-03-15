import pandas as pd
import numpy as np
import plotly.graph_objects as go
import os
import json

# Constants
ORIGIN_COLORS = {
    "Star Strider": "#FFD700", 
    "Celestial Grass": "#00FF7F", 
    "Thunder Blood": "#FF004F",
    "Frostmane": "#00D4FF", 
    "Emberhoof": "#FF8C00", 
    "Slothsoul": "#708090",      
    "Unknown": "#444444"
}

def mix_rgb_colors(dna_weights):
    if not dna_weights: return "#444444"
    r, g, b = 0, 0, 0
    valid_weight_sum = sum(dna_weights.values())
    if valid_weight_sum == 0: return "#444444"
    for bloodline, percentage in dna_weights.items():
        hex_c = ORIGIN_COLORS.get(bloodline, "#444444").lstrip('#')
        rgb = tuple(int(hex_c[i:i+2], 16) for i in (0, 2, 4))
        r += (rgb[0] / 255) * (percentage / valid_weight_sum)
        g += (rgb[1] / 255) * (percentage / valid_weight_sum)
        b += (rgb[2] / 255) * (percentage / valid_weight_sum)
    return f'rgb({int(r*255)},{int(g*255)},{int(b*255)})'

def generate_static_data():
    # Get the directory where generate_json.py is
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to the main MHFT folder
    project_root = os.path.dirname(backend_dir)

    # 1. PATH TO CSV (Check if your folder is "Data" or "data")
    csv_path = os.path.join(project_root, "Data", "horse_data.csv")

    # 2. PATH TO JSON (Updated to match your horse-lineage-app structure)
    output_path = os.path.join(
        project_root, 
        "frontend", 
        "horse-lineage-app", 
        "public", 
        "horse_data.json"
    )

    # 2. DATA PROCESSING (Your original logic)
    df = pd.read_csv(csv_path)
    df['Name'] = df['Name'].astype(str).str.strip()
    df = df.dropna(subset=['Name'])
    
    text_cols = ['Parent1', 'Parent2', 'Status', 'OriginBlood', 'Appearance']
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().replace(["nan", "None", "np.nan"], "")

    df['OriginBlood'] = df['OriginBlood'].replace("Void Born", "Celestial Grass")
    df['Speed'] = pd.to_numeric(df['Speed'], errors='coerce').fillna(0)
    df['Jump'] = pd.to_numeric(df['Jump'], errors='coerce').fillna(0)
    df['Health'] = pd.to_numeric(df['Health'], errors='coerce').fillna(0)
    df['Generation'] = pd.to_numeric(df['Generation'], errors='coerce').fillna(0)

    horse_db = df.set_index("Name").to_dict('index')
    data_registry = {}
    ancestor_map = {}

    def get_ancestor_list(name):
        if not name or name not in horse_db: return []
        stack, visited = [name], set()
        while stack:
            curr = stack.pop()
            if curr and curr in horse_db and curr not in visited:
                visited.add(curr)
                row = horse_db[curr]
                if row.get("Parent1"): stack.append(row["Parent1"])
                if row.get("Parent2"): stack.append(row["Parent2"])
        return list(visited)

    def process_horse(name, depth=0):
        if depth > 30 or not name or name not in horse_db:
            return {"dna": {"Unknown": 1.0}, "color": "#444444", "level": 0, "mutation": 0}
        if name in data_registry: return data_registry[name]

        row = horse_db[name]
        p1, p2 = row.get("Parent1", ""), row.get("Parent2", "")
        current_speed = float(row.get("Speed", 0))

        if not p1 or not p2 or p1 not in horse_db or p2 not in horse_db:
            blood = row.get("OriginBlood") or "Unknown"
            dna, color, level, mutation = {blood: 1.0}, ORIGIN_COLORS.get(blood, "#444444"), 0, 0.0
        else:
            res1, res2 = process_horse(p1, depth + 1), process_horse(p2, depth + 1)
            all_keys = set(res1["dna"].keys()) | set(res2["dna"].keys())
            dna = {k: (res1["dna"].get(k, 0) + res2["dna"].get(k, 0)) / 2 for k in all_keys}
            color = mix_rgb_colors(dna)
            level = max(res1["level"], res2["level"]) + 1
            p1_spd = float(horse_db.get(p1, {}).get("Speed", 0))
            p2_spd = float(horse_db.get(p2, {}).get("Speed", 0))
            mutation = (3 * current_speed) - p1_spd - p2_spd

        data_registry[name] = {"dna": dna, "color": color, "level": level, "mutation": mutation}
        ancestor_map[name] = get_ancestor_list(name)
        return data_registry[name]

    for name in horse_db: process_horse(name)

    # Descendants
    descendant_rel_map = {name: [] for name in horse_db}
    for child, row in horse_db.items():
        for p in [row.get("Parent1"), row.get("Parent2")]:
            if p and p in descendant_rel_map: descendant_rel_map[p].append(child)

    full_descendant_map = {}
    def get_all_descendants(name):
        if name in full_descendant_map: return full_descendant_map[name]
        direct = descendant_rel_map.get(name, [])
        all_desc = list(direct)
        for child in direct: all_desc.extend(get_all_descendants(child))
        full_descendant_map[name] = list(set(all_desc))
        return full_descendant_map[name]

    final_desc_map = {name: get_all_descendants(name) + [name] for name in horse_db}

    # Positioning
    generation_groups = {}
    for name, data in data_registry.items():
        generation_groups.setdefault(data["level"], []).append(name)
    pos = {}
    for level, names in generation_groups.items():
        names.sort(key=lambda x: horse_db[x].get("Speed", 0), reverse=True)
        width = len(names) * 20.0
        for idx, name in enumerate(names):
            pos[name] = ((idx * 20.0) - (width / 2), -level * 15.0)

    # Plotly Tree Builder
    top_3_speed = df.nlargest(3, 'Speed')['Name'].tolist()
    fig = go.Figure()
    
    # [Lines and Nodes Logic remains identical to your original main.py...]
    # (Abbreviated here for space, but keep all your fig.add_trace code)
    # ... (Insert all your original Plotly trace building code here) ...

    # Final result assembly
    alive_df = df[df['Status'].astype(str).str.lower() != 'dead']
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

    final_payload = {
        "graph": fig.to_plotly_json(),
        "stats": {
            "top_16_speed": alive_df.nlargest(16, 'Speed')[['Name', 'Speed']].to_dict('records'),
            "top_16_jump": alive_df.nlargest(16, 'Jump')[['Name', 'Jump']].to_dict('records'),
            "top_16_health": alive_df.nlargest(16, 'Health')[['Name', 'Health']].to_dict('records'),
            "avg_speed": avg_speed_gen,
            "blood_all": calculate_global_genetics(include_dead=True),
            "blood_alive": calculate_global_genetics(include_dead=False)
        }
    }

    # SAVE TO FRONTEND PUBLIC FOLDER
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(final_payload, f)
    print(f"Success! Data saved to: {output_path}")

if __name__ == "__main__":
    generate_static_data()