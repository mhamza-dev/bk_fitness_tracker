import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useField } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, BorderRadius, FontWeight } from '../styles';

const Input = ({
  label,
  placeholder,
  name, // Formik field name
  icon,
  iconPosition = 'left',
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  containerStyle,
  // For non-Formik usage
  value: externalValue,
  onChangeText: externalOnChangeText,
  error: externalError,
  errorMessage: externalErrorMessage,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  // Use Formik if name is provided, otherwise use external props
  const [field, meta, helpers] = name ? useField(name) : [null, null, null];

  const value = name ? field.value : externalValue;
  const onChangeText = name ? helpers.setValue : externalOnChangeText;
  const error = name ? meta.touched && meta.error : externalError;
  const errorMessage = name ? meta.error : externalErrorMessage;

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
    if (onTogglePassword) {
      onTogglePassword(!isPasswordVisible);
    }
  };

  const handleBlur = (e) => {
    if (name && field) {
      field.onBlur(e);
    }
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
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
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={handleTogglePassword} style={styles.eyeIcon}>
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={Sizes.icon.m}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon}
            size={Sizes.icon.m}
            color={error ? Colors.error : Colors.text.secondary}
            style={styles.iconRight}
          />
        )}
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
  input: {
    flex: 1,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
    padding: 0,
  },
  inputMultiline: {
    minHeight: Sizes.input.l,
    paddingVertical: Sizes.m,
    textAlignVertical: 'top',
  },
  iconLeft: {
    marginRight: Sizes.m,
  },
  iconRight: {
    marginLeft: Sizes.m,
  },
  eyeIcon: {
    padding: Sizes.xs,
    marginLeft: Sizes.xs,
  },
  errorText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.error,
    marginTop: Sizes.xs,
  },
});

export default Input;

