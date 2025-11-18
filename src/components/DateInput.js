/**
 * DateInput Component
 * Reusable date/datetime/time input component with native picker
 * Integrates with Formik
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useField } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';
import moment from 'moment';

const DateInput = ({
  label,
  placeholder,
  name, // Formik field name
  icon,
  iconPosition = 'left',
  mode = 'date', // 'date', 'datetime', 'time'
  format, // Custom format string (e.g., 'YYYY-MM-DD')
  minimumDate,
  maximumDate,
  editable = true,
  style,
  containerStyle,
  // For non-Formik usage
  value: externalValue,
  onChange: externalOnChange,
  error: externalError,
  errorMessage: externalErrorMessage,
  ...props
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  // Use Formik if name is provided, otherwise use external props
  const [field, meta, helpers] = name ? useField(name) : [null, null, null];

  const fieldValue = name ? field.value : externalValue;
  const error = name ? meta.touched && meta.error : externalError;
  const errorMessage = name ? meta.error : externalErrorMessage;

  // Parse the value to a Date object
  const getDateValue = () => {
    if (!fieldValue) return new Date();
    if (fieldValue instanceof Date) return fieldValue;
    if (typeof fieldValue === 'string') {
      const parsed = moment(fieldValue).toDate();
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  };

  // Format the date for display
  const getDisplayValue = () => {
    if (!fieldValue) return '';
    if (fieldValue instanceof Date) {
      return formatDate(fieldValue);
    }
    if (typeof fieldValue === 'string') {
      const date = moment(fieldValue).toDate();
      if (isNaN(date.getTime())) return fieldValue; // Return as-is if not a valid date
      return formatDate(date);
    }
    return String(fieldValue);
  };

  // Format date based on mode
  const formatDate = (date) => {
    if (format) {
      return moment(date).format(format);
    }
    switch (mode) {
      case 'date':
        return moment(date).format('YYYY-MM-DD');
      case 'datetime':
        return moment(date).format('YYYY-MM-DD HH:mm');
      case 'time':
        return moment(date).format('HH:mm');
      default:
        return moment(date).format('YYYY-MM-DD');
    }
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      // For datetime mode on iOS, store the date and show time picker
      if (mode === 'datetime' && Platform.OS === 'ios') {
        setTempDate(selectedDate);
        setShowPicker(false);
        setShowTimePicker(true);
        return;
      }
      
      // For Android datetime mode, the picker returns the full datetime
      const formattedValue = formatDate(selectedDate);
      
      if (name && helpers) {
        helpers.setValue(formattedValue);
        helpers.setTouched(true);
      }
      if (externalOnChange) {
        externalOnChange(formattedValue);
      }
      
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  // Handle time change for datetime mode
  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'set' && selectedTime) {
      const dateToUse = tempDate || dateValue;
      const combinedDate = new Date(dateToUse);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      
      const formattedValue = formatDate(combinedDate);
      
      if (name && helpers) {
        helpers.setValue(formattedValue);
        helpers.setTouched(true);
      }
      if (externalOnChange) {
        externalOnChange(formattedValue);
      }
      
      setShowTimePicker(false);
      setTempDate(null);
    } else if (event.type === 'dismissed') {
      setShowTimePicker(false);
      setTempDate(null);
    }
  };

  // Handle press to show picker
  const handlePress = () => {
    if (editable) {
      if (Platform.OS === 'ios') {
        setShowPicker(true);
      } else {
        // Android shows picker immediately
        setShowPicker(true);
      }
    }
  };

  const displayValue = getDisplayValue();
  const dateValue = getDateValue();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        onPress={handlePress}
        disabled={!editable}
        activeOpacity={editable ? 0.7 : 1}
      >
        <View
          style={[
            styles.inputContainer,
            error && styles.inputContainerError,
            !editable && styles.inputContainerDisabled,
            style,
          ]}
        >
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={Sizes.icon.m}
              color={error ? Colors.error : Colors.text.secondary}
              style={styles.iconLeft}
            />
          )}
          <View style={styles.inputWrapper}>
            <Text
              style={[
                styles.inputText,
                !displayValue && styles.placeholderText,
              ]}
            >
              {displayValue || placeholder || 'Select date'}
            </Text>
          </View>
          <Ionicons
            name="calendar-outline"
            size={Sizes.icon.m}
            color={error ? Colors.error : Colors.text.secondary}
            style={styles.iconRight}
          />
        </View>
      </TouchableOpacity>
      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      {showPicker && mode !== 'datetime' && (
        <DateTimePicker
          value={dateValue}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          {...props}
        />
      )}
      {showPicker && mode === 'datetime' && Platform.OS === 'android' && (
        <DateTimePicker
          value={dateValue}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
      {showPicker && mode === 'datetime' && Platform.OS === 'ios' && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
      {showTimePicker && mode === 'datetime' && Platform.OS === 'ios' && (
        <DateTimePicker
          value={tempDate || dateValue}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
        />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.input.m,
    borderWidth: Sizes.borderWidth.thin,
    borderColor: Colors.border.light,
    paddingHorizontal: Sizes.l,
    height: Sizes.input.m,
    minHeight: Sizes.input.m,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  inputContainerDisabled: {
    opacity: 0.6,
    backgroundColor: Colors.background.tertiary,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
  },
  placeholderText: {
    color: Colors.text.tertiary,
  },
  iconLeft: {
    marginRight: Sizes.m,
  },
  iconRight: {
    marginLeft: Sizes.m,
  },
  errorText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.error,
    marginTop: Sizes.xs,
  },
});

export default DateInput;

