import folium
from folium.plugins import MarkerCluster
import sqlite3
import os
import math

# --- CONFIGURATION ---
DB_PATH = r'D:\COLLEGE_KRMU\SEMESTER 2\MINOR PROJECT\NEURAL NINJAS + BACKEND\ProjexaAI\data.db'
OUTPUT_PATH = r'D:\COLLEGE_KRMU\SEMESTER 2\MINOR PROJECT\NEURAL NINJAS + BACKEND\myproject\client\public\transportation_map.html'
API_KEY = 'bfmqehaobmxkkgeirkzlhmkjanpillsbufsm'
HUB_COORDS = [28.3662, 77.0601]

# --- HELPERS ---
def get_mappls_tile_url(api_key):
    # Using the XYZ template for Folium/Leaflet
    return f"https://apis.mappls.com/advancedmaps/v1/{api_key}/vt/default_style/{{z}}/{{x}}/{{y}}.png"

def create_map():
    print("Initializing Neural Map Generation...")
    
    # Create base folium map centered at KRMU hub
    m = folium.Map(
        location=HUB_COORDS, 
        zoom_start=9, 
        tiles=None, # We'll add Mappls tiles manually
        control_scale=True
    )

    # Add Mappls Tile Layer (High Fidelity)
    folium.TileLayer(
        tiles=get_mappls_tile_url(API_KEY),
        attr='&copy; Mappls | KRMU Neural Hub',
        name='Mappls Neural View',
        overlay=False,
        control=True
    ).add_to(m)

    # Add KRMU Hub Marker
    hub_html = """
    <div style='background: rgba(11,15,26,0.9); border: 2px solid #FFD700; border-radius: 12px; padding: 15px; color: white; width: 200px; font-family: "Plus Jakarta Sans", sans-serif;'>
        <b style='color: #FFD700; font-size: 14px;'>CENTRAL HUB: KRMU</b>
        <p style='font-size: 10px; color: #94A3B8; margin-top: 5px;'>Primary Synchronization Point for 200+ Neural Nodes.</p>
        <div style='height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0;'></div>
        <span style='font-size: 9px; color: #4F46E5;'>LAT: 28.3662 | LNG: 77.0601</span>
    </div>
    """
    folium.Marker(
        location=HUB_COORDS,
        popup=folium.Popup(hub_html, max_width=250),
        icon=folium.Icon(color='purple', icon='university', prefix='fa'),
        tooltip="KRMU Central Hub"
    ).add_to(m)

    # Connecting to database to fetch student nodes
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT full_name, roll_no, latitude, longitude, distance_km FROM students")
        students = cursor.fetchall()
        
        # Implement Marker Clustering for performance and "Neural Node" feel
        marker_cluster = MarkerCluster(
            name="Neural Nodes",
            overlay=True,
            control=True,
            icon_create_function=None # default
        ).add_to(m)

        for s in students:
            name, roll, lat, lng, dist = s
            if lat and lng:
                # Student node popup with glassmorphism style
                popup_html = f"""
                <div style='background: rgba(15,23,42,0.95); border-radius: 12px; padding: 12px; color: white; min-width: 160px; font-family: "Plus Jakarta Sans", sans-serif; border: 1px solid rgba(255,255,255,0.1);'>
                    <div style='font-size: 12px; font-weight: 800; color: #F8FAFC;'>{name}</div>
                    <div style='font-size: 10px; color: #64748B; margin-bottom: 8px;'>ID: {roll}</div>
                    <div style='display: flex; justify-content: space-between; align-items: center;'>
                        <span style='font-size: 9px; color: #94A3B8;'>DISTANCE:</span>
                        <span style='font-size: 11px; font-weight: 900; color: #22D3EE;'>{dist} KM</span>
                    </div>
                    <div style='margin-top: 8px; color: #4F46E5; font-size: 8px; font-weight: bold; letter-spacing: 1px;'>NODE ACTIVE</div>
                </div>
                """
                
                # Add Marker to cluster
                folium.Marker(
                    location=[lat, lng],
                    popup=folium.Popup(popup_html, max_width=200),
                    icon=folium.Icon(color='blue', icon='user', prefix='fa'),
                    tooltip=name
                ).add_to(marker_cluster)

                # Add Distance Vector (Line to Hub) for students within 100km for better visualization
                if dist < 100:
                    folium.PolyLine(
                        locations=[[lat, lng], HUB_COORDS],
                        color='#4F46E5',
                        weight=0.5,
                        opacity=0.3,
                        dash_array='5, 10'
                    ).add_to(m)

        conn.close()
        print(f"Synthesized Map with {len(students)} student nodes.")
    except Exception as e:
        print(f"Database/Map Error: {e}")

    # Finalize and Save
    print(f"Exporting Neural Map to {OUTPUT_PATH}...")
    m.save(OUTPUT_PATH)
    print("Map successfully exported and ready for portal synchronization.")

if __name__ == "__main__":
    create_map()
