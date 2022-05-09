import React from 'react';
import { View } from 'react-native';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';

import { FemaleIcon, MaleIcon } from 'src/assets/icons';
import { FALLBACK_IMAGE_URI } from 'src/constants/constants';
import { getCharacterImageUrl } from 'src/utils';
import { ImageFallback, Flex, Typography, RenderStat, Button } from 'src/components';
import { getCharacterById } from 'src/services/api/characters';
import { ScreenRoutes } from 'src/navigation/routes';
import { MainScreenNavigatorStack } from 'src/navigation/navigators/main-screen-navigator/types';

import { styles, CharacterWrapper } from './styles';

export const CharacterRenderer = ({ id }: { id: string }) => {
    const { data: character, isLoading } = useQuery([id, 'character'], getCharacterById);

    const navigation = useNavigation<MainScreenNavigatorStack>();

    const uri = getCharacterImageUrl(id);

    const dataList = [
        {
            title: 'Height',
            stat: character?.height,
            symbol: 'cm',
        },
        {
            title: 'Mass',
            stat: character?.mass,
            symbol: 'kg',
        },
        {
            title: 'Hair Color',
            stat: character?.hair_color,
        },
    ];

    const dataListRenderer = dataList.map(
        (item) =>
            item.stat && (
                <View key={item.title}>
                    <RenderStat textType="h3" stat={item.stat} title={item.title} symbol={item.symbol && item.symbol} />
                </View>
            ),
    );

    const navigateToCharacter = () => {
        navigation.navigate(ScreenRoutes.Character, { characterId: id });
    };

    return (
        <>
            {!isLoading && (
                <CharacterWrapper>
                    <Button onPress={navigateToCharacter}>
                        <ImageFallback
                            imageUri={uri}
                            style={styles.img}
                            resizeMode="cover"
                            fallbackStyles={styles.img}
                            fallbackUri={FALLBACK_IMAGE_URI}
                        />
                    </Button>
                    <Flex marginString="10px">
                        <Flex flexDirection="row" alignItems="center">
                            {character?.gender === 'female' ? (
                                <FemaleIcon width={20} height={20} />
                            ) : (
                                <MaleIcon width={20} height={20} />
                            )}
                            <Flex marginString="0 0 0 5px" width="70%">
                                <Typography type="bodyLarge">{character?.name}</Typography>
                            </Flex>
                        </Flex>
                        <Flex marginString="5px 0">{dataListRenderer}</Flex>
                    </Flex>
                </CharacterWrapper>
            )}
        </>
    );
};
