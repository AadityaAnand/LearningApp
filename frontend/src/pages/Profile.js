import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Camera, Save, Edit, Trash2, Shield, FileText, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword, uploadResume, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfileForm, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm();
  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    const { success } = await updateProfile(data);
    if (success) {
      setIsEditing(false);
      resetProfileForm(data);
    }
  };

  const onPasswordSubmit = async (data) => {
    const { success } = await changePassword(data.currentPassword, data.newPassword);
    if (success) {
      resetPasswordForm();
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please select a resume file');
      return;
    }

    setUploadingResume(true);
    const { success } = await uploadResume(resumeFile);
    if (success) {
      setResumeFile(null);
      // Reset the file input
      const fileInput = document.getElementById('resume-upload');
      if (fileInput) fileInput.value = '';
    }
    setUploadingResume(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    resetProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      avatar: user.avatar,
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'resume', name: 'Resume', icon: FileText },
    { id: 'security', name: 'Password', icon: Shield }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
              >
                <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                {!isEditing && (
                  <button type="button" onClick={handleEditToggle} className="btn-secondary">Edit</button>
                    )}
                  </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700">First Name</label>
                   <input type="text" disabled={!isEditing} {...registerProfile('firstName', { required: 'First name is required' })} className={`input mt-1 ${!isEditing ? 'bg-gray-100' : ''}`} />
                   {profileErrors.firstName && <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>}
                 </div>
                  <div>
                   <label className="block text-sm font-medium text-gray-700">Last Name</label>
                   <input type="text" disabled={!isEditing} {...registerProfile('lastName', { required: 'Last name is required' })} className={`input mt-1 ${!isEditing ? 'bg-gray-100' : ''}`} />
                   {profileErrors.lastName && <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" disabled value={user.email} className="input mt-1 bg-gray-100" />
                  </div>
                  <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700">Bio</label>
                   <textarea rows={3} disabled={!isEditing} {...registerProfile('bio')} className={`input mt-1 ${!isEditing ? 'bg-gray-100' : ''}`} />
                  </div>
                </div>

                {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={handleEditToggle} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary"><Save className="h-4 w-4 mr-2" />Save</button>
                  </div>
                )}
              </form>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Resume Management</h3>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Current Resume</h4>
                  {user.resumeUrl ? (
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600">Resume uploaded</span>
                      <span className="text-xs text-gray-500">({user.resumeUrl.split('/').pop()})</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">No resume uploaded</span>
                    </div>
                      )}
                    </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Upload New Resume</h4>
                  <form onSubmit={handleResumeUpload} className="space-y-4">
                    <div>
                      <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Resume File
                      </label>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>

                      <button
                      type="submit"
                      disabled={!resumeFile || uploadingResume}
                      className="btn-primary flex items-center"
                      >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                      </button>
                </form>
              </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">Why upload a resume?</h5>
                  <p className="text-sm text-blue-700">
                    Your resume helps our AI create a more personalized learning plan by understanding your current skills, experience, and career background. This leads to better recommendations and a more tailored learning experience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" {...registerPassword('currentPassword', { required: 'Current password is required' })} className="input mt-1" />
                {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>}
              </div>
                    <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Must be at least 8 characters' } })} className="input mt-1" />
                {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
                    </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" {...registerPassword('confirmPassword', { required: 'Please confirm password', validate: value => value === newPassword || 'Passwords do not match' })} className="input mt-1" />
                {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="btn-primary">Update Password</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 