import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FAQItem = {
    q: string;
    a: React.ReactNode;
};

type FAQCategory = {
    category: string;
    icon: string;
    questions: FAQItem[];
};

const faqData: FAQCategory[] = [
    {
        category: "General Questions",
        icon: "🔎",
        questions: [
            {
                q: "What is NeryByService?",
                a: "NeryByService is a location-first platform that connects you with nearby service providers in real time. Instead of browsing long directories, you see professionals near you on a map and contact them instantly."
            },
            {
                q: "How is this different from other service listing platforms?",
                a: (
                    <>
                        <p className="mb-2">Most platforms show large directories with outdated listings or providers far away.</p>
                        <p className="mb-2">NeryByService focuses on:</p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Providers within a specific radius</li>
                            <li>Real-time proximity</li>
                            <li>Direct call or WhatsApp contact</li>
                            <li>Map-based visual discovery</li>
                        </ul>
                        <p>No middleman. No long quote forms.</p>
                    </>
                )
            },
            {
                q: "Is NeryByService free to use?",
                a: "Yes. Searching and contacting service providers is completely free for users."
            }
        ]
    },
    {
        category: "For Users",
        icon: "👤",
        questions: [
            {
                q: "How do I find services near me?",
                a: (
                    <>
                        <p className="mb-2">Simply:</p>
                        <ol className="list-decimal pl-5 space-y-1 mb-2">
                            <li>Allow location access</li>
                            <li>Select a category</li>
                            <li>View nearby providers on the map</li>
                            <li>Contact them directly via call or WhatsApp</li>
                        </ol>
                        <p>You can also filter by radius (e.g., within 1km, 3km, etc.).</p>
                    </>
                )
            },
            {
                q: "Do I need to create an account to contact someone?",
                a: "No. You can directly call or message providers without creating an account."
            },
            {
                q: "How do I know the provider is actually nearby?",
                a: "We use precise geolocation technology to show providers based on their registered location. You can visually verify their position on the map before contacting them."
            },
            {
                q: "Does NeryByService handle payments?",
                a: "No. We only connect you directly with the provider. All service agreements and payments are handled between you and the provider."
            },
            {
                q: "What if I don’t get a response?",
                a: "You can contact multiple nearby providers instantly. There’s no restriction — choose whoever responds fastest or offers the best service."
            }
        ]
    },
    {
        category: "For Service Providers",
        icon: "🛠️",
        questions: [
            {
                q: "How do I list my service?",
                a: (
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Create an account</li>
                        <li>Add your service details</li>
                        <li>Set your location</li>
                        <li>Submit for approval</li>
                    </ol>
                )
            },
            {
                q: "Why should I join NeryByService?",
                a: (
                    <>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Get discovered by people physically near you</li>
                            <li>No bidding wars</li>
                            <li>Direct client contact</li>
                            <li>Increased visibility within your area</li>
                        </ul>
                        <p>It’s built for local professionals who want real nearby customers.</p>
                    </>
                )
            },
            {
                q: "Is there a subscription fee?",
                a: "Yes. We offer subscription plans for service providers to increase visibility and access premium features. Pricing details are available on the subscription page."
            },
            {
                q: "How do subscriptions work?",
                a: "You choose a plan and subscribe through our secure payment system. Once active, your listing receives enhanced visibility and priority placement."
            },
            {
                q: "Can I update my service details later?",
                a: "Yes. You can edit your service details, availability, and contact information anytime from your dashboard."
            },
            {
                q: "How do I improve my visibility?",
                a: (
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Choose the correct category</li>
                        <li>Keep your profile complete</li>
                        <li>Subscribe to a premium plan</li>
                        <li>Stay responsive to customers</li>
                    </ul>
                )
            }
        ]
    },
    {
        category: "For Professionals & Service Providers",
        icon: "👨‍🔧",
        questions: [
            {
                q: "Can I register myself as a professional?",
                a: (
                    <>
                        <p className="mb-2">Yes. Any skilled professional can register and list their service on the platform.</p>
                        <p className="mb-2">You simply:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li>Create an account</li>
                            <li>Verify your phone number</li>
                            <li>Add your service details</li>
                            <li>Submit for approval</li>
                        </ol>
                    </>
                )
            },
            {
                q: "Is registration mandatory to list a service?",
                a: (
                    <>
                        <p className="mb-2">Yes. Professionals must create an account to manage and update their listings.</p>
                        <p>Users searching for services do not need accounts.</p>
                    </>
                )
            },
            {
                q: "How many listings can I add?",
                a: (
                    <>
                        <p className="mb-2">Each professional can add up to <strong>3 service entries per week per person</strong>.</p>
                        <p className="mb-2">This policy helps:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Prevent spam</li>
                            <li>Maintain listing quality</li>
                            <li>Ensure fair visibility for all providers</li>
                        </ul>
                    </>
                )
            },
            {
                q: "Why is there a weekly limit?",
                a: "We want quality over quantity. The weekly cap ensures providers focus on accurate listings instead of flooding categories."
            },
            {
                q: "Can I add multiple categories?",
                a: "Yes, as long as they are relevant to your expertise and within the weekly listing limit."
            },
            {
                q: "Can I edit or delete my listing?",
                a: "Yes. You can manage, update, pause, or remove your listings anytime from your dashboard."
            },
            {
                q: "How long does approval take?",
                a: "Listings go through an approval review. Most entries are reviewed within 24–48 hours."
            },
            {
                q: "What happens if my listing is rejected?",
                a: "You will be notified with the reason. You can correct the details and resubmit."
            },
            {
                q: "What if I change my phone number?",
                a: "You will need to re-verify your new number before it becomes active on your listing."
            },
            {
                q: "Can I temporarily hide my service?",
                a: "Yes. You can deactivate your listing if you are unavailable."
            }
        ]
    },
    {
        category: "Location & Visibility",
        icon: "📍",
        questions: [
            {
                q: "How is my service location determined?",
                a: "When registering, you pin your service location on the map. This location determines where your service appears in search results."
            },
            {
                q: "Can I serve multiple areas?",
                a: "Currently, listings are location-based. If you serve multiple areas, you may create separate listings (within the allowed weekly limit)."
            },
            {
                q: "Does distance affect visibility?",
                a: "Yes. Users searching within a specific radius will see services closest to them first."
            }
        ]
    },
    {
        category: "Subscription & Premium Features",
        icon: "💰",
        questions: [
            {
                q: "What happens if I don’t subscribe?",
                a: (
                    <>
                        <p className="mb-2">Free listings are allowed. However, premium subscribers may receive:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Higher visibility</li>
                            <li>Priority placement</li>
                            <li>Featured badges</li>
                        </ul>
                    </>
                )
            },
            {
                q: "Can I cancel my subscription?",
                a: "Yes. You can cancel anytime. Your premium benefits remain active until the end of your billing cycle."
            }
        ]
    },
    {
        category: "Platform Rules",
        icon: "🚫",
        questions: [
            {
                q: "What type of services are not allowed?",
                a: (
                    <>
                        <p className="mb-2">We do not allow:</p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Illegal services</li>
                            <li>Fraudulent activities</li>
                            <li>Misleading listings</li>
                            <li>Duplicate spam entries</li>
                            <li>Inappropriate or harmful content</li>
                        </ul>
                        <p>Violations may result in permanent suspension.</p>
                    </>
                )
            },
            {
                q: "Can my account be suspended?",
                a: (
                    <>
                        <p className="mb-2">Yes. Accounts may be suspended if:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>False information is provided</li>
                            <li>Phone verification is bypassed</li>
                            <li>Spam listings are detected</li>
                            <li>Platform rules are violated</li>
                        </ul>
                    </>
                )
            }
        ]
    },
    {
        category: "Trust & Safety",
        icon: "🛡️",
        questions: [
            {
                q: "Does NeryByService verify providers?",
                a: "All listings go through an approval process before becoming visible. However, users should still verify details and agree on terms directly with providers."
            },
            {
                q: "Is my location shared publicly?",
                a: "Users’ exact location is not publicly displayed. Service providers’ listed business location is shown to enable proximity-based discovery."
            },
            {
                q: "Does NeryByService guarantee service quality?",
                a: "No. We connect users and providers directly. Users should verify credentials and agree on terms independently."
            },
            {
                q: "Can users leave reviews?",
                a: "Currently, we focus on proximity and direct contact. A review system may be introduced in future updates."
            },
            {
                q: "How do you prevent fake providers?",
                a: (
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Mandatory phone verification</li>
                        <li>Admin approval process</li>
                        <li>Weekly listing limits</li>
                        <li>Manual moderation</li>
                    </ul>
                )
            }
        ]
    },
    {
        category: "Privacy & Data Protection",
        icon: "🔐",
        questions: [
            {
                q: "Do you store my personal data?",
                a: (
                    <>
                        <p className="mb-2">If you are using NeryByService to search for services, we do <strong>not require account creation</strong>, and we do not store personal user profiles.</p>
                        <p>You can browse, search, and contact providers directly without creating an account.</p>
                    </>
                )
            },
            {
                q: "Do you track my live location?",
                a: "No. Your real-time location is only used temporarily to show nearby services. It is not publicly shared or permanently stored as a visible profile."
            },
            {
                q: "Do you share my number with service providers?",
                a: "No. When you directly call or message a provider, that communication happens outside the platform (phone or WhatsApp). We do not act as an intermediary."
            },
            {
                q: "Why do service providers need phone verification?",
                a: (
                    <>
                        <p className="mb-2">To prevent spam, fake listings, and fraud, all service providers must verify their phone number before their listing is approved.</p>
                        <p className="mb-2">This ensures:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Real professionals only</li>
                            <li>Valid contact numbers</li>
                            <li>Reduced fake entries</li>
                        </ul>
                    </>
                )
            },
            {
                q: "Do you sell user data?",
                a: "No. We do not sell or trade user data."
            }
        ]
    },
    {
        category: "Technical Questions",
        icon: "⚙️",
        questions: [
            {
                q: "Does the platform work on mobile?",
                a: "Yes. NeryByService is fully responsive and optimized for mobile devices."
            },
            {
                q: "Do I need to download an app?",
                a: "No. The platform works directly from your browser."
            },
            {
                q: "What happens if location permission is denied?",
                a: "You can manually search by selecting a category and adjusting the map area."
            }
        ]
    },
    {
        category: "Support",
        icon: "📞",
        questions: [
            {
                q: "How can I contact support?",
                a: "You can reach us through the Contact page or email us directly. We typically respond within 24 hours."
            }
        ]
    },
    {
        category: "Business & Platform Vision",
        icon: "📈",
        questions: [
            {
                q: "Who is NeryByService built for?",
                a: (
                    <>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Local professionals</li>
                            <li>Freelancers</li>
                            <li>Technicians</li>
                            <li>Tutors</li>
                            <li>Repair specialists</li>
                            <li>Small business owners</li>
                        </ul>
                        <p>It is designed to empower local service providers to connect with nearby customers instantly.</p>
                    </>
                )
            },
            {
                q: "Why focus on proximity instead of reviews?",
                a: (
                    <>
                        <p className="mb-2">Because in urgent situations, speed and distance matter more than browsing long feedback threads.</p>
                        <p>When you need help now, nearby availability is priority.</p>
                    </>
                )
            }
        ]
    }
];

