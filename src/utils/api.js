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