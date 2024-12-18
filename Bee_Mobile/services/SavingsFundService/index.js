const API_URL = 'http://192.168.1.13:4000/api'; // Đảm bảo đúng port của backend

import * as SecureStore from 'expo-secure-store';

// Service gọi API để lấy danh sách savings fund của người dùng
export const fetchAllSavingFund = async () => {
  try {
    // Lấy userId từ SecureStore (hoặc localStorage nếu bạn đang dùng trên web)
    const userId = await SecureStore.getItemAsync('userId');
    if (!userId) {
      throw new Error("User ID is missing");
    }

    const token = await SecureStore.getItemAsync('token'); // Lấy token từ SecureStore
console.log("Token: ", token);
    // Gửi yêu cầu GET tới API với token xác thực
    const response = await fetch(`${API_URL}/savingsFund/user-goals`, {
      method: 'GET',
      headers: {
        'x-auth-token': token, // Gửi token trong header
        'Content-Type': 'application/json',
      },
    });

    // Kiểm tra nếu phản hồi không thành công
    if (!response.ok) {
      throw new Error('Failed to fetch savings goals');
    }

    // Trả về dữ liệu JSON
    const data = await response.json();
    return data;  // Dữ liệu sẽ là danh sách savings fund
  } catch (error) {
    console.error('Error fetching savings funds:', error);
    throw error;  // Ném lỗi để frontend có thể xử lý
  }
};


export const addSavingsFund = async (fundData) => {
  try {
    // Lấy token từ SecureStore
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    // Gửi yêu cầu POST đến API
    const response = await fetch(`${API_URL}/savingsFund/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token, // Token xác thực
      },
      body: JSON.stringify(fundData), // Gửi dữ liệu quỹ mới
    });

    // Kiểm tra phản hồi
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create savings fund');
    }

    // Trả về dữ liệu từ phản hồi
    const data = await response.json();
    return data; // Trả về quỹ mới được tạo
  } catch (error) {
    console.error('Error in addSavingsFund:', error);
    throw error; // Ném lỗi để frontend xử lý
  }
};

export const fetchAllCategories = async () => {
  try {
    // Lấy token từ SecureStore
    const token = await SecureStore.getItemAsync('token'); 
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
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
      console.error('Server Response:', errorData); // Ghi lại phản hồi từ serverthrow new Error(errorData.message || 'Failed to fetch categories');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; 
  }
};


export const fetchSavingFundById = async (fundId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`${API_URL}/savingsFund/${fundId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token, // Nếu dùng token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saving fund');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching saving fund with ID ${fundId}:`, error);
    throw error;
  }
};

export const addTransaction = async (fundId, transactionData) => {
  try {
    // Lấy token từ SecureStore
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    // Gửi request đến API
    const response = await fetch(`${API_URL}/savingsFund/contribute/${fundId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify(transactionData),
    });

    // Kiểm tra phản hồi
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add transaction');
    }

    // Lấy dữ liệu từ phản hồi
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in addTransaction:', error);
    throw error;
  }
};

export const fetchMember = async (fundId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`${API_URL}/savingsFund/${fundId}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token, // Nếu dùng token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saving fund');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching saving fund with ID ${fundId}:`, error);
    throw error;
  }
};

export const fetchTransaction = async (fundId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`${API_URL}/savingsFund/${fundId}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token, // Nếu dùng token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saving fund');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching saving fund with ID ${fundId}:`, error);throw error;
}
};

export const sendInvitation = async (fundId, email) => {
try {
  const token = await SecureStore.getItemAsync('token');
  const response = await fetch(`${API_URL}/fund/send-invite-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token, 
    },
    body: JSON.stringify({ fundId, email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send invitation.");
  }
  return data;
} catch (error) {
  throw new Error(error.message || "Something went wrong.");
}
};

// Service gọi API để chấp nhận mã xác nhận tham gia quỹ
export const acceptInvite = async (code) => {
try {
  const token = await SecureStore.getItemAsync('token');
  if (!token) {
    throw new Error('Authentication token is missing.');
  }

  // Gửi yêu cầu POST đến API với mã xác nhận và token xác thực
  const response = await fetch(`${API_URL}/fund/accept-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to accept the invite');
  }

  // Trả về dữ liệu từ phản hồi (có thể là thông báo thành công hoặc dữ liệu quỹ)
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error accepting invite:', error);
  throw error;
}
};