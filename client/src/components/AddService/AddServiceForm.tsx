import { Briefcase, CheckCircle, Globe, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserLocation } from '../../hooks/useUserLocation';
import { createService, type ServiceData } from '../../api/serviceApi';
import { OtpModal } from '../Auth/OtpModal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { LocationPicker } from './LocationPicker';

const CATEGORIES = [
    { value: 'Plumber', label: 'Plumber' },
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Carpenter', label: 'Carpenter' },
    { value: 'Mechanic', label: 'Mechanic' },
    { value: 'Cleaner', label: 'Cleaner' },
    { value: 'Painter', label: 'Painter' },
    { value: 'Other', label: 'Other' },
];

export const AddServiceForm = () => {
    // Form State
    const [formData, setFormData] = useState({
        businessName: '',
        category: CATEGORIES[0].value,
        customCategory: '',
        language: '',
        description: '',
        phone: '',
        whatsapp: '',
    });

    // Location State
    const DEFAULT_LOCATION = { lat: 40.7128, lng: -74.0060 };

    const [location, setLocation] = useState(DEFAULT_LOCATION);
    const { location: userLocation } = useUserLocation();

    // Update location when userLocation is fetched
    useEffect(() => {
        if (userLocation) {
            setLocation(userLocation);
        }
    }, [userLocation]);

    const [radius, setRadius] = useState(5000); // 5km default

    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.businessName || !formData.description || !formData.phone) {
            alert('Please fill in all required fields');
            return;
        }
        setIsOtpOpen(true);
    };

    const handleVerify = async (token: string) => {
        setIsOtpOpen(false);
        setIsSubmitting(true);
        try {
            console.log("Verifying with token:", token);

            const payload: ServiceData = {
                serviceTitle: formData.businessName,
                category: formData.category === 'Other' ? formData.customCategory : formData.category,
                language: formData.language,
                description: formData.description,
                phoneNumber: formData.phone,
                contactDetails: {
                    phone: formData.phone,
                    whatsapp: formData.whatsapp || formData.phone,
                },
                location: {
                    type: 'Point',
                    coordinates: [location.lng, location.lat],
                },
                radius: radius,
            };

            await createService(payload);
            setSuccessMessage('Service registered successfully!');
            setFormData({
                businessName: '',
                category: CATEGORIES[0].value,
                customCategory: '',
                language: '',
                description: '',
                phone: '',
                whatsapp: '',
            });
        } catch (error: any) {
            console.error(error);
            alert('Failed to register service: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (successMessage) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-lg mx-auto mt-20 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Success!</h2>
                <p className="text-gray-500 mb-8 text-lg">Your service has been successfully registered.</p>
                <Button
                    className="bg-black text-white hover:bg-gray-800 rounded-xl px-8 py-3"
                    onClick={() => setSuccessMessage('')}
                >
                    Register Another Business
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                    Register Your Service
                </h1>
                <p className="text-lg text-gray-500">
                    Join our network and reach more customers in your area.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleFormSubmit} className="p-6 md:p-10 space-y-10">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Business Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Business Name"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Joe's Plumbing"
                                required
                                className="rounded-xl border-gray-200 focus:ring-black"
                            />
                            <div className="space-y-4">
                                <Select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    options={CATEGORIES}
                                    className="rounded-xl border-gray-200 focus:ring-black"
                                />
                                {formData.category === 'Other' && (
                                    <Input
                                        placeholder="Specify category..."
                                        name="customCategory"
                                        value={formData.customCategory}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-gray-200 focus:ring-black"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Language(s) Spoken"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                placeholder="English, Spanish"
                                required
                                icon={<Globe className="w-4 h-4" />}
                                className="rounded-xl border-gray-200 focus:ring-black"
                            />
                        </div>

                        <Textarea
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your services..."
                            rows={4}
                            required
                            className="rounded-xl border-gray-200 focus:ring-black"
                        />
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Phone className="w-5 h-5 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                required
                                type="tel"
                                icon={<Phone className="w-4 h-4" />}
                                className="rounded-xl border-gray-200 focus:ring-black"
                            />
                            <Input
                                label="WhatsApp (Optional)"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                type="tel"
                                icon={<MessageCircle className="w-4 h-4" />}
                                className="rounded-xl border-gray-200 focus:ring-black"
                            />
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Service Location</h3>
                        </div>
                        <LocationPicker
                            value={location}
                            onChange={setLocation}
                            radius={radius}
                            onRadiusChange={setRadius}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full text-lg font-bold bg-black text-white hover:bg-gray-800 rounded-xl py-4 shadow-none transition-all"
                            disabled={isSubmitting}
                        >
                            Verify & Register
                            {isSubmitting ? 'Registering...' : 'Verify & Register'}
                        </Button>
                    </div>
                </form>
            </div>

            <OtpModal
                isOpen={isOtpOpen}
                onClose={() => setIsOtpOpen(false)}
                onVerify={handleVerify}
                phoneNumber={formData.phone}
            />
        </div>
    );
};
