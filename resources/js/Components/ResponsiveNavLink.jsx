import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-all duration-200 ease-in-out ${
                active
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-indigo-500'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
