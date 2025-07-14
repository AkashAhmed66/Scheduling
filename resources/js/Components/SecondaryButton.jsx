export default function SecondaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 active:scale-95 ${
                    disabled && 'opacity-60 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
