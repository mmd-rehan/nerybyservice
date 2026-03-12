import { type FC, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (code: string) => void;
    phoneNumber: string;
}

export const OtpModal: FC<OtpModalProps> = ({ isOpen, onClose, onVerify, phoneNumber }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setIsLoading(false);
            onVerify(code);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Phone Number</h2>
                <p className="text-gray-600 mb-6">
                    Enter the 4-digit code sent to <span className="font-medium text-gray-900">{phoneNumber}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="0000"
                        maxLength={4}
                        className="text-center text-2xl tracking-widest letter-spacing-2"
                        autoFocus
                    />

                    <div className="flex gap-3 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            isLoading={isLoading}
                            disabled={code.length !== 4}
                        >
                            Verify
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
