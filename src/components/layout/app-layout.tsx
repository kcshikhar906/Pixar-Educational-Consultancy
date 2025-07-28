import type { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import { Info } from 'lucide-react'; 
import FirebaseInitializer from '../firebase/initializer';
import SocialSidebar from './SocialSidebar';
import Chatbot from '../chatbot/Chatbot'; // Import the new Chatbot component

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const siteStatusMessage = "Discover your ideal university instantly with our new AI Pathway Planner on the homepage! Explore all our guides and tools under the 'Resources' menu.";
  
  const showSiteStatusMessage = true; 

  return (
    <div className="flex flex-col min-h-screen">
      <FirebaseInitializer />
      <Header />
      {showSiteStatusMessage && (
        <div className="bg-primary/10 text-primary border-b border-primary/20 p-3 text-center text-sm shadow-sm">
          <div className="container mx-auto flex items-center justify-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{siteStatusMessage}</p>
          </div>
        </div>
      )}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <SocialSidebar />
      <Chatbot /> {/* Add the Chatbot component here */}
      <Footer />
    </div>
  );
}
