import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { fetchAllCategories } from '../../../services/Transaction';

const CategoryList = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setCategories(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          keyExtractor={(category) => category._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectCategory(item)}>
              <View style={styles.categoryContainer}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                  />
                )}
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noCategoriesText}>No categories found.</Text>
      )}
    </View>
  );
};

// Thêm styles cho hình ảnh và container
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  noCategoriesText: {
    textAlign: 'center',
    color: '#888',
  },
});

export default CategoryList;
