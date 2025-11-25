import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCachedState = (key, defaultValue) => {
  const [state, setState] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored && mounted) {
          setState(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Cache load error', error);
      } finally {
        if (mounted) setHydrated(true);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(key, JSON.stringify(state)).catch((error) =>
      console.warn('Cache write error', error),
    );
  }, [key, state, hydrated]);

  return [state, setState, hydrated];
};

