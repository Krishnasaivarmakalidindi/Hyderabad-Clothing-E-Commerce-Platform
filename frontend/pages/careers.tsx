import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Briefcase, Heart, TrendingUp, Users, Coffee, MapPin, Clock, Send } from 'lucide-react';
import Layout from '../components/Layout';

export default function Careers() {
    const benefits = [
        {
            icon: <Heart className="w-6 h-6 text-vermilion" />,
            title: "Health & Wellness",
            desc: "Comprehensive health insurance and wellness programs"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-vermilion" />,
            title: "Growth Opportunities",
            desc: "Career development programs and mentorship"
        },
        {
            icon: <Users className="w-6 h-6 text-vermilion" />,
            title: "Inclusive Culture",
            desc: "Diverse team celebrating different perspectives"
        },
        {
            icon: <Coffee className="w-6 h-6 text-vermilion" />,
            title: "Work-Life Balance",
            desc: "Flexible hours and remote work options"
        }
    ];

    const openings = [
        {
            title: "Senior Fashion Designer",
            department: "Design",
            location: "Hyderabad, India",
            type: "Full-time",
            description: "Lead the design of our seasonal collections, working with traditional artisans to create contemporary ethnic wear."
        },
        {
            title: "Full Stack Developer",
            department: "Technology",
            location: "Remote / Hyderabad",
            type: "Full-time",
            description: "Build and maintain our e-commerce platform using React, Node.js, and modern web technologies."
        },
        {
            title: "Digital Marketing Manager",
            department: "Marketing",
            location: "Hyderabad, India",
            type: "Full-time",
            description: "Drive our digital marketing strategy across social media, SEO, and performance marketing channels."
        },
        {
            title: "Customer Experience Lead",
            department: "Operations",
            location: "Hyderabad, India",
            type: "Full-time",
            description: "Lead our customer support team to deliver exceptional experiences across all touchpoints."
        },
        {
            title: "Visual Merchandiser",
            department: "Retail",
            location: "Hyderabad, India",
            type: "Full-time",
            description: "Create stunning visual displays for our flagship store that showcase our products beautifully."
        },
        {
            title: "Content Writer",
            department: "Marketing",
            location: "Remote",
            type: "Part-time",
            description: "Create compelling content for our blog, product descriptions, and social media channels."
        }
    ];

    return (
        <Layout>
            <Head>
                <title>Careers | Hyderabad Clothing</title>
                <meta name="description" content="Join our team at Hyderabad Clothing - Explore career opportunities in fashion, technology, and more." />
            </Head>

            {/* Hero Section */}
            <section className="bg-cream-50 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-brown-900 mb-6"
                        >
                            Join Our Team
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-brown-600 leading-relaxed"
                        >
                            Be part of a team that's redefining ethnic fashion. We're looking for passionate individuals who share our love for tradition, innovation, and exceptional craftsmanship.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-8 text-center">
                        Why Work With Us?
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-cream-50 text-center border border-cream-200 hover:shadow-lg transition-shadow"
                            >
                                <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold text-brown-900 mb-2">{benefit.title}</h3>
                                <p className="text-brown-600 text-sm">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 bg-cream-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4">
                                Open Positions
                            </h2>
                            <p className="text-brown-600">
                                Explore our current openings and find your perfect role
                            </p>
                        </div>

                        <div className="space-y-4">
                            {openings.map((job, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-2xl bg-white border border-cream-200 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Briefcase className="w-5 h-5 text-accent-gold" />
                                                <span className="text-sm font-medium text-brown-500">{job.department}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-brown-900 mb-2 group-hover:text-vermilion transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-brown-600 text-sm mb-3">{job.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-brown-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 bg-brown-900 text-cream-50 px-6 py-3 rounded-full font-semibold hover:bg-brown-800 transition-colors whitespace-nowrap">
                                            Apply Now
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* No Matching Role */}
            <section className="py-16 bg-brown-900 text-cream-50">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Don't See the Right Role?</h2>
                    <p className="text-cream-200 mb-6 max-w-2xl mx-auto">
                        We're always looking for talented individuals. Send us your resume and tell us how you'd like to contribute to our mission.
                    </p>
                    <a
                        href="mailto:careers@hyderabadclothing.com"
                        className="inline-block bg-accent-gold text-brown-900 px-8 py-3 rounded-full font-semibold hover:bg-accent-gold/90 transition-colors"
                    >
                        Send Your Resume
                    </a>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4">
                                    Our Culture
                                </h2>
                                <p className="text-brown-600 leading-relaxed mb-4">
                                    At Hyderabad Clothing, we blend tradition with innovation. Our workplace reflects the same values we bring to our products — attention to detail, respect for craftsmanship, and a commitment to excellence.
                                </p>
                                <p className="text-brown-600 leading-relaxed">
                                    We celebrate diversity, encourage creativity, and believe that the best ideas can come from anyone on the team. Whether you're in our Hyderabad office or working remotely, you'll be part of a supportive community that values your unique perspective.
                                </p>
                            </div>
                            <div className="bg-cream-50 rounded-2xl h-80 flex items-center justify-center border border-cream-200">
                                <div className="text-center text-brown-400">
                                    <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
                                    <span className="font-medium">Team Photo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
