import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

// keyboardWillShow/Hide are iOS-only (fire before the animation starts, so
// UI reacts in sync with the keyboard) — Android only has the Did variants.
const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export const useKeyboardVisible = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(showEvent, () => setIsVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return isVisible;
};
