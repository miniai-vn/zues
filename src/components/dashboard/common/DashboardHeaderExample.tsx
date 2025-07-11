// Example usage of the refactored DashboardHeader

import DashboardHeader from '@/components/dashboard/common/dashboardHeader';

// In your page component
const ExamplePage = () => {
  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Navigate to profile page
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    // Navigate to settings page
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    // Handle logout logic
  };

  const handleViewAllNotifications = () => {
    console.log('View all notifications clicked');
    // Navigate to notifications page
  };

  return (
    <div>
      <DashboardHeader
        title="employees"
        userName="John Doe"
        userEmail="john.doe@example.com"
        avatarSrc="https://github.com/johndoe.png"
        avatarFallback="JD"
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={handleLogoutClick}
        onViewAllNotifications={handleViewAllNotifications}
      />
      {/* Your page content */}
    </div>
  );
};

export default ExamplePage;
