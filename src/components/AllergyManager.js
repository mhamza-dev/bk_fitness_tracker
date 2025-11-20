/**
 * Allergy Manager Component
 * Component for managing user allergies with add/remove functionality
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from './index';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import { ALLERGY_SEVERITIES } from '../constants/profileConstants';

export default function AllergyManager({ allergies, onUpdate }) {
    const [newAllergyName, setNewAllergyName] = useState('');
    const [newAllergySeverity, setNewAllergySeverity] = useState('moderate');
    const [newAllergyNotes, setNewAllergyNotes] = useState('');

    const handleAdd = () => {
        if (!newAllergyName.trim()) {
            Alert.alert('Error', 'Please enter an allergy name');
            return;
        }
        const newAllergy = {
            name: newAllergyName.trim(),
            severity: newAllergySeverity,
            notes: newAllergyNotes.trim() || undefined,
        };
        onUpdate([...allergies, newAllergy]);
        setNewAllergyName('');
        setNewAllergySeverity('moderate');
        setNewAllergyNotes('');
    };

    const handleRemove = (index) => {
        const updated = allergies.filter((_, i) => i !== index);
        onUpdate(updated);
    };

    return (
        <View style={styles.container}>
            {allergies.map((allergy, index) => (
                <View key={index} style={styles.item}>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemName}>
                            {typeof allergy === 'string' ? allergy : allergy.name}
                        </Text>
                        {typeof allergy === 'object' && allergy.severity && (
                            <Text style={styles.itemMeta}>
                                Severity: {allergy.severity}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => handleRemove(index)}
                        style={styles.removeButton}
                    >
                        <Ionicons name="close-circle" size={Sizes.icon.m} color={Colors.error} />
                    </TouchableOpacity>
                </View>
            ))}
            <View style={styles.addContainer}>
                <Input
                    value={newAllergyName}
                    onChangeText={setNewAllergyName}
                    placeholder="Allergy name"
                    containerStyle={styles.input}
                />
                <View style={styles.severityContainer}>
                    <Text style={styles.severityLabel}>Severity:</Text>
                    <View style={styles.severityButtons}>
                        {ALLERGY_SEVERITIES.map((severity) => (
                            <TouchableOpacity
                                key={severity}
                                style={[
                                    styles.severityButton,
                                    newAllergySeverity === severity && styles.severityButtonActive,
                                ]}
                                onPress={() => setNewAllergySeverity(severity)}
                            >
                                <Text
                                    style={[
                                        styles.severityButtonText,
                                        newAllergySeverity === severity && styles.severityButtonTextActive,
                                    ]}
                                >
                                    {severity}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <Input
                    value={newAllergyNotes}
                    onChangeText={setNewAllergyNotes}
                    placeholder="Notes (optional)"
                    containerStyle={styles.input}
                />
                <Button
                    title="Add Allergy"
                    onPress={handleAdd}
                    size="small"
                    variant="secondary"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Sizes.m,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Sizes.m,
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.m,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: Sizes.fontSize.m,
        fontWeight: FontWeight.semibold,
        color: Colors.text.primary,
        marginBottom: Sizes.xs / 2,
    },
    itemMeta: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
    },
    removeButton: {
        padding: Sizes.xs,
    },
    addContainer: {
        padding: Sizes.m,
        backgroundColor: Colors.background.secondary,
        borderRadius: BorderRadius.m,
        borderWidth: 1,
        borderColor: Colors.border.light,
        gap: Sizes.m,
    },
    input: {
        marginBottom: 0,
    },
    severityContainer: {
        gap: Sizes.s,
    },
    severityLabel: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
        fontWeight: FontWeight.medium,
    },
    severityButtons: {
        flexDirection: 'row',
        gap: Sizes.s,
    },
    severityButton: {
        paddingHorizontal: Sizes.m,
        paddingVertical: Sizes.s,
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.m,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    severityButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    severityButtonText: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
        fontWeight: FontWeight.medium,
    },
    severityButtonTextActive: {
        color: Colors.text.inverse,
        fontWeight: FontWeight.bold,
    },
});

