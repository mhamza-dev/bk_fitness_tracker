import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, BorderRadius, FontWeight, Shadows } from '../styles';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, text
  size = 'medium', // small, medium, large
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]];

    if (variant === 'primary') {
      baseStyle.push(styles.buttonPrimary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.buttonSecondary);
    } else if (variant === 'outline') {
      baseStyle.push(styles.buttonOutline);
    } else if (variant === 'text') {
      baseStyle.push(styles.buttonText);
    }

    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }

    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];

    if (variant === 'primary') {
      baseStyle.push(styles.textPrimary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.textSecondary);
    } else if (variant === 'outline') {
      baseStyle.push(styles.textOutline);
    } else if (variant === 'text') {
      baseStyle.push(styles.textText);
    }

    if (size === 'small') {
      baseStyle.push(styles.textSmall);
    } else if (size === 'large') {
      baseStyle.push(styles.textLarge);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={Sizes.icon.s}
              color={
                variant === 'primary' || variant === 'secondary'
                  ? Colors.white
                  : Colors.primary
              }
              style={styles.iconLeft}
            />
          )}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={Sizes.icon.s}
              color={
                variant === 'primary' || variant === 'secondary'
                  ? Colors.white
                  : Colors.primary
              }
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.button.m,
    ...Shadows.medium,
  },
  buttonSmall: {
    height: Sizes.button.s,
    paddingHorizontal: Sizes.l,
  },
  buttonMedium: {
    height: Sizes.button.m,
    paddingHorizontal: Sizes.xl,
  },
  buttonLarge: {
    height: Sizes.button.l,
    paddingHorizontal: Sizes.xxl,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: Sizes.borderWidth.medium,
    borderColor: Colors.primary,
    ...Shadows.none,
  },
  buttonText: {
    backgroundColor: 'transparent',
    ...Shadows.none,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.bold,
  },
  textSmall: {
    fontSize: Sizes.fontSize.s,
  },
  textLarge: {
    fontSize: Sizes.fontSize.l,
  },
  textPrimary: {
    color: Colors.black,
  },
  textSecondary: {
    color: Colors.black,
  },
  textOutline: {
    color: Colors.primary,
  },
  textText: {
    color: Colors.primary,
  },
  iconLeft: {
    marginRight: Sizes.xs,
  },
  iconRight: {
    marginLeft: Sizes.xs,
  },
});

export default Button;

