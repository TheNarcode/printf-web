'use client';

import React, { memo } from 'react';
import { User } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface ProfileButtonProps {
  userName?: string | null;
  userPhoto?: string | null;
  onPress: () => void;
}

const ProfileButton = memo(({ userName, userPhoto, onPress }: ProfileButtonProps) => {
  const { colors } = useTheme();
  const initial = userName ? userName.charAt(0).toUpperCase() : null;

  return (
    <button
      onClick={onPress}
      className="w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden transition-opacity hover:opacity-75"
      style={{
        backgroundColor: colors.surface,
        borderColor: userPhoto ? 'transparent' : colors.border,
      }}
      aria-label="Profile"
    >
      {userPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={userPhoto} alt={userName || 'Profile'} className="w-full h-full object-cover" />
      ) : initial ? (
        <span className="text-sm font-semibold" style={{ color: colors.text }}>{initial}</span>
      ) : (
        <User size={16} color={colors.textMuted} strokeWidth={2} />
      )}
    </button>
  );
});

ProfileButton.displayName = 'ProfileButton';
export default ProfileButton;
