import * as SecureStore from 'expo-secure-store';

const API_URL = 'http:///10.0.2.2:4000/api';

// Hàm lấy tất cả ngân sách
export const fetchAllBudgets = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/budgets/budgets?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch budgets for the user');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching budgets for user ${userId}:`, error);
        throw error;
    }
};

// Hàm lấy ngân sách theo ID
export const fetchBudgetById = async (budgetId) => {
    try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        const response = await fetch(`${API_URL}/budgets/${budgetId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server Response:', errorData);
            throw new Error(errorData.message || 'Failed to fetch budget');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching budget by ID:', error);
        throw error;
    }
};

// Hàm tạo ngân sách mới
export const addBudget = async (budgetData) => {
    try {
        const response = await fetch(`${API_URL}/budgets/budget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(budgetData),
        });

        // Kiểm tra nếu phản hồi không thành công
        if (!response.ok) {
            const errorData = await response.json();  // Lấy thông tin lỗi từ response
            console.error('Error data:', errorData);  // Log thông tin lỗi chi tiết
            throw new Error(errorData.message || 'Failed to add budget');
        }

        // Nếu thành công, lấy dữ liệu trả về từ server
        const data = await response.json();
        console.log('Budget added successfully:', data);  // Log thông tin thành công
        return data;

    } catch (error) {
        console.error('Error in addBudget:', error);
        throw error;  // Ném lỗi ra ngoài để có thể xử lý ở các nơi gọi hàm
    }
};

export const updateBudget = async (budgetId, updateData) => {
    try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/budgets/${budgetId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server Response:', errorData);
            throw new Error(errorData.message || 'Failed to update budget');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating budget:', error);
        throw error;
    }
};

// Hàm xóa ngân sách
export const deleteBudget = async (budgetId) => {
    try {
        const response = await fetch(`${API_URL}/budgets/${budgetId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete budget');
        }

        return { message: 'Budget deleted successfully' };
    } catch (error) {
        console.error(`Error deleting budget with ID ${budgetId}:`, error);
        throw error;
    }
};


// Hàm lấy danh sách các danh mục
export const getCategories = async () => {
    try {
        // Lấy token từ SecureStore
        const token = await SecureStore.getItemAsync('token'); // Lấy token từ SecureStore
        console.log('Token:', token); // Kiểm tra giá trị token
        if (!token) {
            throw new Error('No authentication token found');
        }
        const response = await fetch(`${API_URL}/v2/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
            console.error('Server Response:', errorData); // Ghi lại phản hồi từ server
            throw new Error(errorData.message || 'Failed to fetch categories');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error; // Ném lại lỗi sau khi ghi
    }
};

// Hàm lấy danh sách chi phí cho ngân sách
export const getExpensesForBudget = async (budgetId) => {
    try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/budgets/${budgetId}/expenses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server Response:', errorData);
            throw new Error(errorData.message || 'Failed to fetch expenses for budget');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching expenses for budget:', error);
        throw error;
    }
};

// Export tất cả các hàm dưới dạng object
const BudgetService = {
    fetchAllBudgets,
    fetchBudgetById,
    addBudget,
    updateBudget,
    deleteBudget,
    getCategories,
    getExpensesForBudget,
};

export default BudgetService;
