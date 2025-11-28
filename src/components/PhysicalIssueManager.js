/**
 * Physical Issue Manager Component
 * Component for managing user physical issues with add/remove functionality
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
import Input from './Input';
import Button from './Button';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import { PHYSICAL_ISSUE_TYPES } from '../constants/profileConstants';

export default function PhysicalIssueManager({ physicalIssues, onUpdate }) {
    const [newIssueName, setNewIssueName] = useState('');
    const [newIssueType, setNewIssueType] = useState('condition');
    const [newIssueNotes, setNewIssueNotes] = useState('');

    const handleAdd = () => {
        if (!newIssueName.trim()) {
            Alert.alert('Error', 'Please enter a physical issue name');
            return;
        }
        const newIssue = {
            name: newIssueName.trim(),
            type: newIssueType,
            notes: newIssueNotes.trim() || undefined,
        };
        onUpdate([...physicalIssues, newIssue]);
        setNewIssueName('');
        setNewIssueType('condition');
        setNewIssueNotes('');
    };

    const handleRemove = (index) => {
        const updated = physicalIssues.filter((_, i) => i !== index);
        onUpdate(updated);
    };

    return (
        <View style={styles.container}>
            {physicalIssues.map((issue, index) => (
                <View key={index} style={styles.item}>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemName}>
                            {typeof issue === 'string' ? issue : issue.name}
                        </Text>
                        {typeof issue === 'object' && issue.type && (
                            <Text style={styles.itemMeta}>
                                Type: {issue.type}
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
                    value={newIssueName}
                    onChangeText={setNewIssueName}
                    placeholder="Physical issue name"
                    containerStyle={styles.input}
                />
                <View style={styles.typeContainer}>
                    <Text style={styles.typeLabel}>Type:</Text>
                    <View style={styles.typeButtons}>
                        {PHYSICAL_ISSUE_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeButton,
                                    newIssueType === type && styles.typeButtonActive,
                                ]}
                                onPress={() => setNewIssueType(type)}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        newIssueType === type && styles.typeButtonTextActive,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <Input
                    value={newIssueNotes}
                    onChangeText={setNewIssueNotes}
                    placeholder="Notes (optional)"
                    containerStyle={styles.input}
                />
                <Button
                    title="Add Physical Issue"
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
    typeContainer: {
        gap: Sizes.s,
    },
    typeLabel: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
        fontWeight: FontWeight.medium,
    },
    typeButtons: {
        flexDirection: 'row',
        gap: Sizes.s,
    },
    typeButton: {
        paddingHorizontal: Sizes.m,
        paddingVertical: Sizes.s,
        backgroundColor: Colors.background.tertiary,
        borderRadius: BorderRadius.m,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    typeButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeButtonText: {
        fontSize: Sizes.fontSize.s,
        color: Colors.text.secondary,
        fontWeight: FontWeight.medium,
    },
    typeButtonTextActive: {
        color: Colors.text.inverse,
        fontWeight: FontWeight.bold,
    },
});

