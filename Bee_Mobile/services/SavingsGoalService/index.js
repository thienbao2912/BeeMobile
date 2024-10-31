const API_URL = 'http://172.16.18.81:4000/api'; // Đảm bảo đúng port của backend

export const fetchAllSavingGoals = async () => {
  try {
    const response = await fetch(`${API_URL}/goals`);
    if (!response.ok) {
      throw new Error('Failed to fetch saving goals');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addSavingGoal = async (goalData) => {
  try {
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });

    if (!response.ok) {
      throw new Error('Failed to add saving goal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
