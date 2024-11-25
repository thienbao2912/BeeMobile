import * as SecureStore from 'expo-secure-store'; // Import SecureStore để lấy token

const API_URL = 'http://192.168.10.45:4000/api';

// Hàm lấy tất cả giao dịch
export const fetchAllTransactions = async () => {
  try {
    const response = await fetch(`${API_URL}/transactions`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error; 
  }
};



export const getCategoryById = async (categoryId) => {
  try {
    // Lấy token từ SecureStore
    const token = await SecureStore.getItemAsync('token');
    // console.log('Token:', token); 

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/v2/categories/${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
      console.error('Server Response:', errorData); // Ghi lại phản hồi từ server
      throw new Error(errorData.message || 'Failed to fetch category');
    }

    const data = await response.json();
    return data; // Trả về dữ liệu danh mục đã lấy
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error; // Ném lại lỗi sau khi ghi
  }
};


// Hàm lấy tất cả danh mục
export const fetchAllCategories = async () => {
  try {
    // Lấy token từ SecureStore
    const token = await SecureStore.getItemAsync('token'); // Lấy token từ SecureStore
    // console.log('Token:', token); 
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
      const errorData = await response.json(); 
      console.error('Server Response:', errorData);
      throw new Error(errorData.message || 'Failed to fetch categories');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; 
  }
};

// Hàm thêm giao dịch
export const addTransaction = async (transactionData) => {
  try {
    console.log(`Sending transaction data:`, transactionData);
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData), 
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error; 
  }
};

// Hàm xóa giao dịch
export const deleteTransaction = async (transactionId) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server Response:', errorData);
      throw new Error(errorData.message || 'Failed to delete transaction');
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error; 
  }
};

// Hàm lấy giao dịch theo ID
export const fetchTransactionById = async (transactionId, userId) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${transactionId}?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();  // Lấy phản hồi dưới dạng text
      console.error('Server Error Response:', text);

      try {
        const errorData = JSON.parse(text);  // Thử chuyển đổi sang JSON
        throw new Error(errorData.message || 'Failed to fetch transaction');
      } catch (parseError) {
        throw new Error('Server returned non-JSON response');
      }
    }

    const data = await response.json();  // Chuyển đổi thành JSON nếu có thể
    return data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

// Hàm chỉnh sửa giao dịch
export const editTransaction = async (transactionId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const text = await response.text();  // Lấy phản hồi dưới dạng text
      console.error('Server Error Response:', text);

      try {
        const errorData = JSON.parse(text);  // Thử chuyển đổi sang JSON
        throw new Error(errorData.message || 'Failed to update transaction');
      } catch (parseError) {
        throw new Error('Server returned non-JSON response');
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};
