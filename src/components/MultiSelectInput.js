/**
 * MultiSelectInput Component
 * Reusable multi-select input component with checkboxes
 * Integrates with Formik
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useField } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';

const MultiSelectInput = ({
  label,
  name, // Formik field name
  options = [], // Array of { label, value } objects
  exclusiveValue, // Value that should be exclusive (e.g., 'none' for dietary preferences)
  containerStyle,
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
  const currentValues = Array.isArray(fieldValue) ? fieldValue : [];

  const error = name ? meta.touched && meta.error : externalError;
  const errorMessage = name ? meta.error : externalErrorMessage;

  const handleToggle = (optionValue) => {
    const isSelected = currentValues.includes(optionValue);
    let newValues;

    if (isSelected) {
      // Remove the value
      newValues = currentValues.filter(v => v !== optionValue);
    } else {
      // Add the value
      if (exclusiveValue && optionValue === exclusiveValue) {
        // If this is an exclusive value (e.g., 'none'), replace all with just this value
        newValues = [exclusiveValue];
      } else {
        // Remove exclusive value if it exists, then add the new value
        const filtered = currentValues.filter(v => v !== exclusiveValue);
        newValues = [...filtered, optionValue];
      }
    }

    if (name && helpers) {
      helpers.setValue(newValues);
      helpers.setTouched(true);
    }
    if (externalOnChange) {
      externalOnChange(newValues);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.multiSelectContainer}>
        {options.map((option) => {
          const isSelected = currentValues.includes(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.multiSelectOption,
                isSelected && styles.multiSelectOptionActive,
                error && !isSelected && styles.multiSelectOptionError,
              ]}
              onPress={() => handleToggle(option.value)}
              {...props}
            >
              <Ionicons
                name={isSelected ? 'checkbox' : 'checkbox-outline'}
                size={Sizes.icon.m}
                color={isSelected ? Colors.text.inverse : Colors.text.secondary}
              />
              <Text
                style={[
                  styles.multiSelectOptionText,
                  isSelected && styles.multiSelectOptionTextActive,
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
  multiSelectContainer: {
    gap: Sizes.s,
  },
  multiSelectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.m,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  multiSelectOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  multiSelectOptionError: {
    borderColor: Colors.error,
  },
  multiSelectOptionText: {
    marginLeft: Sizes.m,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  multiSelectOptionTextActive: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  errorText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.error,
    marginTop: Sizes.xs,
  },
});

export default MultiSelectInput;

