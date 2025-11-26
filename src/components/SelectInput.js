/**
 * SelectInput Component
 * Reusable single-select input component with options
 * Integrates with Formik
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useField } from 'formik';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';

const SelectInput = ({
  label,
  name, // Formik field name
  options = [], // Array of { label, value } objects
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
  const error = name ? meta.touched && meta.error : externalError;
  const errorMessage = name ? meta.error : externalErrorMessage;

  const handleSelect = (value) => {
    if (name && helpers) {
      helpers.setValue(value);
      helpers.setTouched(true);
    }
    if (externalOnChange) {
      externalOnChange(value);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.selectContainer}>
        {options.map((option) => {
          const isSelected = fieldValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.selectOption,
                isSelected && styles.selectOptionActive,
                error && !isSelected && styles.selectOptionError,
              ]}
              onPress={() => handleSelect(option.value)}
              {...props}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  isSelected && styles.selectOptionTextActive,
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
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.s,
  },
  selectOption: {
    paddingHorizontal: Sizes.l,
    paddingVertical: Sizes.m,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  selectOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectOptionError: {
    borderColor: Colors.error,
  },
  selectOptionText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  selectOptionTextActive: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  errorText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.error,
    marginTop: Sizes.xs,
  },
});

export default SelectInput;

