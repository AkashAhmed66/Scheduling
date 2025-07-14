export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={`mt-1 text-sm text-red-600 font-medium ${className}`}>
            {message}
        </p>
    ) : null;
}
