import { type FC } from 'react';
import { ServiceCard } from './ServiceCard';
import type { Service } from '../../api/serviceApi';

interface ResultsListProps {
    results: Service[];
}

export const ResultsList: FC<ResultsListProps> = ({ results }) => {
    if (results.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>No services found nearby.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {results.map((service, index) => (
                <div
                    key={service._id}
                    className={`animate-start animate-fadeInUp anim-delay-${Math.min(index + 1, 8)}`}
                >
                    <ServiceCard
                        id={service._id}
                        title={service.serviceTitle}
                        category={service.category}
                        description={service.description}
                        distance={service.distance}
                        phone={service.phoneNumber || service.contactDetails?.phone}
                        whatsapp={service.contactDetails?.whatsapp}
                    />
                </div>
            ))}
        </div>
    );
};
