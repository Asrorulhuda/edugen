import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateSchoolProfileForm from './Partials/UpdateSchoolProfileForm';

export default function Edit({
    mustVerifyEmail,
    status,
    isIndividualTeacher = false,
    institution = null,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    isIndividualTeacher?: boolean;
    institution?: any;
}>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Profil Saya & Satuan Pendidikan
                </h2>
            }
        >
            <Head title="Profil Pengguna & Sekolah" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Data Guru */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Data Sekolah / Madrasah & KOP (Guru Mandiri / Client Sekolah) */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdateSchoolProfileForm
                            institution={institution}
                            isIndividualTeacher={Boolean(isIndividualTeacher)}
                            className="max-w-3xl"
                        />
                    </div>

                    {/* Ubah Password */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Hapus Akun */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
