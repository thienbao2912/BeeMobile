import * as SecureStore from 'expo-secure-store'; // Import SecureStore để lấy token

const API_URL = 'http://172.16.18.18:4000/api';

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
    throw error; // Re-throw the error after logging
  }
};

// Hàm lấy tất cả danh mục
export const fetchAllCategories = async () => {
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

// Hàm thêm giao dịch
export const addTransaction = async (transactionData) => {
  try {
    console.log(`Sending transaction data:`, transactionData);
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData), // Convert transaction data to JSON
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error; // Re-throw the error for handling elsewhere
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

// Hàm lấy một giao dịch theo ID
// export const fetchTransactionById = async (transactionId) => {
//   try {
//     const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Server Response:', errorData);
//       throw new Error(errorData.message || 'Failed to fetch transaction');
//     }

//     const data = await response.json();
//     return data; // Trả về giao dịch đã lấy
//   } catch (error) {
//     console.error('Error fetching transaction:', error);
//     throw error; // Ném lại lỗi cho việc xử lý sau này
//   }
// };
