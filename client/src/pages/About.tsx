import { Link } from 'react-router-dom';
import {
    Target,
    Eye,
    Search,
    MapPin,
    Phone,
    Shield,
    Users,
    Heart,
    Lock,
    Zap,
    ArrowRight,
    Globe,
    CheckCircle,
} from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: 'Search',
        description:
            'Enter what you need or browse categories. Allow location access for the best nearby results.',
    },
    {
        icon: MapPin,
        title: 'Discover',
        description:
            'See verified service providers on an interactive map, sorted by proximity to your location.',
    },
    {
        icon: Phone,
        title: 'Connect',
        description:
            'Call or WhatsApp providers directly — no sign-up, no middleman, no waiting.',
    },
];

const features = [
    {
        icon: MapPin,
        title: 'Proximity First',
        description:
            'We prioritize distance over ratings. When you need help now, the closest professional matters most.',
        color: 'bg-amber-100 text-amber-600',
    },
    {
        icon: Zap,
        title: 'No Middleman',
        description:
            'Contact service providers directly via call or WhatsApp. No quote forms, no bidding wars.',
        color: 'bg-emerald-100 text-emerald-600',
    },
    {
        icon: Globe,
        title: 'Free for Everyone',
        description:
            'Searching and contacting providers is completely free. No hidden fees, no account required.',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        icon: CheckCircle,
        title: 'Real-Time Map',
        description:
            'An interactive map lets you visually discover and verify nearby professionals before reaching out.',
        color: 'bg-purple-100 text-purple-600',
    },
];

const values = [
    {
        icon: Shield,
        title: 'Trust & Safety',
        description:
            'Every listing goes through an approval process. Phone verification and moderation keep the platform reliable.',
    },
    {
        icon: Users,
        title: 'Community First',
        description:
            'Built for local professionals — freelancers, technicians, tutors, and small businesses who serve their neighborhoods.',
    },
    {
        icon: Heart,
        title: 'Simplicity',
        description:
            'No complicated sign-ups or long forms. Find what you need, see who\'s nearby, and connect instantly.',
    },
    {
        icon: Lock,
        title: 'Privacy',
        description:
            'We don\'t track your live location or store personal profiles. Your privacy is respected at every step.',
    },
];

export const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                {/* subtle decorative circles */}
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10 animate-start animate-fadeInUp">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                        <Target className="w-4 h-4" />
                        Our Story
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        About{' '}
                        <span className="text-amber-500">NeryByService</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        We're on a mission to make finding trusted local
                        professionals as easy as opening a map. No directories,
                        no delays — just real people, nearby, ready to help.
                    </p>
                </div>
            </section>

            {/* ── Mission & Vision ────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-start animate-fadeInUp anim-delay-2">
                    {/* Mission */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex gap-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <Target className="w-7 h-7 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Our Mission
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                To connect people with nearby service providers
                                instantly — removing friction, wait times, and
                                unnecessary steps from the process of getting
                                help when you need it most.
                            </p>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex gap-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <Eye className="w-7 h-7 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Our Vision
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                A world where every skilled local professional
                                — from plumbers and electricians to tutors and
                                designers — is just a tap away, visible on a
                                map, and reachable directly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How It Works ────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-14 animate-start animate-fadeInUp anim-delay-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        Three simple steps to find the help you need.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-start animate-fadeInUp anim-delay-4">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.title}
                                className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center group hover:shadow-md transition-shadow"
                            >
                                {/* Step number badge */}
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-sm font-bold shadow-md">
                                    {idx + 1}
                                </span>
                                <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
                                    <Icon className="w-8 h-8 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Why Choose Us ───────────────────────────────────── */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 animate-start animate-fadeInUp anim-delay-5">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                            Why Choose NeryByService
                        </h2>
                        <p className="text-lg text-gray-500 max-w-xl mx-auto">
                            Built different, on purpose.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-start animate-fadeInUp anim-delay-6">
                        {features.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={f.title}
                                    className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {f.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {f.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Our Values ──────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-14 animate-start animate-fadeInUp anim-delay-7">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Our Values
                    </h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        The principles that guide everything we build.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-start animate-fadeInUp anim-delay-8">
                    {values.map((v) => {
                        const Icon = v.icon;
                        return (
                            <div
                                key={v.title}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="mx-auto w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                                    <Icon className="w-7 h-7 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {v.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {v.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="bg-gradient-to-r from-amber-500 to-amber-600 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center animate-start animate-fadeInUp">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-amber-100 text-lg mb-8 max-w-xl mx-auto">
                        Whether you're looking for a service or want to list
                        your own, we've got you covered.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-amber-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            Find Services
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/add-service"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            List Your Service
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
