
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import MessageWindow from '../components/features/MessageWindow/MessageWindow';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const resolverRef = useRef(null);

  /**
   * Resolves the currently displayed message and closes the window.
   */
  const finishMessage = useCallback((result) => {
    const resolve = resolverRef.current;

    resolverRef.current = null;
    setMessage(null);

    if (resolve) {
      resolve(result);
    }
  }, []);

  /**
   * Displays a message and returns a Promise.
   *
   * alert   -> resolves to true when acknowledged
   * confirm -> resolves to true or false
   */
  const showMessage = useCallback((options = {}) => {
    // Only one message can be displayed at a time.
    // If another is requested, dismiss the previous one.
    if (resolverRef.current) {
      const previousResolve = resolverRef.current;
      resolverRef.current = null;
      previousResolve(false);
    }

    return new Promise((resolve) => {
      resolverRef.current = resolve;

      setMessage({
        title: options.title ?? 'Informacja',
        message: options.message ?? '',
        mode: options.mode === 'confirm' ? 'confirm' : 'alert',
        confirmText: options.confirmText ?? 'OK',
        cancelText: options.cancelText ?? 'Nie',
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
        resolverRef.current = null;
      }
    };
  }, []);

  const value = { showMessage };

  return (
    <MessageContext.Provider value={value}>
      {children}

      <MessageWindow
        isOpen={Boolean(message)}
        title={message?.title}
        message={message?.message}
        mode={message?.mode}
        confirmText={message?.confirmText}
        cancelText={message?.cancelText}
        onConfirm={() => finishMessage(true)}
        onCancel={() => finishMessage(false)}
        onClose={() => finishMessage(false)}
      />
    </MessageContext.Provider>
  );
};

/**
 * Hook used by components that need to display a message.
 */
export const useMessage = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error(
      'useMessage must be used inside MessageProvider'
    );
  }

  return context;
};
