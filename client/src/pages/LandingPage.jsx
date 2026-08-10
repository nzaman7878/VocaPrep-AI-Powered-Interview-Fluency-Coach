import PageLayout from '../components/layout/PageLayout';
import HeroSection from '../components/landing/HeroSection';
import FeatureCards from '../components/landing/FeatureCards';
import HowItWorks from '../components/landing/HowItWorks';
import CTASection from '../components/landing/CTASection';
import useDocumentTitle from '../hooks/useDocumentTitle';

export const LandingPage = () => {
  useDocumentTitle('Master Your Next Tech Interview');

  return (
    <PageLayout withSidebar={false} withFooter={true}>
      <div className="bg-grain relative -mx-4 sm:-mx-6 lg:-mx-8">
        <HeroSection />
        <HowItWorks />
        <FeatureCards />
        <CTASection />
      </div>
    </PageLayout>
  );
};

export default LandingPage;
