import * as SecureStore from 'expo-secure-store';
const API_URL = "http://192.168.1.13:4000/api";

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

  

export const updateCategory = async (cateId, updateData) => {
  const token = await SecureStore.getItemAsync('token');
  
  try {
    const response = await fetch(`${API_URL}/v2/categories/${cateId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
       'x-auth-token': token,

      },
      body: JSON.stringify(updateData),
    });
    console.log("Cate ID:", cateId);
    const text = await response.text(); // Đọc toàn bộ phản hồi

    if (!response.ok) {
      console.error('Server Response:', text); // Log lại phản hồi server
      try {
        const errorData = JSON.parse(text); // Thử parse JSON
        throw new Error(errorData.message || 'Failed to update category');
      } catch (parseError) {
        throw new Error(`Server returned non-JSON response: ${text}`); // Phản hồi không phải JSON
      }
    }

    return JSON.parse(text); // Trả JSON nếu có
  } catch (error) {
    console.error(`Error updating category with ID ${cateId}:`, error);
    throw error;
  }
};


export const deleteCategory = async (cateId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`${API_URL}/v2/categories/${cateId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server Response:', errorData);
      if (errorData.message === "Danh mục đang được sử dụng") {
        // Thông báo nếu danh mục đang được sử dụng
        throw new Error("Danh mục đang được sử dụng và không thể xóa");
      }
      throw new Error(errorData.message || 'Failed to delete Category');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting Category with ID ${cateId}:`, error);
    throw error;
  }
};
export const checkCategoryInUse = async (cateId) => {
  try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${API_URL}/v2/categories/check/${cateId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token,
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to check category usage');
      }

      return await response.json(); // Giả sử API trả về một thông báo về việc sử dụng danh mục
  } catch (error) {
      console.error(`Error checking if category with ID ${cateId} is in use:`, error);
      throw error;
  }
};

  