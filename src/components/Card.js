import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Sizes, BorderRadius, Shadows } from '../styles';

const Card = ({
  children,
  variant = 'default', // default, outlined, elevated
  padding = 'medium', // none, small, medium, large
  style,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];

    if (variant === 'outlined') {
      baseStyle.push(styles.cardOutlined);
    } else if (variant === 'elevated') {
      baseStyle.push(styles.cardElevated);
    }

    if (padding === 'none') {
      baseStyle.push(styles.paddingNone);
    } else if (padding === 'small') {
      baseStyle.push(styles.paddingSmall);
    } else if (padding === 'medium') {
      baseStyle.push(styles.paddingMedium);
    } else if (padding === 'large') {
      baseStyle.push(styles.paddingLarge);
    }

    return baseStyle;
  };

  return (
    <View style={[...getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.card.m,
  },
  cardOutlined: {
    borderWidth: Sizes.borderWidth.thin,
    borderColor: Colors.border.light,
    ...Shadows.none,
  },
  cardElevated: {
    ...Shadows.medium,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Sizes.m,
  },
  paddingMedium: {
    padding: Sizes.l,
  },
  paddingLarge: {
    padding: Sizes.xl,
  },
});

export default Card;