const FAQItemComponent = ({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) => {
    return (
        <div className="border-b border-gray-100 last:border-none">
            <button
                className="w-full text-left py-4 px-6 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg transition-colors hover:bg-gray-50 bg-white"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="pb-5 px-6 text-gray-600 leading-relaxed bg-white">
                    {item.a}
                </div>
            </div>
        </div>
    );
};

export const FAQ = () => {
    const [openItem, setOpenItem] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>(faqData[0].category);

    const activeQuestions = faqData.find(cat => cat.category === activeCategory)?.questions || [];

    const handleToggle = (q: string) => {
        setOpenItem(openItem === q ? null : q);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-start animate-fadeInUp">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Find answers to common questions about NeryByService.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Sidebar / Category Selection */}
                    <div className="lg:col-span-4 space-y-2 animate-start animate-fadeInUp anim-delay-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Categories</h3>
                            <nav className="space-y-1">
                                {faqData.map((category) => (
                                    <button
                                        key={category.category}
                                        onClick={() => {
                                            setActiveCategory(category.category);
                                            setOpenItem(null);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeCategory === category.category
                                                ? 'bg-amber-50 text-amber-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-xl">{category.icon}</span>
                                        <span>{category.category}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="lg:col-span-8 animate-start animate-fadeInUp anim-delay-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-2xl">{faqData.find(c => c.category === activeCategory)?.icon}</span>
                                    {activeCategory}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {activeQuestions.map((item) => (
                                    <FAQItemComponent
                                        key={item.q}
                                        item={item}
                                        isOpen={openItem === item.q}
                                        onClick={() => handleToggle(item.q)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
