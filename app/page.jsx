import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { PaymentFlow } from './components/PaymentFlow';
import { DeveloperSection } from './components/DeveloperSection';
import { DashboardPreview } from './components/DashboardPreview';
import { SecurityCompliance } from './components/SecurityCompliance';
import { FinalCTA } from './components/FinalCTA';
import { Navigation } from './components/Navigation';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Capabilities />
      <PaymentFlow />
      <DeveloperSection />
      <DashboardPreview />
      <SecurityCompliance />
      <FinalCTA />
    </div>
  );
}
