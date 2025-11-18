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
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: Sizes.s,
    },
    logo: {
        width: Sizes.image.xxs,
        height: Sizes.image.xxs,
    },
});

export default HeaderLogo;

