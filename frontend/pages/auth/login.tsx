import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Animated mesh gradient background component
const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-vermilion/20 via-cream-100 to-accent-gold/20" />

        {/* Animated blobs */}
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-vermilion/30 to-accent-gold/20 blur-3xl"
            animate={{
                x: [0, 100, 50, 0],
                y: [0, 50, 100, 0],
                scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ top: '-20%', left: '-10%' }}
        />
        <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-l from-accent-gold/30 to-vermilion/20 blur-3xl"
            animate={{
                x: [0, -80, -40, 0],
                y: [0, -60, 80, 0],
                scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ bottom: '-20%', right: '-10%' }}
        />
        <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-cream-200/50 to-vermilion/10 blur-2xl"
            animate={{
                x: [0, 60, -30, 0],
                y: [0, -40, 60, 0],
            }}
            transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            style={{ top: '40%', left: '30%' }}
        />
    </div>
);

export default function Login() {
    const router = useRouter();
    const { login, isLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState<'email' | 'password' | 'general' | ''>('');
    const [shakeEmail, setShakeEmail] = useState(false);
    const [shakePassword, setShakePassword] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const triggerShake = (field: 'email' | 'password' | 'both') => {
        if (field === 'email' || field === 'both') {
            setShakeEmail(true);
            setTimeout(() => setShakeEmail(false), 500);
        }
        if (field === 'password' || field === 'both') {
            setShakePassword(true);
            setTimeout(() => setShakePassword(false), 500);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setErrorType('');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                login(data.data.token, data.data.user);

                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                const redirect = router.query.redirect as string || '/';
                router.push(redirect);
            } else {
                const msg = data.message?.toLowerCase() || '';
                if (msg.includes('not found') || msg.includes('not registered') || msg.includes('no user')) {
                    setError('This email address is not registered.');
                    setErrorType('email');
                    triggerShake('email');
                } else if (msg.includes('password') || msg.includes('incorrect') || msg.includes('invalid credentials')) {
                    setError('Incorrect password. Please check your credentials and try again.');
                    setErrorType('password');
                    triggerShake('password');
                } else {
                    setError(data.message || 'Login failed. Please try again.');
                    setErrorType('general');
                    triggerShake('both');
                }
            }
        } catch (err) {
            setError('Unable to connect to the server. Please check your internet connection.');
            setErrorType('general');
            triggerShake('both');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const shakeAnimation = {
        shake: {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
            transition: { duration: 0.5 }
        }
    };

    return (
        <Layout title="Login - Hyderabad Clothing">
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
                                <div className="w-16 h-16 bg-gradient-to-br from-vermilion to-vermilion-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-white font-black text-2xl">H</span>
                                </div>
                            </motion.div>
                            <h2 className="text-3xl font-black text-brown-900">Welcome Back</h2>
                            <p className="mt-2 text-sm text-brown-600">
                                Don't have an account?{' '}
                                <Link href="/auth/register" className="font-bold text-vermilion hover:text-vermilion-600 transition-colors duration-300">
                                    Create one
                                </Link>
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                                <motion.div
                                    className="relative"
                                    variants={shakeAnimation}
                                    animate={shakeEmail ? 'shake' : ''}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className={`transition-colors duration-300 ${errorType === 'email' ? 'text-red-500' : 'text-brown-400'}`} />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`appearance-none rounded-xl block w-full px-4 py-4 pl-12 border-2 placeholder-brown-400 text-brown-900 focus:outline-none focus:ring-0 sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm ${errorType === 'email'
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-cream-200 focus:border-vermilion'
                                            }`}
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errorType === 'email') { setError(''); setErrorType(''); }
                                        }}
                                    />
                                </motion.div>

                                <motion.div
                                    className="relative"
                                    variants={shakeAnimation}
                                    animate={shakePassword ? 'shake' : ''}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className={`transition-colors duration-300 ${errorType === 'password' ? 'text-red-500' : 'text-brown-400'}`} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className={`appearance-none rounded-xl block w-full px-4 py-4 pl-12 pr-12 border-2 placeholder-brown-400 text-brown-900 focus:outline-none focus:ring-0 sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm ${errorType === 'password'
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-cream-200 focus:border-vermilion'
                                            }`}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errorType === 'password') { setError(''); setErrorType(''); }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-brown-400 hover:text-brown-600 transition-colors duration-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </motion.div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-vermilion focus:ring-vermilion border-cream-300 rounded transition-all duration-300"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-brown-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link href="/auth/forgot-password" className="font-medium text-vermilion hover:text-vermilion-600 transition-colors duration-300">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-vermilion to-vermilion-600 hover:from-vermilion-600 hover:to-vermilion focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vermilion transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Sign In'}
                                </motion.button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-xs text-brown-500">
                            By signing in, you agree to our{' '}
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
