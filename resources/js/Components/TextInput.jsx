import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="relative">
            <input
                {...props}
                type={type}
                className={
                    `w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 ${
                        props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                    } ` + className
                }
                ref={input}
            />
        </div>
    );
});
