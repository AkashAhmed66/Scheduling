import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, isReadOnly = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            readOnly={isReadOnly} // Makes input uneditable if true
            className={
                `rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ` +
                (isReadOnly ? 'bg-gray-200 cursor-not-allowed ' : '') + // Style for read-only
                className
            }
            ref={localRef}
        />
    );
});
