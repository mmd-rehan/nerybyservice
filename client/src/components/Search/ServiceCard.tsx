import { type FC, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Phone, MessageCircle, MapPin, MoreVertical, Flag } from 'lucide-react';
import { Button } from '../ui/Button';
import { ReportModal } from './ReportModal';
import type { Category } from '../../api/categoryApi';

interface ServiceCardProps {
    id: string;
    title: string;
    category: Category;
    description: string;
    distance?: number;
    phone: string;
    whatsapp?: string;
}

export const ServiceCard: FC<ServiceCardProps> = ({
    id,
    title,
    category,
    description,
    distance,
    phone,
    whatsapp,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [toast, setToast] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const initials = title
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const formatDistance = (meters?: number) => {
        if (meters === undefined) return '';
        const km = meters / 1000;
        if (km < 1) return `${Math.round(meters)}m`;
        return `${km.toFixed(1)}km`;
    };

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(false), 3500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleReportSuccess = () => {
        setReportOpen(false);
        setToast(true);
    };

    return (
        <>
            <div className="relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out">
                <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold text-lg">
                        {initials}
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">{title}</h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                        {category.name}
                                    </span>
                                </div>
                            </div>

                            {/* 3-dot menu */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(!menuOpen);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="More actions"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-[menuFadeIn_0.15s_ease-out]">
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                setReportOpen(true);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <Flag className="w-4 h-4" />
                                            Report Item
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {description}
                        </p>

                        <div className="mt-4 flex items-center text-sm text-gray-400">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="mr-3">{distance !== undefined ? formatDistance(distance) : 'Unknown location'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <a href={`tel:${phone}`} className="flex-1">
                        <Button variant="primary" className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-10 text-sm">
                            <Phone className="w-3.5 h-3.5 mr-2" />
                            Call
                        </Button>
                    </a>
                    {whatsapp && (
                        <a
                            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10 text-sm">
                                <MessageCircle className="w-3.5 h-3.5 mr-2" />
                                WhatsApp
                            </Button>
                        </a>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            <ReportModal
                serviceId={id}
                serviceTitle={title}
                isOpen={reportOpen}
                onClose={() => setReportOpen(false)}
                onSuccess={handleReportSuccess}
            />

            {/* Success Toast */}
            {toast && createPortal(
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-2xl flex items-center gap-2 animate-[toastSlideUp_0.3s_ease-out]">
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Thank you. Your report has been submitted.
                </div>,
                document.body
            )}
        </>
    );
};
