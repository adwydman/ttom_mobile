import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { CatStep1, CatStep2, CatStep3, CatStep4, CatStep5, CatStep6, CatStep7 } from 'components/svgs';

interface IProps {
  style?: any;
  catStepsStyle?: any;
}

export default function CatSteps({ style, catStepsStyle }: IProps) {
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const fadeAnim5 = useRef(new Animated.Value(0)).current;
  const fadeAnim6 = useRef(new Animated.Value(0)).current;
  const fadeAnim7 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([

        Animated.timing(
          fadeAnim1,
          {
            toValue: 1,
            duration: 0,
            useNativeDriver: true
          }
        ),

        Animated.delay(150),

        Animated.parallel([
          Animated.timing(
            fadeAnim1,
            {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }
          ),
  
          Animated.timing(
            fadeAnim2,
            {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            }
          ),
        ]),

        Animated.delay(150),

        Animated.parallel([
          Animated.timing(
            fadeAnim2,
            {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }
          ),

          Animated.timing(
            fadeAnim3,
            {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            }
          ),
        ]),

        Animated.delay(150),

        Animated.parallel([
          Animated.timing(
            fadeAnim3,
            {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }
          ),

          Animated.timing(
            fadeAnim4,
            {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            }
          ),
        ]),

        Animated.delay(150),

        Animated.parallel([
          Animated.timing(
            fadeAnim4,
            {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }
          ),

          Animated.timing(
            fadeAnim5,
            {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            }
          ),
        ]),

        Animated.delay(150),

        Animated.parallel([
          Animated.timing(
            fadeAnim5,
            {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }
          ),

          Animated.timing(
            fadeAnim6,
            {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            }
          ),
        ]),

        Animated.delay(150),

        Animated.parallel([
          Animated.timing(
            fadeAnim6,
            {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }
          ),

          Animated.timing(
            fadeAnim7,
            {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            }
          ),
        ]),

        Animated.delay(1500),

        Animated.timing(
          fadeAnim7,
          {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          }
        ),
      ])
    ).start()

  }, []);
  
  return (
    // <View style={{ transform: [ { rotate: '335deg'} ] }}>
    <View style={style}>
      <CatStep1 style={{ opacity: fadeAnim1, position: 'absolute', ...catStepsStyle }} />
      <CatStep2 style={{ opacity: fadeAnim2, position: 'absolute', ...catStepsStyle }} />
      <CatStep3 style={{ opacity: fadeAnim3, position: 'absolute', ...catStepsStyle }} />
      <CatStep4 style={{ opacity: fadeAnim4, position: 'absolute', ...catStepsStyle }} />
      <CatStep5 style={{ opacity: fadeAnim5, position: 'absolute', ...catStepsStyle }} />
      <CatStep6 style={{ opacity: fadeAnim6, position: 'absolute', ...catStepsStyle }} />
      <CatStep7 style={{ opacity: fadeAnim7, position: 'absolute', ...catStepsStyle }} /> 
    </View>
  )
}
