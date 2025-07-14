import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-all duration-200 ease-in-out ' +
                (active
                    ? 'border-indigo-500 text-indigo-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-500') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
