import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Camera, Save, Edit, Trash2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm();

  const newPassword = watchPassword('newPassword');

  const onProfileSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      setIsEditing(false);
      resetProfile(data);
    }
  };

  const onPasswordSubmit = async (data) => {
    const result = await changePassword(data.currentPassword, data.newPassword);
    if (result.success) {
      setIsChangingPassword(false);
      resetPassword();
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      resetProfile();
    }
    setIsEditing(!isEditing);
  };

  const handlePasswordToggle = () => {
    if (isChangingPassword) {
      resetPassword();
    }
    setIsChangingPassword(!isChangingPassword);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'preferences', name: 'Preferences', icon: Mail },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              className="h-20 w-20 rounded-full bg-gray-50"
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=fff&size=80`}
              alt=""
            />
            <button className="absolute bottom-0 right-0 p-1 bg-primary-600 text-white rounded-full hover:bg-primary-700">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600">@{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEditToggle}
              className="btn btn-secondary"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className={`input mt-1 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.firstName ? 'border-red-300' : ''}`}
                      {...registerProfile('firstName', {
                        required: 'First name is required',
                      })}
                    />
                    {profileErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className={`input mt-1 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.lastName ? 'border-red-300' : ''}`}
                      {...registerProfile('lastName', {
                        required: 'Last name is required',
                      })}
                    />
                    {profileErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      disabled={!isEditing}
                      className={`input mt-1 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.bio ? 'border-red-300' : ''}`}
                      placeholder="Tell us about yourself..."
                      {...registerProfile('bio', {
                        maxLength: {
                          value: 500,
                          message: 'Bio cannot exceed 500 characters',
                        },
                      })}
                    />
                    {profileErrors.bio && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.bio.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      disabled={!isEditing}
                      className={`input mt-1 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.avatar ? 'border-red-300' : ''}`}
                      placeholder="https://example.com/avatar.jpg"
                      {...registerProfile('avatar', {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: 'Please enter a valid URL',
                        },
                      })}
                    />
                    {profileErrors.avatar && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.avatar.message}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className={`input mt-1 ${passwordErrors.currentPassword ? 'border-red-300' : ''}`}
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required',
                        })}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        className={`input mt-1 ${passwordErrors.newPassword ? 'border-red-300' : ''}`}
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className={`input mt-1 ${passwordErrors.confirmPassword ? 'border-red-300' : ''}`}
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) =>
                            value === newPassword || 'Passwords do not match',
                        })}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handlePasswordToggle}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Change Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
                    <div className="flex items-center">
                      <Trash2 className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delete Account</p>
                        <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-500">Receive email updates about your learning progress</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={user?.preferences?.emailNotifications} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      defaultChecked={user?.preferences?.theme === 'light'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Light</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      defaultChecked={user?.preferences?.theme === 'dark'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Dark</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 