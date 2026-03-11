import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.colors as mcolors
from matplotlib.path import Path
import numpy as np
import os

# =====================================================
# 1. DATA LOADING & COLOR UTILS
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
        hex_c = origin_colors.get(bloodline, "#444444")
        rgb = mcolors.to_rgb(hex_c)
        r += rgb[0] * percentage
        g += rgb[1] * percentage
        b += rgb[2] * percentage
    return mcolors.to_hex((r, g, b))

# =====================================================
# 2. LOGIC ENGINE (INBREEDING & DNA)
# =====================================================
data_registry = {}

def get_ancestors(name):
    if name == "" or name not in horse_db:
        return {}
    row = horse_db[name]
    p1, p2 = row.get("Parent1", ""), row.get("Parent2", "")
    if p1 == "" or p2 == "":
        return {name: 1.0}
    anc1 = get_ancestors(p1)
    anc2 = get_ancestors(p2)
    combined = {name: 1.0}
    for k, v in anc1.items(): combined[k] = combined.get(k, 0) + v * 0.5
    for k, v in anc2.items(): combined[k] = combined.get(k, 0) + v * 0.5
    return combined

def calculate_inbreeding(p1, p2):
    if not p1 or not p2 or p1 not in horse_db or p2 not in horse_db:
        return 0.0
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

generation_groups = {}
for name, data in data_registry.items():
    generation_groups.setdefault(data["level"], []).append(name)

# =====================================================
# 3. POSITIONING & AGGREGATION
# =====================================================
pos = {}
for level, names in generation_groups.items():
    names.sort(key=lambda x: float(horse_db[x].get("Speed", 0) or 0), reverse=True)
    width = len(names) * 15.0
    for idx, name in enumerate(names):
        pos[name] = ((idx * 15.0) - (width / 2), -level * 12.0) 

alive_horses = [n for n, d in horse_db.items() if d.get("Status") == "Alive"]
top_16 = sorted(alive_horses, key=lambda x: float(horse_db[x].get("Speed", 0) or 0), reverse=True)[:16]
god_horse = top_16[0] if top_16 else None

aggregate_dna = {}
for name in top_16:
    dna = data_registry[name]["dna"]
    for bloodline, val in dna.items():
        aggregate_dna[bloodline] = aggregate_dna.get(bloodline, 0) + val

# =====================================================
# 4. FIGURE 1: THE FAMILY TREE (TITLE REMOVED)
# =====================================================
fig1 = plt.figure(figsize=(30, 24), facecolor='#050505')
ax1 = fig1.add_subplot(111); ax1.set_facecolor('#050505')

def draw_hybrid_curves(p1_name, p2_name, child_name):
    p1, p2, child_pos = pos[p1_name], pos[p2_name], pos[child_name]
    child_color = data_registry[child_name]["color"]
    ax1.plot([p1[0], p2[0]], [p1[1], p2[1]], color="#555555", lw=1.2, ls='-', alpha=0.3, zorder=1)
    mid_x, mid_y = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
    path_data = [(Path.MOVETO, (mid_x, mid_y)), (Path.CURVE4, (mid_x, mid_y - 4)), 
                 (Path.CURVE4, (child_pos[0], child_pos[1] + 4)), (Path.CURVE4, child_pos)]
    codes, verts = zip(*path_data)
    ax1.add_patch(mpatches.PathPatch(Path(verts, codes), facecolor='none', edgecolor=child_color, lw=2.2, alpha=0.5, zorder=1))

for name, row in horse_db.items():
    if row["Parent1"] in pos and row["Parent2"] in pos:
        draw_hybrid_curves(row["Parent1"], row["Parent2"], name)

for name, (x, y) in pos.items():
    h_data = data_registry[name]
    color = h_data["color"]
    sorted_dna = sorted(h_data["dna"].items(), key=lambda x: x[1], reverse=True)
    dom_blood, purity = sorted_dna[0]
    is_dead = horse_db[name].get("Status") == "Dead"
    
    if name == god_horse:
        for i in range(1, 6): ax1.scatter(x, y, s=5500 + (i*1600), color=color, alpha=0.15/i, zorder=2)
    
    ax1.scatter(x, y, s=6200, color='#000000' if is_dead else color, edgecolors=color, linewidth=3.5, zorder=3)
    
    rgb = mcolors.to_rgb(color)
    brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
    txt_c = "white" if (is_dead or brightness < 0.5) else "black"
    
    label = (f"{'★ ' if name==god_horse else ''}{name.upper()}\n"
             f"{int(purity*100)}% {dom_blood}\n"
             f"F: {h_data['f']*100:.1f}%\n" 
             f"SPD: {horse_db[name]['Speed']}")
    
    ax1.text(x, y, label, ha="center", va="center", color=txt_c, fontsize=7, fontweight='bold', zorder=4)

