import math

def distance_meters(lat1, lng1, lat2, lng2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using the Haversine formula.
    Returns distance in meters.
    """
    if None in (lat1, lng1, lat2, lng2):
        return 0.0
        
    # Convert decimal degrees to radians 
    lat1_rad, lng1_rad = math.radians(lat1), math.radians(lng1)
    lat2_rad, lng2_rad = math.radians(lat2), math.radians(lng2)

    # Haversine formula 
    dlon = lng2_rad - lng1_rad 
    dlat = lat2_rad - lat1_rad 
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371000 # Radius of earth in meters
    return c * r

def check_geofence_violation(equipment, site):
    """
    Returns True if equipment is outside the site's geofence radius.
    Expects equipment to have current_lat, current_lng
    and site to have center_lat, center_lng, geofence_radius_m
    """
    if not equipment.current_lat or not equipment.current_lng:
        return False
    if not site.center_lat or not site.center_lng:
        return False
        
    radius = site.geofence_radius_m or 500.0 # fallback default if null
    dist = distance_meters(
        equipment.current_lat, equipment.current_lng,
        site.center_lat, site.center_lng
    )
    return dist > radius
