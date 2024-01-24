import { useCallback, useRef } from 'react';
import { Image, FlatList, View, StatusBar, Dimensions, StyleSheet, Platform, SafeAreaView, Animated, Text } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const ITEM_WIDTH = width;
const ITEM_HEIGHT = height * 0.75;
const DOT_SIZE = 8;
const DOT_SPACE = 8;
const DOT_INDICATOR_SIZE = DOT_SIZE + DOT_SPACE;
const SHEET_BORDER_RADIUS = 8;

const images = [
   'https://www.letu.ru/common/img/pim/2023/10/EX_35b3fb23-c97b-414a-ace6-63715c2e674d.jpg',
   'https://www.letu.ru/common/img/pim/2023/10/AUX_8f752ffb-ec8a-4d40-8a15-5cad9650f3ba.jpg',
   'https://perfume168.com/wp-content/uploads/2020/05/kdsjfoiejhfiow-scaled.jpg',
   'https://www.letu.ru/common/img/pim/2023/10/AUX_e0b655b2-0712-4208-af4d-b2f13dfb0183.jpg',
   // 'https://static.cdek.shopping/images/shopping/d2c68ca5a8104244bdf20b663f4c3c1c.jpg',
];

const product = {
   title: 'JIMMY CHOO Urban Hero',
   description: [
      'URBAN HERO - новый мужской аромат от JIMMY CHOO. Древесно-ароматическая парфюмерная вода JIMMY CHOO URBAN HERO, вдохновленная городской средой, была создана для JIMMY CHOO парфюмерами Антуаном Мезондье (Antoine Maisondieu) и Марион Костеро (Marion Costero) из Givaudan.',
      'Это современный городской аромат, в котором запечатлена спонтанная природа уличного искусства, микс цвета и текстуры, как в творение уличного художника',
      'В начальных нотах парфюмерной воды JIMMY CHOO URBAN HERO свежесть изысканной лимонной икры, с ее яркими оттенками, сочетается с теплом черного перца. Дуэт чувственного палисандра и утонченного ветивера в «сердце» передает художественную восприимчивость мужчины JIMMY CHOO. «Шлейф» объединил в себе городскую элегантность серой амбры с животной нотой кожи, придающей композиции бунтовской оттенок.',
   ],
   price: '7 099 ₽',
};

const App = () => {
   const scrollY = useRef(new Animated.Value(0)).current;
   const scrollX = useRef(new Animated.Value(0)).current;

   const sheetBorderRadius = useSharedValue(SHEET_BORDER_RADIUS);

   const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
      sheetBorderRadius.value = withSpring(SHEET_BORDER_RADIUS - SHEET_BORDER_RADIUS * index, {
         mass: 1,
         stiffness: 100,
         damping: 10,
      });
      console.log(sheetBorderRadius.value);
   }, []);

   return (
      <View style={{ flex: 1 }}>
         <StatusBar
            // translucent={true} backgroundColor={'transparent'} barStyle="dark-content"
            hidden
         />
         <GestureHandlerRootView style={{ flex: 1 }}>
            <View styles={{ height: ITEM_HEIGHT, overflow: 'hidden' }}>
               <Animated.FlatList
                  data={images}
                  keyExtractor={(_, index) => index.toString()}
                  snapToInterval={Platform.OS === 'ios' ? ITEM_HEIGHT : ITEM_WIDTH}
                  decelerationRate="fast"
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  horizontal={Platform.OS === 'ios' ? false : true}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX, y: scrollY } } }], { useNativeDriver: true })}
                  renderItem={({ item }) => {
                     return (
                        <View>
                           <Image style={styles.image} source={{ uri: item }} />
                        </View>
                     );
                  }}
               />
               <View style={styles.pagination}>
                  {images.map((_, index) => {
                     return <View key={index} style={styles.dot} />;
                  })}
                  <Animated.View
                     style={[
                        styles.dotIndicator,
                        {
                           transform: [
                              {
                                 translateY:
                                    Platform.OS === 'ios'
                                       ? Animated.divide(scrollY, ITEM_HEIGHT).interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, DOT_INDICATOR_SIZE],
                                         })
                                       : Animated.divide(scrollX, ITEM_WIDTH).interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, DOT_INDICATOR_SIZE],
                                         }),
                              },
                           ],
                        },
                     ]}
                  />
               </View>
            </View>
            <BottomSheet
               initialSnapIndex={0}
               snapPoints={[height - ITEM_HEIGHT, height]}
               onChange={handleSheetChanges}
               backgroundStyle={{ borderRadius: sheetBorderRadius.value }}>
               <BottomSheetScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={{ padding: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', textTransform: 'uppercase' }}>{product.title}</Text>
                  <Text style={{ fontSize: 16 }}>{product.price}</Text>
                  <View style={{ marginVertical: 20 }}>
                     {product.description.map((item, index) => {
                        return (
                           <Text key={index} style={{ marginBottom: 10, lineHeight: 22 }}>
                              {item}
                           </Text>
                        );
                     })}
                  </View>
               </BottomSheetScrollView>
            </BottomSheet>
         </GestureHandlerRootView>
      </View>
   );
};

const styles = StyleSheet.create({
   image: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      objectFit: 'cover',
   },
   pagination: {
      position: 'absolute',
      top: ITEM_HEIGHT / 2,
      left: 20,
   },
   dot: {
      marginBottom: DOT_SPACE,
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      backgroundColor: '#333',
   },
   dotIndicator: {
      // marginBottom: DOT_INDICATOR_SIZE,
      position: 'absolute',
      top: -DOT_SIZE / 2,
      left: -DOT_SIZE / 2,
      width: DOT_INDICATOR_SIZE,
      height: DOT_INDICATOR_SIZE,
      borderRadius: DOT_INDICATOR_SIZE / 2,
      borderWidth: 1,
      borderColor: '#333',
   },
});

export default App;
