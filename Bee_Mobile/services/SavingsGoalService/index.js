const API_URL = 'http://172.16.18.18:4000/api'; // Đảm bảo đúng port của backend

export const fetchAllSavingGoals = async () => {
  try {
    const response = await fetch(`${API_URL}/goals`);
    if (!response.ok) {
      throw new Error('Failed to fetch saving goals');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all saving goals:', error);
    throw error;
  }
};

export const fetchAllSavingGoalsByUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/goals/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch saving goals for the user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching saving goals for user ${userId}:`, error);
    throw error;
  }
};

export const fetchSavingGoalById = async (goalId) => {
  try {
    const response = await fetch(`${API_URL}/goals/detail/${goalId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch saving goal');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching saving goal with ID ${goalId}:`, error);
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
      const errorData = await response.json();
      throw new Error('Failed to add saving goal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in addSavingGoal:', error);
    throw error;
  }
};

export const deleteSavingGoal = async (goalId) => {
  try {
    const response = await fetch(`${API_URL}/goals/${goalId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete saving goal');
    }

    return { message: 'Saving goal deleted successfully' };
  } catch (error) {
    console.error(`Error deleting saving goal with ID ${goalId}:`, error);
    throw error;
  }
};

export const updateSavingGoal = async (goalId, goalData) => {
  try {
    const response = await fetch(`${API_URL}/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to update saving goal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating saving goal with ID ${goalId}:`, error);
    throw error;
  }
};
