import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function StarRating({ rating, maxStars = 5 }) {
  const renderStars = () => {
    let stars = '';
    for (let i = 1; i <= maxStars; i++) {
      stars += i <= rating ? '⭐' : '☆';
    }
    return stars;
  };

  return <Text style={styles.stars}>{renderStars()}</Text>;
}

const styles = StyleSheet.create({
  stars: {
    fontSize: 14,
    marginTop: 4,
  },
});