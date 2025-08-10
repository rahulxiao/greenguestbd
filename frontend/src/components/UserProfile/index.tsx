import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
}

interface UserProfileProps {
  profile: UserProfileData;
  onUpdate: (data: UserProfileData) => void;
  isEditing?: boolean;
  onEditToggle?: () => void;
  isLoading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onUpdate,
  isEditing = false,
  onEditToggle,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<UserProfileData>(profile);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onUpdate(formData);
  };

  const handleCancel = () => {
    setFormData(profile);
    setErrors({});
    onEditToggle?.();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
        {onEditToggle && (
          <Button
            variant={isEditing ? "secondary" : "primary"}
            size="small"
            onClick={onEditToggle}
            disabled={isLoading}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                <Camera className="h-3 w-3 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            {isEditing ? (
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                error={errors.firstName}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                {profile.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            {isEditing ? (
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                error={errors.lastName}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                {profile.lastName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                error={errors.email}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                {profile.email}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <Input
                value={formData.phoneNumber || ''}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number"
                icon={<Phone className="h-4 w-4 text-gray-400" />}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                {profile.phoneNumber || 'Not provided'}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {isEditing ? (
              <Input
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter address"
                icon={<MapPin className="h-4 w-4 text-gray-400" />}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                {profile.address || 'Not provided'}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 