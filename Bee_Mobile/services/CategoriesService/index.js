import * as SecureStore from 'expo-secure-store';
const API_URL = "http://172.16.30.124:4000/api";

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

export const fetchAllCategoriesByUser = async (userId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const url = `${API_URL}/v2/categories/?userId=${userId}`;
    // console.log(`Fetching categories for user at URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server Response:', errorData);
      throw new Error(errorData.message || 'Failed to fetch categories for the user');
    }

    const data = await response.json();
    // 

    return data;
  } catch (error) {
    console.error(`Error fetching categories for user ${userId}:`, error.message);
    throw error;
  }
};


  export const fetchCategoryById = async (cateId) => {
    try {
      const response = await fetch(`${API_URL}/category/detail/${cateId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching saving goal with ID ${cateId}:`, error);
      throw error;
    }
  };

  // Hàm thêm danh mục
export const addCategory = async (categoryData) => {
  
  
  try {
    const token = await SecureStore.getItemAsync('token');
    console.log(`Sending category data:`, categoryData); // In ra dữ liệu gửi đi để kiểm tra
    const response = await fetch(`${API_URL}/v2/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Đảm bảo headers định dạng JSON
       'x-auth-token': token,
      },
      body: JSON.stringify(categoryData), // Chuyển đổi dữ liệu thành chuỗi JSON
    });
    return await response.json(); // Chuyển đổi phản hồi thành JSON
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    throw error;
  }
};

  

  export const updateCategory = async (cateId, cateData) => {
    try {
      const response = await fetch(`${API_URL}/category/${cateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Failed to update Category');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating Category with ID ${cateId}:`, error);
      throw error;
    }
  };
  export const deleteCategory = async (cateId) => {
    try {
      const response = await fetch(`${API_URL}/category/delete/${cateId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete Category');
      }
  
      return { message: 'Category deleted successfully' };
    } catch (error) {
      console.error(`Error deleting Category with ID ${goalId}:`, error);
      throw error;
    }
  };
  