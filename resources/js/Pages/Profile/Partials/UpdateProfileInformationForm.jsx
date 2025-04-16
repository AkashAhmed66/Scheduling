import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            companyName: user.companyName || '',
            phone: user.phone || '',
            designation: user.designation || '',
            department: user.department || '',
            countryCode: user.countryCode || '',
            gender: user.gender || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and details.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email (Read-only) */}
                <div>
                    <InputLabel htmlFor="email" value="E-mail" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        isReadOnly={true} // Make uneditable
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Company Name */}
                <div>
                    <InputLabel htmlFor="company_name" value="Company Name" />
                    <TextInput
                        id="company_name"
                        className="mt-1 block w-full"
                        value={data.companyName}
                        onChange={(e) => setData('companyName', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.company_name} />
                </div>

                {/* Phone Number */}
                <div>
                    <InputLabel htmlFor="phone_number" value="Phone Number" />
                    <TextInput
                        id="phone_number"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                {/* Designation */}
                <div>
                    <InputLabel htmlFor="designation" value="Designation" />
                    <TextInput
                        id="designation"
                        className="mt-1 block w-full"
                        value={data.designation}
                        onChange={(e) => setData('designation', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.designation} />
                </div>

                {/* Department */}
                <div>
                    <InputLabel htmlFor="department" value="Department" />
                    <TextInput
                        id="department"
                        className="mt-1 block w-full"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.department} />
                </div>

                {/* Country Code */}
                <div>
                    <InputLabel htmlFor="country_code" value="Country Code" />
                    <TextInput
                        id="country_code"
                        className="mt-1 block w-full"
                        value={data.countryCode}
                        onChange={(e) => setData('countryCode', e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.countryCode} />
                </div>

                {/* Gender (Dropdown) */}
                <div>
                    <InputLabel htmlFor="gender" value="Gender" />
                    <select
                        id="gender"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <InputError className="mt-2" message={errors.gender} />
                </div>

                {/* Email Verification Notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
    