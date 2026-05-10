import AboutSection from "@/components/AboutSection";
import EducationSection from "@/components/EducationSection";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black">
      <Hero />
      <AboutSection />
      <EducationSection />
    </div>
  );
}
