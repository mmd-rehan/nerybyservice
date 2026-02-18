import { type FC } from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
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
    title,
    category,
    description,
    distance,
    phone,
    whatsapp,
}) => {
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

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out">
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
                    </div>

                    <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {description}
                    </p>

                    <div className="mt-4 flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="mr-3">{distance !== undefined ? formatDistance(distance) : 'Unknown location'}</span>
                        {/* <span className="text-gray-300">|</span>
             <span className="ml-3">$??/hr</span>  -- Add if price is added to schema */}
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
    );
};
