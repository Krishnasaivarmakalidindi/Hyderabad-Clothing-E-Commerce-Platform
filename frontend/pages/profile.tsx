import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaBox, FaMapMarkerAlt, FaUserCog, FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaTrash, FaPlus } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Profile() {
    const { user, logout, isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const { tab } = router.query;
    const activeTab = (tab as string) || 'dashboard';

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push('/auth/login');
        }
    }, [loading, isLoggedIn, router]);

    if (loading) {
        return (
            <Layout title="Loading...">
                <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-[#121212]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                </div>
            </Layout>
        );
    }

    if (!user) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <MyOrders />;
            case 'addresses':
                return <SavedAddresses />;
            case 'settings':
                return <AccountSettings user={user} />;
            default:
                return <Dashboard user={user} />;
        }
    };

    return (
        <Layout title="My Profile - Hyderabad Clothing">
            <div className="bg-cream-50 dark:bg-[#121212] min-h-screen py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="w-full md:w-1/4">
                            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 overflow-hidden sticky top-24 border border-cream-200 dark:border-gray-800">
                                <div className="p-6 border-b border-cream-200 dark:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-cream-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-vermilion text-xl font-bold border border-cream-200 dark:border-gray-700">
                                            {user.fullName?.charAt(0)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="text-xs text-brown-500 dark:text-gray-400 uppercase tracking-wider">Hello,</h3>
                                            <p className="text-brown-900 dark:text-white font-bold truncate">{user.fullName}</p>
                                        </div>
                                    </div>
                                </div>
                                <nav className="p-2">
                                    <SidebarLink
                                        icon={<FaUser />}
                                        label="My Profile"
                                        active={activeTab === 'dashboard'}
                                        onClick={() => router.push('/profile?tab=dashboard', undefined, { shallow: true })}
                                    />
                                    <SidebarLink
                                        icon={<FaBox />}
                                        label="My Orders"
                                        active={activeTab === 'orders'}
                                        onClick={() => router.push('/profile?tab=orders', undefined, { shallow: true })}
                                    />
                                    <SidebarLink
                                        icon={<FaMapMarkerAlt />}
                                        label="Saved Addresses"
                                        active={activeTab === 'addresses'}
                                        onClick={() => router.push('/profile?tab=addresses', undefined, { shallow: true })}
                                    />
                                    <SidebarLink
                                        icon={<FaUserCog />}
                                        label="Account Settings"
                                        active={activeTab === 'settings'}
                                        onClick={() => router.push('/profile?tab=settings', undefined, { shallow: true })}
                                    />
                                    <div className="h-px bg-cream-200 dark:bg-gray-700 my-2"></div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-vermilion hover:bg-vermilion/10 rounded-lg transition-colors font-medium"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full md:w-3/4">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const SidebarLink = ({ icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium mb-1 ${active ? 'bg-vermilion/10 text-vermilion' : 'text-brown-600 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-gray-800 hover:text-brown-900 dark:hover:text-white'
            }`}
    >
        <span className={active ? 'text-vermilion' : 'text-brown-400 dark:text-gray-500'}>{icon}</span>
        {label}
    </button>
);

const Dashboard = ({ user }: any) => {
    const [stats, setStats] = useState({ totalOrders: 0, pendingDelivery: 0, wishlistItems: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/customer/profile');
                if (res.data.success) {
                    setStats({
                        totalOrders: res.data.data.total_orders || 0,
                        pendingDelivery: 0, // Need to calculate from orders
                        wishlistItems: 0 // Need wishlist endpoint
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 border border-cream-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-brown-900 dark:text-white mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm text-brown-500 dark:text-gray-400">Full Name</label>
                        <div className="flex items-center gap-3 text-brown-900 dark:text-white font-medium p-3 bg-cream-50 dark:bg-[#242424] rounded-lg border border-cream-100 dark:border-gray-700">
                            <FaUser className="text-brown-400 dark:text-gray-500" /> {user.fullName}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-brown-500 dark:text-gray-400">Email Address</label>
                        <div className="flex items-center gap-3 text-brown-900 dark:text-white font-medium p-3 bg-cream-50 dark:bg-[#242424] rounded-lg border border-cream-100 dark:border-gray-700">
                            <FaEnvelope className="text-brown-400 dark:text-gray-500" /> {user.email}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-brown-500 dark:text-gray-400">Phone Number</label>
                        <div className="flex items-center gap-3 text-brown-900 dark:text-white font-medium p-3 bg-cream-50 dark:bg-[#242424] rounded-lg border border-cream-100 dark:border-gray-700">
                            <FaPhone className="text-brown-400 dark:text-gray-500" /> {user.phoneNumber || 'Not provided'}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-brown-500 dark:text-gray-400">Account Type</label>
                        <div className="flex items-center gap-3 text-brown-900 dark:text-white font-medium p-3 bg-cream-50 dark:bg-[#242424] rounded-lg border border-cream-100 dark:border-gray-700 capitalize">
                            <FaUserCog className="text-brown-400 dark:text-gray-500" /> {user.userType}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 border border-cream-200 dark:border-gray-800">
                    <div className="text-brown-500 dark:text-gray-400 text-sm mb-1">Total Orders</div>
                    <div className="text-3xl font-bold text-brown-900 dark:text-white">{stats.totalOrders}</div>
                </div>
                <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 border border-cream-200 dark:border-gray-800">
                    <div className="text-brown-500 dark:text-gray-400 text-sm mb-1">Pending Delivery</div>
                    <div className="text-3xl font-bold text-brown-900 dark:text-white">{stats.pendingDelivery}</div>
                </div>
                <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 border border-cream-200 dark:border-gray-800">
                    <div className="text-brown-500 dark:text-gray-400 text-sm mb-1">Wishlist Items</div>
                    <div className="text-3xl font-bold text-brown-900 dark:text-white">{stats.wishlistItems}</div>
                </div>
            </div>
        </div>
    );
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                if (res.data.success) {
                    setOrders(res.data.data.orders);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-6 text-center text-brown-600 dark:text-gray-400">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 min-h-[400px] flex flex-col items-center justify-center text-center border border-cream-200 dark:border-gray-800">
                <div className="w-16 h-16 bg-cream-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-cream-200 dark:border-gray-700">
                    <FaBox className="text-brown-400 dark:text-gray-500 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-brown-900 dark:text-white">No orders yet</h3>
                <p className="text-brown-500 dark:text-gray-400 mt-2 mb-6">Looks like you haven't placed any orders yet.</p>
                <Link href="/collections?sort=new-arrivals" className="px-6 py-2 bg-vermilion text-white rounded-lg font-medium hover:bg-vermilion-600 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-brown-900 dark:text-white mb-4">My Orders</h2>
            {orders.map((order: any) => (
                <div key={order.id} className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 border border-cream-200 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-sm text-brown-500 dark:text-gray-400">Order #{order.order_number}</div>
                            <div className="text-xs text-brown-400 dark:text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'delivered' ? 'bg-gold/20 text-gold' :
                            order.status === 'cancelled' ? 'bg-vermilion/20 text-vermilion' :
                                'bg-mustard-100 dark:bg-gold/10 text-mustard-800 dark:text-gold'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-cream-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-cream-200 dark:border-gray-700">
                            {/* Placeholder for image */}
                            <div className="w-full h-full bg-cream-200 dark:bg-gray-700 flex items-center justify-center text-brown-400 dark:text-gray-500">Img</div>
                        </div>
                        <div>
                            <h4 className="font-medium text-brown-900 dark:text-white">{order.product_name}</h4>
                            <p className="text-sm text-brown-500 dark:text-gray-400">Size: {order.size} | Qty: {order.quantity}</p>
                            <p className="font-bold text-brown-900 dark:text-white mt-1">₹{order.total_amount}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SavedAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', phoneNumber: '', addressLine1: '', addressLine2: '',
        landmark: '', city: '', state: '', pincode: '', isDefault: false
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchAddresses = async () => {
        try {
            const res = await api.get('/customer/addresses');
            if (res.data.success) {
                setAddresses(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/customer/addresses/${id}`);
            fetchAddresses();
        } catch (error) {
            console.error("Failed to delete address", error);
        }
    };

    const handleEdit = (addr: any) => {
        setFormData({
            fullName: addr.full_name,
            phoneNumber: addr.phone_number,
            addressLine1: addr.address_line1,
            addressLine2: addr.address_line2 || '',
            landmark: addr.landmark || '',
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            isDefault: addr.is_default || false
        });
        setEditingId(addr.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/customer/addresses/${editingId}`, formData);
            } else {
                await api.post('/customer/addresses', formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                fullName: '', phoneNumber: '', addressLine1: '', addressLine2: '',
                landmark: '', city: '', state: '', pincode: '', isDefault: false
            });
            fetchAddresses();
        } catch (error) {
            console.error("Failed to save address", error);
            alert("Failed to save address. Please try again.");
        }
    };

    if (loading) return <div className="p-6 text-center text-brown-600 dark:text-gray-400">Loading addresses...</div>;

    return (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 border border-cream-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brown-900 dark:text-white">Saved Addresses</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({
                            fullName: '', phoneNumber: '', addressLine1: '', addressLine2: '',
                            landmark: '', city: '', state: '', pincode: '', isDefault: false
                        });
                    }}
                    className="text-vermilion font-medium hover:text-vermilion-600 flex items-center gap-2"
                >
                    <FaPlus size={12} /> {showForm ? 'Cancel' : 'Add New Address'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-cream-50 dark:bg-[#242424] p-6 rounded-xl border border-cream-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input required placeholder="Full Name" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        <input required placeholder="Phone Number" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
                        <input required placeholder="Address Line 1" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion md:col-span-2" value={formData.addressLine1} onChange={e => setFormData({ ...formData, addressLine1: e.target.value })} />
                        <input placeholder="Address Line 2" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion md:col-span-2" value={formData.addressLine2} onChange={e => setFormData({ ...formData, addressLine2: e.target.value })} />
                        <input placeholder="Landmark" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} />
                        <input required placeholder="City" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                        <input required placeholder="State" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                        <input required placeholder="Pincode" className="p-2 rounded border border-cream-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                    </div>
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="default" checked={formData.isDefault} onChange={e => setFormData({ ...formData, isDefault: e.target.checked })} className="mr-2 text-vermilion focus:ring-vermilion" />
                        <label htmlFor="default" className="text-brown-700 dark:text-gray-300">Set as default address</label>
                    </div>
                    <button type="submit" className="bg-vermilion text-white px-4 py-2 rounded hover:bg-vermilion-600">
                        {editingId ? 'Update Address' : 'Save Address'}
                    </button>
                </form>
            )}

            {addresses.length === 0 ? (
                <div className="min-h-[200px] flex flex-col items-center justify-center text-center border-2 border-dashed border-cream-200 dark:border-gray-700 rounded-xl">
                    <p className="text-brown-500 dark:text-gray-400">No addresses saved yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr: any) => (
                        <div key={addr.id} className="border border-cream-200 dark:border-gray-700 rounded-xl p-4 relative hover:shadow-md transition-shadow bg-white dark:bg-[#242424]">
                            {addr.is_default && <span className="absolute top-2 right-2 bg-gold/20 text-gold text-xs px-2 py-1 rounded-full">Default</span>}
                            <h3 className="font-bold text-brown-900 dark:text-white">{addr.full_name}</h3>
                            <p className="text-sm text-brown-600 dark:text-gray-400">{addr.address_line1}, {addr.address_line2}</p>
                            <p className="text-sm text-brown-600 dark:text-gray-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-sm text-brown-600 dark:text-gray-400 mt-1">Phone: {addr.phone_number}</p>
                            <div className="flex items-center gap-3 mt-3">
                                <button onClick={() => handleEdit(addr)} className="text-brown-600 dark:text-gray-400 text-sm hover:underline flex items-center gap-1">
                                    <FaUserCog size={12} /> Edit
                                </button>
                                <button onClick={() => handleDelete(addr.id)} className="text-vermilion text-sm hover:underline flex items-center gap-1">
                                    <FaTrash size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AccountSettings = ({ user }: any) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await api.put('/customer/profile', formData);
            if (res.data.success) {
                setMessage('Profile updated successfully!');
                // Ideally reload user context here, but for now just show message
            }
        } catch (error) {
            console.error('Update failed', error);
            setMessage('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-6 border border-cream-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-brown-900 dark:text-white mb-6">Account Settings</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-gold/20 text-gold' : 'bg-vermilion/20 text-vermilion'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-brown-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-lg border-cream-300 dark:border-gray-600 bg-white dark:bg-[#242424] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brown-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full rounded-lg border-cream-300 dark:border-gray-600 bg-cream-50 dark:bg-[#1A1A1A] text-brown-500 dark:text-gray-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brown-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full rounded-lg border-cream-300 dark:border-gray-600 bg-white dark:bg-[#242424] text-brown-900 dark:text-white focus:ring-vermilion focus:border-vermilion"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-vermilion text-white rounded-lg font-medium hover:bg-vermilion-600 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};
