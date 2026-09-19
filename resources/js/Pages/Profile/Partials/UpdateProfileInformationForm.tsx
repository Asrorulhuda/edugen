import React, { FormEventHandler, useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Camera, Trash2, Upload, User as UserIcon } from 'lucide-react';
import { PageProps } from '@/types';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar_url || (user.avatar_path ? `/storage/${user.avatar_path}` : null)
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
        remove_avatar: false,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData((prev) => ({ ...prev, avatar: file, remove_avatar: false }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveAvatar = () => {
        setData((prev) => ({ ...prev, avatar: null, remove_avatar: true }));
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <section className={className}>
            <header className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Informasi Profil & Foto Guru
                    </h2>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Perbarui identitas profil, foto akun guru, dan alamat email aktif Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Foto Profil Guru */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Foto Profil Guru
                    </label>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Avatar Display Frame */}
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt={data.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-tr from-indigo-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                                        <UserIcon className="w-9 h-9" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition active:scale-95"
                                title="Ganti Foto"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Actions & File Input */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-2xs"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Pilih Foto Baru</span>
                                </button>

                                {avatarPreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-xs font-semibold text-rose-600 dark:text-rose-400 transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus</span>
                                    </button>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Format didukung: JPG, PNG, atau WebP. Maksimum 4 MB.
                            </p>
                        </div>
                    </div>

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                {/* Nama Guru */}
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap & Gelar Guru" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        placeholder="Contoh: Siti Rahmawati, S.Pd."
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Alamat Email */}
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="guru@sekolah.sch.id"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                        <p>
                            Alamat email Anda belum diverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-semibold underline hover:text-amber-950 dark:hover:text-white"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
                                Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Profil'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-200"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Data profil berhasil diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
