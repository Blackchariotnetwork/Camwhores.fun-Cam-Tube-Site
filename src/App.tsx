/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TubeProvider, useTube } from './context/TubeContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FeedView } from './components/FeedView';
import { CategoriesView } from './components/CategoriesView';
import { ModelsDirectory } from './components/ModelsDirectory';
import { ModelProfileView } from './components/ModelProfileView';
import { UserDashboardView } from './components/UserDashboardView';
import { CMSPanel } from './components/CMSPanel';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab, selectedModelId, setSelectedModelId } = useTube();

  const renderActiveView = () => {
    // If viewing a specific model profile
    if (selectedModelId) {
      return (
        <ModelProfileView
          modelId={selectedModelId}
          onBack={() => setSelectedModelId(null)}
        />
      );
    }

    switch (activeTab) {
      case 'feed':
        return <FeedView />;
      case 'categories':
        return <CategoriesView />;
      case 'models':
        return <ModelsDirectory />;
      case 'history':
      case 'dashboard':
        return <UserDashboardView />;
      case 'cms':
        return <CMSPanel />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 w-full">
        {renderActiveView()}
      </main>

      <Footer />
      <MobileBottomNav />
      <VideoPlayerModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <TubeProvider>
      <AppContent />
    </TubeProvider>
  );
}
