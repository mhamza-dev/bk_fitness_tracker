/**
 * DateInput Component
 * Reusable date/datetime/time input component with native picker
 * Integrates with Formik
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
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
  const [pendingDate, setPendingDate] = useState(null);

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

  // Handle date change - for iOS, we store the pending date and wait for confirmation
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        // For datetime mode on Android, handle directly
        if (mode === 'datetime') {
          const formattedValue = formatDate(selectedDate);
          if (name && helpers) {
            helpers.setValue(formattedValue);
            helpers.setTouched(true);
          }
          if (externalOnChange) {
            externalOnChange(formattedValue);
          }
          return;
        }

        const formattedValue = formatDate(selectedDate);
        if (name && helpers) {
          helpers.setValue(formattedValue);
          helpers.setTouched(true);
        }
        if (externalOnChange) {
          externalOnChange(formattedValue);
        }
      }
      return;
    }

    // For iOS, we update the pending date but don't commit until user confirms
    if (selectedDate) {
      setPendingDate(selectedDate);
    } else {
      // If no date selected, use current picker date
      setPendingDate(pickerDate);
    }
  };

  // Confirm date selection on iOS
  const handleConfirmDate = () => {
    // For datetime mode on iOS, store the date and show time picker
    if (mode === 'datetime' && Platform.OS === 'ios') {
      // Use pendingDate if available, otherwise use current pickerDate
      const dateToStore = pendingDate || pickerDate || dateValue;
      setTempDate(dateToStore);
      setPendingDate(null);
      setShowPicker(false);
      // Small delay to ensure state updates before showing time picker
      setTimeout(() => {
        setShowTimePicker(true);
      }, 100);
      return;
    }

    // For date mode, commit the selection
    const dateToCommit = pendingDate || pickerDate || dateValue;
    if (dateToCommit) {
      const formattedValue = formatDate(dateToCommit);

      if (name && helpers) {
        helpers.setValue(formattedValue);
        helpers.setTouched(true);
      }
      if (externalOnChange) {
        externalOnChange(formattedValue);
      }

      setPendingDate(null);
      setShowPicker(false);
    }
  };

  // Cancel date selection on iOS
  const handleCancelDate = () => {
    setPendingDate(null);
    setShowPicker(false);
  };

  // Handle time change for datetime mode
  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type === 'set' && selectedTime) {
        const currentDateValue = getDateValue();
        const dateToUse = tempDate || currentDateValue;
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

        setTempDate(null);
      }
      return;
    }

    // For iOS, update pending time
    if (selectedTime) {
      const currentDateValue = getDateValue();
      const dateToUse = tempDate || currentDateValue;
      const combinedDate = new Date(dateToUse);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());
      setPendingDate(combinedDate);
    }
  };

  // Confirm time selection on iOS
  const handleConfirmTime = () => {
    if (pendingDate) {
      const formattedValue = formatDate(pendingDate);

      if (name && helpers) {
        helpers.setValue(formattedValue);
        helpers.setTouched(true);
      }
      if (externalOnChange) {
        externalOnChange(formattedValue);
      }

      setPendingDate(null);
      setTempDate(null);
      setShowTimePicker(false);
    }
  };

  // Cancel time selection on iOS
  const handleCancelTime = () => {
    setPendingDate(null);
    setTempDate(null);
    setShowTimePicker(false);
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
  const pickerDate = pendingDate || tempDate || dateValue;

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

      {/* Android Date Picker */}
      {showPicker && Platform.OS === 'android' && mode !== 'datetime' && (
        <DateTimePicker
          value={dateValue}
          mode={mode}
          display="default"
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

      {/* iOS Date Picker with Modal and Confirm/Cancel */}
      {showPicker && Platform.OS === 'ios' && mode !== 'datetime' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={handleCancelDate}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={pickerDate}
                  mode={mode}
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  textColor={Colors.text.secondary}
                  accentColor={Colors.primary}
                  themeVariant="dark"
                  style={styles.picker}
                  {...props}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={handleCancelDate}
                >
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={handleConfirmDate}
                >
                  <Text style={styles.modalButtonConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {showPicker && mode === 'datetime' && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={handleCancelDate}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  textColor={Colors.text.secondary}
                  accentColor={Colors.primary}
                  themeVariant="dark"
                  style={styles.picker}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={handleCancelDate}
                >
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={handleConfirmDate}
                >
                  <Text style={styles.modalButtonConfirmText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {showTimePicker && mode === 'datetime' && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showTimePicker}
          onRequestClose={handleCancelTime}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={pendingDate || tempDate || getDateValue()}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor={Colors.text.secondary}
                  accentColor={Colors.primary}
                  themeVariant="dark"
                  style={styles.picker}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={handleCancelTime}
                >
                  <Text style={styles.modalButtonCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={handleConfirmTime}
                >
                  <Text style={styles.modalButtonConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.l,
    paddingBottom: Sizes.l,
    paddingTop: Sizes.l,
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pickerContainer: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
    paddingVertical: Sizes.m,
    marginHorizontal: Sizes.m,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 220,
  },
  picker: {
    backgroundColor: 'transparent',
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.l,
    paddingTop: Sizes.m,
    gap: Sizes.m,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: Sizes.m,
    paddingHorizontal: Sizes.l,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: Sizes.m,
    paddingHorizontal: Sizes.l,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancelText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  modalButtonConfirmText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.black,
    fontWeight: FontWeight.bold,
  },
});

export default DateInput;

