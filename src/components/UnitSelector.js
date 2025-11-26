/**
 * UnitSelector Component
 * Reusable unit selector component (e.g., kg/lbs, cm/ft)
 * Integrates with Formik
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useField } from 'formik';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';

const UnitSelector = ({
  label = 'Unit',
  name, // Formik field name
  options = [], // Array of unit strings or { label, value } objects
  containerStyle,
  width = 150,
  onChange, // Custom onChange handler (for unit conversion)
  // For non-Formik usage
  value: externalValue,
  onChange: externalOnChange,
  error: externalError,
  errorMessage: externalErrorMessage,
  ...props
}) => {
  // Use Formik if name is provided, otherwise use external props
  const [field, meta, helpers] = name ? useField(name) : [null, null, null];

  const fieldValue = name ? field.value : externalValue;
  const error = name ? meta.touched && meta.error : externalError;
  const errorMessage = name ? meta.error : externalErrorMessage;

  // Normalize options to { label, value } format
  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }
    return option;
  });

  const handleSelect = (value) => {
    // Call custom onChange first (for unit conversion) before updating Formik
    if (onChange) {
      onChange(value);
    } else if (name && helpers) {
      helpers.setValue(value);
      helpers.setTouched(true);
    }
    if (externalOnChange) {
      externalOnChange(value);
    }
  };

  return (
    <View style={[styles.container, { width }, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.unitButtons}>
        {normalizedOptions.map((option) => {
          const isSelected = fieldValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.unitButton,
                isSelected && styles.unitButtonActive,
                error && !isSelected && styles.unitButtonError,
              ]}
              onPress={() => handleSelect(option.value)}
              {...props}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  isSelected && styles.unitButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.l,
  },
  label: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Sizes.s,
  },
  unitButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
    overflow: 'hidden',
    height: Sizes.input.m,
    alignItems: 'stretch',
  },
  unitButton: {
    flex: 1,
    paddingHorizontal: Sizes.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitButtonActive: {
    backgroundColor: Colors.primary,
  },
  unitButtonError: {
    borderColor: Colors.error,
  },
  unitButtonText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  unitButtonTextActive: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  errorText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.error,
    marginTop: Sizes.xs,
  },
});

export default UnitSelector;

