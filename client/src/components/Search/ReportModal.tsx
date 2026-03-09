import { type FC, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { submitReport } from '../../api/reportApi';
import { Button } from '../ui/Button';
import { AlertTriangle, X } from 'lucide-react';

interface ReportModalProps {
    serviceId: string;
    serviceTitle: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const REPORT_REASONS = [
    { value: '', label: 'Select a reason...' },
    { value: 'Spam', label: 'Spam' },
    { value: 'Fake Service', label: 'Fake Service' },
    { value: 'Incorrect Information', label: 'Incorrect Information' },
    { value: 'Offensive Content', label: 'Offensive Content' },
    { value: 'Scam / Fraud', label: 'Scam / Fraud' },
    { value: 'Other', label: 'Other' },
];

export const ReportModal: FC<ReportModalProps> = ({
    serviceId,
    serviceTitle,
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return;

        const wordCount = comment.trim() ? comment.trim().split(/\s+/).length : 0;
        if (wordCount < 3) {
            setError('Please provide a comment with at least 3 words.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await submitReport({
                serviceId,
                reason,
                comment: comment.trim() || undefined,
                reportedAt: new Date().toISOString(),
            });
            // Reset form
            setReason('');
            setComment('');
            onSuccess();
        } catch (err) {
            setError('Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[modalIn_0.25s_ease-out]"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Report This Service</h2>
                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[240px]">{serviceTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white focus:outline-none transition-all"
                        >
                            {REPORT_REASONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Comments <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Please provide additional details"
                            rows={4}
                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white focus:outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={!reason || isSubmitting}
                            isLoading={isSubmitting}
                            className="flex-1 rounded-xl h-11 bg-red-500 hover:bg-red-600 text-white shadow-none border-0"
                        >
                            Submit Report
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
