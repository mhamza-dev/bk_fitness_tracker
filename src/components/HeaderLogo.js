import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Sizes } from '../styles';

const HeaderLogo = ({ style, logoStyle = {} }) => {
    return (
        <View style={[styles.container, style]}>
            <Image
                source={require('../../assets/bkf_logo.png')}
                style={[styles.logo, logoStyle]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: Sizes.m,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: Sizes.headerLogo.width,
        height: Sizes.headerLogo.height,
    },
});

export default HeaderLogo;

