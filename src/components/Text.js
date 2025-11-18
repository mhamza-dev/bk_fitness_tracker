import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { Colors, Sizes, FontWeight } from '../styles';

const Text = ({
  children,
  variant = 'body', // heading, subheading, body, caption, label
  size, // Override default size
  color,
  weight,
  align = 'left', // left, center, right
  style,
  ...props
}) => {
  const getTextStyle = () => {
    const baseStyle = [styles.text];

    // Variant styles
    if (variant === 'heading') {
      baseStyle.push(styles.heading);
    } else if (variant === 'subheading') {
      baseStyle.push(styles.subheading);
    } else if (variant === 'body') {
      baseStyle.push(styles.body);
    } else if (variant === 'caption') {
      baseStyle.push(styles.caption);
    } else if (variant === 'label') {
      baseStyle.push(styles.label);
    }

    // Size override
    if (size) {
      baseStyle.push({ fontSize: size });
    }

    // Color override
    if (color) {
      baseStyle.push({ color });
    }

    // Weight override
    if (weight) {
      baseStyle.push({ fontWeight: weight });
    }

    // Alignment
    if (align === 'center') {
      baseStyle.push(styles.center);
    } else if (align === 'right') {
      baseStyle.push(styles.right);
    }

    return baseStyle;
  };

  return (
    <RNText style={[...getTextStyle(), style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text.primary,
  },
  heading: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  subheading: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  body: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.normal,
    color: Colors.text.primary,
  },
  caption: {
    fontSize: Sizes.fontSize.s,
    fontWeight: FontWeight.normal,
    color: Colors.text.secondary,
  },
  label: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});

export default Text;

