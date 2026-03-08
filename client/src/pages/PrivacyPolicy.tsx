import { Link } from 'react-router-dom';
import {
    Shield,
    Eye,
    Database,
    Lock,
    UserX,
    Globe,
    Bell,
    Mail,
    Cookie,
    AlertTriangle,
    FileText,
    Phone,
} from 'lucide-react';

/* ─── Last updated date ─────────────────────────────────────── */
const LAST_UPDATED = 'March 8, 2026';

/* ─── Section data ──────────────────────────────────────────── */
const sections = [
    {
        id: 'information-we-collect',
        icon: Database,
        color: 'bg-blue-100 text-blue-600',
        title: '1. Information We Collect',
        content: (
            <>
                <p className="mb-4">
                    NeryByService collects only the minimum information necessary to operate
                    the platform. We collect information in two ways:
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">
                    a) Information You Provide Voluntarily
                </h4>
                <ul className="list-disc list-inside space-y-1 mb-4 text-gray-600">
                    <li>
                        <strong>Service listings:</strong> When a provider submits a
                        service, we collect the provider's name, service category,
                        description, contact number, optional WhatsApp number, and
                        business location (latitude/longitude).
                    </li>
                    <li>
                        <strong>Contact form submissions:</strong> If you use our contact
                        form, we collect your name, email address, and the content of
                        your message in order to respond to your inquiry.
                    </li>
                    <li>
                        <strong>Report submissions:</strong> If you report a listing, we
                        collect the reason and any optional description you provide.
                    </li>
                </ul>
                <h4 className="font-semibold text-gray-900 mb-2">
                    b) Information Collected Automatically
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>
                        <strong>Approximate location:</strong> With your explicit browser
                        permission, we use your device's geolocation API to display
                        nearby service providers. We do <em>not</em> store or log your
                        coordinates on our servers.
                    </li>
                    <li>
                        <strong>Usage data:</strong> Standard web-server logs may record
                        your IP address, browser type, operating system, referring URL,
                        pages visited, and timestamps. These logs are used solely for
                        security monitoring and aggregate analytics.
                    </li>
                    <li>
                        <strong>Cookies &amp; local storage:</strong> We use minimal
                        browser storage (session cookies and localStorage) to maintain
                        your search preferences and UI state during your visit. No
                        third-party tracking cookies are set.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: 'how-we-use-information',
        icon: Eye,
        color: 'bg-amber-100 text-amber-600',
        title: '2. How We Use Your Information',
        content: (
            <>
                <p className="mb-4">
                    We use the information we collect exclusively for the following
                    purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                        To display service listings and enable users to discover nearby
                        providers.
                    </li>
                    <li>
                        To allow users to contact providers directly via phone or
                        WhatsApp.
                    </li>
                    <li>
                        To respond to inquiries submitted through the contact form.
                    </li>
                    <li>
                        To review and moderate reported listings to maintain platform
                        quality.
                    </li>
                    <li>
                        To detect, prevent, and investigate fraudulent, abusive, or
                        illegal activity.
                    </li>
                    <li>
                        To generate anonymised, aggregate statistics about platform usage
                        (e.g., most-searched service categories).
                    </li>
                    <li>
                        To improve the functionality, performance, and user experience of
                        the platform.
                    </li>
                </ul>
                <p className="mt-4">
                    We do <strong>not</strong> sell, rent, or trade your personal
                    information to any third party for marketing purposes.
                </p>
            </>
        ),
    },
    {
        id: 'data-sharing',
        icon: Globe,
        color: 'bg-purple-100 text-purple-600',
        title: '3. Data Sharing & Disclosure',
        content: (
            <>
                <p className="mb-4">
                    We do not sell or share your personal data with third parties except
                    in the limited circumstances described below:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>
                        <strong>Service providers:</strong> We may share data with
                        trusted sub-processors (e.g., hosting infrastructure, email
                        delivery services) that help us operate the platform. These
                        parties are contractually bound to process data only on our
                        behalf and in accordance with this policy.
                    </li>
                    <li>
                        <strong>Legal obligations:</strong> We may disclose information
                        if required by law, court order, or governmental authority, or
                        where we believe disclosure is necessary to protect the safety of
                        any person or to prevent illegal activity.
                    </li>
                    <li>
                        <strong>Business transfers:</strong> In the event of a merger,
                        acquisition, or sale of substantially all of our assets, your
                        information may be transferred as part of that transaction. We
                        will notify you via a prominent notice on our website before your
                        data becomes subject to a different privacy policy.
                    </li>
                </ul>
                <p>
                    Provider contact details (phone number, optional WhatsApp number,
                    and service location) are intentionally displayed publicly as part
                    of the service listing. Providers consent to such public display
                    when they submit a listing.
                </p>
            </>
        ),
    },
    {
        id: 'data-retention',
        icon: Database,
        color: 'bg-green-100 text-green-600',
        title: '4. Data Retention',
        content: (
            <>
                <p className="mb-4">
                    We retain data for as long as necessary to fulfil the purposes
                    described in this policy, subject to the following:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                        <strong>Service listings:</strong> Retained until the provider
                        requests removal or the listing is removed following a
                        moderation decision. Providers may contact us at any time to
                        request deletion.
                    </li>
                    <li>
                        <strong>Contact-form messages:</strong> Retained for up to 12
                        months from receipt, after which they are permanently deleted.
                    </li>
                    <li>
                        <strong>Server logs:</strong> Automatically purged after 30 days.
                    </li>
                    <li>
                        <strong>Geolocation data:</strong> Never stored on our servers.
                        Coordinates used for search are processed in real time and
                        discarded immediately.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: 'cookies',
        icon: Cookie,
        color: 'bg-orange-100 text-orange-600',
        title: '5. Cookies & Tracking Technologies',
        content: (
            <>
                <p className="mb-4">
                    We use a minimal set of cookies and browser storage technologies:
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 font-semibold text-gray-900 border border-gray-200">
                                    Name / Type
                                </th>
                                <th className="px-4 py-2 font-semibold text-gray-900 border border-gray-200">
                                    Purpose
                                </th>
                                <th className="px-4 py-2 font-semibold text-gray-900 border border-gray-200">
                                    Duration
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 border border-gray-200">
                                    Session cookie
                                </td>
                                <td className="px-4 py-2 border border-gray-200">
                                    Maintains UI state during your visit
                                </td>
                                <td className="px-4 py-2 border border-gray-200">
                                    Session (deleted when browser closes)
                                </td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="px-4 py-2 border border-gray-200">
                                    localStorage (search preferences)
                                </td>
                                <td className="px-4 py-2 border border-gray-200">
                                    Saves last-used search radius and category
                                </td>
                                <td className="px-4 py-2 border border-gray-200">
                                    Persistent (cleared when you clear browser data)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="mt-4">
                    We do <strong>not</strong> use advertising cookies, fingerprinting
                    scripts, or third-party analytics trackers (e.g., Google Analytics).
                    You can disable cookies in your browser settings; however, some
                    features of the platform may not function correctly as a result.
                </p>
            </>
        ),
    },
    {
        id: 'security',
        icon: Lock,
        color: 'bg-red-100 text-red-600',
        title: '6. Data Security',
        content: (
            <>
                <p className="mb-4">
                    We implement reasonable technical and organisational measures to
                    protect information against unauthorised access, alteration,
                    disclosure, or destruction. These include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>HTTPS/TLS encryption for all data in transit.</li>
                    <li>
                        Access controls limiting database access to authorised personnel
                        only.
                    </li>
                    <li>Regular security reviews and dependency updates.</li>
                    <li>Input validation and sanitisation to prevent injection attacks.</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-sm">
                        <strong>Important:</strong> No method of data transmission over
                        the internet is 100% secure. While we strive to use commercially
                        acceptable means to protect your information,{' '}
                        <strong>
                            we cannot guarantee absolute security
                        </strong>{' '}
                        and we assume no liability for unauthorised access beyond our
                        reasonable control.
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 'your-rights',
        icon: UserX,
        color: 'bg-indigo-100 text-indigo-600',
        title: '7. Your Rights & Choices',
        content: (
            <>
                <p className="mb-4">
                    Depending on your jurisdiction, you may have certain rights in
                    relation to your personal data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>
                        <strong>Access:</strong> Request a copy of the personal data we
                        hold about you.
                    </li>
                    <li>
                        <strong>Correction:</strong> Request that inaccurate or
                        incomplete data be corrected.
                    </li>
                    <li>
                        <strong>Deletion:</strong> Request that your data (e.g., a service
                        listing or contact-form message) be permanently deleted.
                    </li>
                    <li>
                        <strong>Objection:</strong> Object to processing of your data
                        where we rely on legitimate interests.
                    </li>
                    <li>
                        <strong>Geolocation:</strong> You can deny or revoke browser
                        geolocation permission at any time through your browser or device
                        settings.
                    </li>
                </ul>
                <p>
                    To exercise any of these rights, please contact us using the details
                    in Section 11. We will respond to all legitimate requests within 30
                    days. We reserve the right to verify your identity before processing
                    any request.
                </p>
                <p className="mt-3 text-sm text-gray-500">
                    <strong>Note:</strong> NeryByService is a platform, not an employer
                    or agency. We have no control over and assume no responsibility for
                    how individual service providers handle personal information they
                    receive directly from users (e.g., through phone calls or WhatsApp
                    messages).
                </p>
            </>
        ),
    },
    {
        id: 'third-party-links',
        icon: Globe,
        color: 'bg-teal-100 text-teal-600',
        title: '8. Third-Party Links & Services',
        content: (
            <>
                <p className="mb-4">
                    The platform may contain links to external websites or services
                    (for example, WhatsApp messaging links, map tile providers). We
                    are not responsible for the privacy practices or content of those
                    third-party websites. We encourage you to review the privacy policy
                    of any third-party service you interact with.
                </p>
                <p>
                    Map tiles are rendered using an open-source mapping library. Requests
                    to load map tiles may reveal your IP address to the tile server
                    operator. Please consult the relevant provider's privacy policy for
                    details.
                </p>
            </>
        ),
    },
    {
        id: 'childrens-privacy',
        icon: Shield,
        color: 'bg-pink-100 text-pink-600',
        title: "9. Children's Privacy",
        content: (
            <p>
                NeryByService is not directed at children under the age of 13 (or the
                applicable minimum age in your jurisdiction). We do not knowingly
                collect personal information from children. If we become aware that
                we have inadvertently collected information from a child, we will
                promptly delete it. If you believe a child has provided us with
                personal data, please contact us immediately using the details in
                Section 11.
            </p>
        ),
    },
    {
        id: 'changes',
        icon: Bell,
        color: 'bg-yellow-100 text-yellow-600',
        title: '10. Changes to This Policy',
        content: (
            <>
                <p className="mb-4">
                    We may update this Privacy Policy from time to time to reflect
                    changes in our practices, technology, legal requirements, or for
                    other operational reasons. When we make material changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                    <li>
                        Update the "Last Updated" date at the top of this page.
                    </li>
                    <li>
                        Post a prominent notice on the platform for at least 14 days
                        following the change.
                    </li>
                </ul>
                <p>
                    Your continued use of NeryByService after the effective date of a
                    revised policy constitutes your acceptance of the updated terms. If
                    you do not agree with the changes, you should discontinue use of
                    the platform.
                </p>
            </>
        ),
    },
    {
        id: 'contact',
        icon: Mail,
        color: 'bg-cyan-100 text-cyan-600',
        title: '11. Contact Us',
        content: (
            <>
                <p className="mb-4">
                    If you have any questions, concerns, or requests regarding this
                    Privacy Policy or the way we handle your data, please reach out:
                </p>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <span>support@nerybyservice.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <span>Available via our{' '}
                            <Link to="/contact" className="text-amber-600 hover:underline font-medium">
                                Contact Page
                            </Link>
                        </span>
                    </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    We aim to respond to all privacy-related requests within{' '}
                    <strong>30 business days</strong>.
                </p>
            </>
        ),
    },
];

/* ─── Component ─────────────────────────────────────────────── */
export const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                        <Shield className="w-4 h-4" />
                        Your Privacy Matters
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Privacy{' '}
                        <span className="text-amber-500">Policy</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        We believe in transparency. This policy explains exactly what
                        data we collect, why we collect it, and how we protect it.
                    </p>
                    <p className="mt-6 text-sm text-gray-500">
                        Last updated: <span className="text-gray-400 font-medium">{LAST_UPDATED}</span>
                    </p>
                </div>
            </section>

            {/* ── Disclaimer Banner ─────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 shadow-sm">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 leading-relaxed">
                        <strong>Disclaimer:</strong> NeryByService is a discovery
                        platform that connects users with independent service providers.
                        We are not responsible for and expressly disclaim all liability
                        in connection with the conduct, services, or communications of
                        any service provider listed on the platform. Use the platform at
                        your own discretion.
                    </div>
                </div>
            </div>

            {/* ── Table of Contents ─────────────────────────────────── */}
            <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-gray-900">Table of Contents</h2>
                    </div>
                    <ol className="space-y-1.5 text-sm text-gray-600 list-decimal list-inside columns-1 sm:columns-2">
                        {sections.map((s) => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    className="hover:text-amber-600 transition-colors"
                                >
                                    {s.title.replace(/^\d+\.\s/, '')}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </nav>

            {/* ── Sections ──────────────────────────────────────────── */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <section
                            key={section.id}
                            id={section.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 scroll-mt-20"
                        >
                            <div className="flex items-start gap-4 mb-5">
                                <div
                                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${section.color}`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 pt-2.5">
                                    {section.title}
                                </h2>
                            </div>
                            <div className="text-gray-600 leading-relaxed text-[15px]">
                                {section.content}
                            </div>
                        </section>
                    );
                })}

                {/* ── Closing note ──────────────────────────────────── */}
                <div className="text-center py-6 text-sm text-gray-400">
                    <p>
                        This Privacy Policy was last updated on{' '}
                        <span className="font-medium text-gray-500">{LAST_UPDATED}</span>.
                    </p>
                    <p className="mt-1">
                        © {new Date().getFullYear()} NeryByService. All rights reserved.
                    </p>
                </div>
            </main>
        </div>
    );
};
