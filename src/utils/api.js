const API_BASE_URL = import.meta.env.VITE_ODATA_API_BASE_URL;

export const fetchFloors = async (orgId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/floors/${orgId}`);
    if (!response.ok) {
      throw new Error(`Error fetching floors: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchFloorPlan = async (orgId, floorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/floor-features/${orgId}/${floorId}`);
    if (!response.ok) {
      throw new Error(`Error fetching floor plan: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateFeature = async (orgId, floorId, data) => {
  const dataCopy = JSON.parse(JSON.stringify(data));
  for(const feature of data.features) {
    dataCopy.features = [];
    var featureId = feature.properties.id;
    delete feature.properties.id;
    dataCopy.features.push(feature);
    try {
      const response = await fetch(`${API_BASE_URL}/floor-features/${orgId}/${floorId}/${featureId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataCopy), // Convert the data to JSON
      });
  
      if (!response.ok) {
        throw new Error(`Error updating floor features: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
};