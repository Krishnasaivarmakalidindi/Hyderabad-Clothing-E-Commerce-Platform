import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Animated mesh gradient background component
const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-cream-100 to-vermilion/20" />
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent-gold/30 to-vermilion/20 blur-3xl"
            animate={{
                x: [0, -100, -50, 0],
                y: [0, 50, 100, 0],
                scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: '-15%', right: '-10%' }}
        />
        <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-l from-vermilion/30 to-accent-gold/20 blur-3xl"
            animate={{
                x: [0, 80, 40, 0],
                y: [0, -60, 80, 0],
                scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            style={{ bottom: '-20%', left: '-10%' }}
        />
    </div>
);

// Password requirement checker component
interface PasswordRequirement {
    label: string;
    met: boolean;
}

const PasswordChecklist = ({ password }: { password: string }) => {
    const requirements: PasswordRequirement[] = useMemo(() => [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'One number', met: /[0-9]/.test(password) },
        { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ], [password]);

    return (
        <div className="mt-3 p-4 bg-cream-50/50 backdrop-blur-sm rounded-xl border border-cream-200">
            <p className="text-xs font-bold text-brown-700 mb-3">Password Requirements:</p>
            <div className="space-y-2">
                {requirements.map((req, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center gap-2"
                        initial={false}
                        animate={{
                            scale: req.met ? [1, 1.05, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${req.met
                                ? 'bg-green-500 text-white'
                                : 'bg-cream-200 text-brown-400'
                                }`}
                            animate={{
                                scale: req.met ? 1 : 0.9,
                            }}
                        >
                            <FaCheck size={10} />
                        </motion.div>
                        <span className={`text-sm transition-all duration-300 ${req.met
                            ? 'text-green-700 font-medium'
                            : 'text-brown-500'
                            }`}>
                            {req.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default function Register() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    // Check if all password requirements are met
    const isPasswordValid = useMemo(() => {
        const p = formData.password;
        return p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p);
    }, [formData.password]);

    const isFormValid = useMemo(() => {
        return (
            formData.fullName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phoneNumber.trim() !== '' &&
            isPasswordValid &&
            formData.password === formData.confirmPassword
        );
    }, [formData, isPasswordValid]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            setError('Please meet all password requirements.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    userType: 'customer', // Always customer
                }),
            });

            const data = await response.json();

            if (data.success) {
                login(data.data.token, data.data.user);
                router.push('/');
            } else {
                const msg = data.message?.toLowerCase() || '';
                if (msg.includes('exists') || msg.includes('already')) {
                    setError('This email address is already registered. Please sign in.');
                } else {
                    setError(data.message || 'Registration failed. Please try again.');
                }
            }
        } catch (err) {
            setError('Unable to connect to the server. Please check your internet connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Register - Hyderabad Clothing">
            <div className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <AnimatedBackground />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-md w-full space-y-8 relative z-10"
                >
                    <div className="backdrop-blur-xl bg-white/70 p-10 rounded-3xl shadow-2xl border border-white/50">
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-vermilion rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-white font-black text-2xl">H</span>
                                </div>
                            </motion.div>
                            <h2 className="text-3xl font-black text-brown-900">Create Account</h2>
                            <p className="mt-2 text-sm text-brown-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="font-bold text-vermilion hover:text-vermilion-600 transition-colors duration-300">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FaExclamationCircle className="text-red-500 flex-shrink-0" />
                                            <p className="text-sm text-red-700 font-medium">{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                {/* Full Name */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaUser className="text-brown-400" />
                                    </div>
                                    <input
                                        name="fullName"
                                        type="text"
                                        required
                                        className="appearance-none rounded-xl block w-full px-4 py-4 pl-12 border-2 border-cream-200 placeholder-brown-400 text-brown-900 focus:outline-none focus:border-vermilion sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-brown-400" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="appearance-none rounded-xl block w-full px-4 py-4 pl-12 border-2 border-cream-200 placeholder-brown-400 text-brown-900 focus:outline-none focus:border-vermilion sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaPhone className="text-brown-400" />
                                    </div>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        required
                                        className="appearance-none rounded-xl block w-full px-4 py-4 pl-12 border-2 border-cream-200 placeholder-brown-400 text-brown-900 focus:outline-none focus:border-vermilion sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-brown-400" />
                                    </div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-xl block w-full px-4 py-4 pl-12 pr-12 border-2 border-cream-200 placeholder-brown-400 text-brown-900 focus:outline-none focus:border-vermilion sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-brown-400 hover:text-brown-600 transition-colors duration-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                {/* Live Password Checklist */}
                                {formData.password.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <PasswordChecklist password={formData.password} />
                                    </motion.div>
                                )}

                                {/* Confirm Password */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-brown-400" />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        className={`appearance-none rounded-xl block w-full px-4 py-4 pl-12 pr-12 border-2 placeholder-brown-400 text-brown-900 focus:outline-none sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                            ? 'border-red-400 focus:border-red-500'
                                            : formData.confirmPassword && formData.password === formData.confirmPassword
                                                ? 'border-green-400 focus:border-green-500'
                                                : 'border-cream-200 focus:border-vermilion'
                                            }`}
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-brown-400 hover:text-brown-600 transition-colors duration-300"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-red-500 mt-1 ml-1"
                                    >
                                        Passwords do not match
                                    </motion.p>
                                )}
                            </div>

                            <div>
                                <motion.button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    whileHover={isFormValid ? { scale: 1.02 } : {}}
                                    whileTap={isFormValid ? { scale: 0.98 } : {}}
                                    className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all duration-300 shadow-lg ${isFormValid
                                        ? 'bg-gradient-to-r from-vermilion to-vermilion-600 hover:from-vermilion-600 hover:to-vermilion hover:shadow-xl cursor-pointer'
                                        : 'bg-brown-300 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Create Account'}
                                </motion.button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-xs text-brown-500">
                            By creating an account, you agree to our{' '}
                            <Link href="/terms" className="text-vermilion hover:underline">Terms</Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="text-vermilion hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}