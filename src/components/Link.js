import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Sizes, FontWeight } from '../styles';

const Link = ({
  text,
  onPress,
  variant = 'primary', // primary, secondary
  size = 'medium', // small, medium, large
  underline = false,
  style,
  textStyle,
  ...props
}) => {
  const getTextStyle = () => {
    const baseStyle = [styles.text];

    if (variant === 'primary') {
      baseStyle.push(styles.textPrimary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.textSecondary);
    }

    if (size === 'small') {
      baseStyle.push(styles.textSmall);
    } else if (size === 'large') {
      baseStyle.push(styles.textLarge);
    }

    if (underline) {
      baseStyle.push(styles.textUnderline);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} {...props}>
      <Text style={[...getTextStyle(), textStyle, style]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.medium,
  },
  textSmall: {
    fontSize: Sizes.fontSize.s,
  },
  textLarge: {
    fontSize: Sizes.fontSize.l,
  },
  textPrimary: {
    color: Colors.primary,
  },
  textSecondary: {
    color: Colors.text.secondary,
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
});

export default Link;

