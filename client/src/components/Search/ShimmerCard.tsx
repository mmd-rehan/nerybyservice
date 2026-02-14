import type { FC } from 'react';

export const ShimmerCard: FC = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-fadeIn">
            <div className="flex gap-4">
                {/* Avatar skeleton */}
                <div className="shrink-0 w-12 h-12 rounded-xl shimmer-bg animate-shimmer" />

                <div className="flex-1 space-y-3">
                    {/* Title */}
                    <div className="h-4 w-3/5 rounded-md shimmer-bg animate-shimmer" />
                    {/* Category badge */}
                    <div className="h-5 w-20 rounded-md shimmer-bg animate-shimmer" />
                    {/* Description lines */}
                    <div className="space-y-2 pt-1">
                        <div className="h-3 w-full rounded shimmer-bg animate-shimmer" />
                        <div className="h-3 w-4/5 rounded shimmer-bg animate-shimmer" />
                    </div>
                    {/* Distance */}
                    <div className="h-3 w-24 rounded shimmer-bg animate-shimmer pt-1" />
                </div>
            </div>

            {/* Button skeletons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="h-10 rounded-xl shimmer-bg animate-shimmer" />
                <div className="h-10 rounded-xl shimmer-bg animate-shimmer" />
            </div>
        </div>
    );
};
