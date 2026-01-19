import { useState } from 'react'
import InputFeild from '../components/common/InputFeild'
import Checkbox from '../components/common/Checkbox'
import RadioButton from '../components/common/RadioButton'
import Button from '../components/common/Button'

type FieldType = 'text' | 'number' | 'email' | 'tel' | 'radio' | 'checkbox';

interface FieldOption {
    label: string;
    value: string;
}

interface FormField {
    id: string;
    type: FieldType;
    title: string;
    placeholder?: string;
    maxLength?: number;
    options?: FieldOption[];
    defaultValue?: string | boolean;
    name?: string;
    formBanner?: string;
    formTitle?: string;
    formDescription?: string;
}

function SinglePage() {
    const formTitle = "Registration Form";
    const formDescription = "Please fill out the details below.";
    const formBanner = "https://images.unsplash.com/photo-1768663319852-d2a2648f3950?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const initialFields: FormField[] = [
        {
            id: 'fullName',
            type: 'text',
            title: 'Full Name',
            placeholder: 'Enter your full name',
            defaultValue: ''
        },
        {
            id: 'email',
            type: 'email',
            title: 'Email Address',
            placeholder: 'Enter your email',
            defaultValue: ''
        },
        {
            id: 'phone',
            type: 'tel',
            title: 'Phone Number',
            placeholder: 'Enter your phone number',
            maxLength: 10,
            defaultValue: ''
        },
        {
            id: 'gender',
            type: 'radio',
            title: 'Gender',
            name: 'gender',
            defaultValue: 'Male',
            options: [
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' }
            ]
        },
        {
            id: 'terms',
            type: 'checkbox',
            title: 'I agree to the Terms and Conditions',
            defaultValue: false
        },
        {
            id: 'newsletter',
            type: 'checkbox',
            title: 'Subscribe to newsletter',
            defaultValue: true
        }
    ];

    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const initialData: Record<string, any> = {};
        initialFields.forEach(field => {
            initialData[field.id] = field.defaultValue;
        });
        return initialData;
    });

    const handleFieldChange = (id: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Form Submitted with Data:', formData);
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
                return (
                    <InputFeild
                        key={field.id}
                        title={field.title}
                        type={field.type}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        value={formData[field.id]}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                );
            case 'radio':
                return (
                    <div key={field.id} className="mt-2">
                        <label className="text-sm font-medium text-gray-900 mb-2 block">{field.title}</label>
                        <div className="flex gap-6">
                            {field.options?.map((option) => (
                                <RadioButton
                                    key={option.value}
                                    title={option.label}
                                    name={field.name || field.id}
                                    value={option.value}
                                    checked={formData[field.id] === option.value}
                                    onChange={(val) => handleFieldChange(field.id, val)}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'checkbox':
                return (
                    <Checkbox
                        key={field.id}
                        title={field.title}
                        checked={formData[field.id]}
                        onChange={(checked) => handleFieldChange(field.id, checked)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            {/* Banner Section */}
            <div className="w-full h-64">
                <img
                    src={formBanner}
                    alt="Form Banner"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="p-8">
                {/* Header Section */}
                <div className="mb-8 pb-6 border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {formTitle}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {formDescription}
                    </p>
                </div>

                {/* Form Fields Section */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-6">
                        {initialFields.map(field => renderField(field))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 bg-gray-50 -mx-8 -mb-8 p-8">
                        <Button
                            title="Submit Form"
                            onClick={handleSubmit}
                            bgColor="bg-blue-600 hover:bg-blue-700 w-full justify-center py-3 text-lg transition-all transform hover:scale-[1.01]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SinglePage