# RESTORED CLEAN LEGENDS
blood_handles = [mpatches.Patch(color=c, label=b) for b, c in origin_colors.items() if b != "Unknown"]
fig1.legend(handles=blood_handles, title="ORIGIN BLOODLINES", loc="upper center", 
            bbox_to_anchor=(0.5, 0.96), ncol=len(blood_handles), facecolor='#111111', 
            labelcolor="white", framealpha=0.9, fontsize=12)

status_handles = [
    plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='#333333', markersize=15, label='Status: Alive', markeredgecolor='white'),
    plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='black', markersize=15, label='Status: Dead', markeredgecolor='gray')
]
fig1.legend(handles=status_handles, title="LIFECYCLE STATUS", loc="upper right", 
           bbox_to_anchor=(0.98, 0.96), facecolor='#111111', labelcolor="white", framealpha=0.9)

ax1.axis('off')

# =====================================================
# 5. FIGURE 2: STATS DASHBOARD (RESTORED TOP 16)
# =====================================================
fig2 = plt.figure(figsize=(28, 14), facecolor='#050505')

# A. Speed Trend
ax_trend = fig2.add_axes([0.05, 0.55, 0.38, 0.35]); ax_trend.set_facecolor('#0A0A0A')
gens = sorted(generation_groups.keys())
avgs = [np.mean([float(horse_db[n]['Speed'] or 0) for n in generation_groups[g]]) for g in gens]
ax_trend.plot(gens, avgs, color='#FFD700', marker='o', lw=4, label="Gen Avg Speed")
ax_trend.set_title("EVOLUTIONARY SPEED TREND", color="white", fontsize=16, fontweight='bold')
ax_trend.tick_params(colors='white'); ax_trend.grid(True, color='#333333', ls=':', alpha=0.5)

# B. DNA Pie
ax_pie = fig2.add_axes([0.05, 0.05, 0.38, 0.40]); ax_pie.set_facecolor('#050505')
pie_labels = sorted(aggregate_dna.keys())
ax_pie.pie([aggregate_dna[l] for l in pie_labels], labels=pie_labels, colors=[origin_colors.get(l, "#444444") for l in pie_labels], 
           autopct='%1.1f%%', textprops=dict(color="white", fontweight='bold'))
ax_pie.set_title("TOP 16 DNA FOOTPRINT", color="white", fontsize=16, fontweight='bold')

# C. INBREEDING COMPARISON
avg_f = np.mean([d['f'] for d in data_registry.values()])
god_f = data_registry[god_horse]['f'] if god_horse else 0
ax_f = fig2.add_axes([0.46, 0.08, 0.48, 0.12]); ax_f.set_facecolor('#0A0A0A')
bars = ax_f.barh(["Global Avg Inbreeding", f"Fastest ({god_horse})"], [avg_f, god_f], color=['#888888', '#FFD700'])
ax_f.axvline(0.125, color='#FF3333', ls='--', alpha=0.6, lw=2)
ax_f.set_title("INBREEDING COEFFICIENT (F) ANALYSIS", color="white", fontsize=14, fontweight='bold', loc='left')
ax_f.set_xlim(0, max(0.25, god_f + 0.05)); ax_f.tick_params(colors='white')
for bar in bars:
    ax_f.text(bar.get_width() + 0.002, bar.get_y() + 0.3, f'{bar.get_width()*100:.2f}%', color='white', fontweight='bold')

decoder_text = "F-VALUE DECODER: 0% : Diverse | 6.25% : Cousins | 12.5% : High Risk | 25% : Extreme"
fig2.text(0.46, 0.04, decoder_text, fontsize=10, family='monospace', color="#AAAAAA", 
          bbox=dict(boxstyle="round,pad=0.5", fc="#111111", ec="#444444", alpha=0.8))

# D. TOP 16 TABLE (With Full 5 Bloodlines)
lead_txt = "👑 TOP 16 FASTEST HORSES (ALIVE) 👑\n" + "═"*145 + "\n"
lead_txt += f"{'RANK':<5} {'HORSE NAME':<18} {'SPD':<6} {'F-SCORE':<10} | {'DNA COMPOSITION (Primary ➔ 5th)':<85}\n"
lead_txt += "═"*145 + "\n"

for i, name in enumerate(top_16, 1):
    f_val = f"{data_registry[name]['f']*100:.1f}%"
    dna_list = sorted(data_registry[name]["dna"].items(), key=lambda x: x[1], reverse=True)
    slots = [f"{int(dna_list[j][1]*100)}% {dna_list[j][0]}" if j < len(dna_list) else "---" for j in range(5)]
    lead_txt += f"{i:<5} {name:.<18} {horse_db[name]['Speed']:<6} {f_val:<10} | {' | '.join(slots)}\n"

fig2.text(0.46, 0.92, lead_txt, fontsize=9, family='monospace', color="white", 
          bbox=dict(boxstyle="round,pad=1.5", fc="#0A0A0A", ec="#FFD700", alpha=0.95, lw=2), va='top', linespacing=1.8)

plt.show()