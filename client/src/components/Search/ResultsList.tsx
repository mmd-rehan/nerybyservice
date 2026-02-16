import { type FC, useEffect, useRef } from 'react';
import { ServiceCard } from './ServiceCard';
import type { Service } from '../../api/serviceApi';
import { ShimmerCard } from './ShimmerCard';

interface ResultsListProps {
    results: Service[];
    onLoadMore?: () => void;
    hasMore?: boolean;
    loading?: boolean;
}

export const ResultsList: FC<ResultsListProps> = ({ results, onLoadMore, hasMore = false, loading = false }) => {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && onLoadMore) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, hasMore, loading, onLoadMore]);

    if (results.length === 0 && !loading) {
        return (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>No services found nearby.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <ShimmerCard key={`shimmer-${i}`} />
                    ))}
                </div>
            )}

            {hasMore && !loading && (
                <div ref={observerTarget} className="h-10 w-full flex items-center justify-center p-2 opacity-0">
                    <span className="sr-only">Loading more...</span>
                </div>
            )}

            {!hasMore && results.length > 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                    No more services to load
                </div>
            )}
        </div>
    );
};
