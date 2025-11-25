import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return {
    width: dimensions.width,
    height: dimensions.height,
    isSmallDevice: dimensions.width < 375,
    isMediumDevice: dimensions.width >= 375 && dimensions.width < 768,
    isLargeDevice: dimensions.width >= 768,
  };
};

