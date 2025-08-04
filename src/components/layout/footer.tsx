
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, FileText, Users, Info, Briefcase as BriefcaseIcon, Newspaper, MessageCircleQuestion } from 'lucide-react'; // Added Newspaper, MessageCircleQuestion
import AdminFooter from '../admin-footer'; // Import the new AdminFooter

export default function Footer() {
  const importantLinks = [
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/services', label: 'Services', icon: BriefcaseIcon },
    { href: '/country-guides', label: 'Country Guides', icon: MapPin },
    { href: '/ai-assistants', label: 'Student Hub', icon: Users }, // Points to Smart Tools
    { href: '/blog', label: 'Blog', icon: Newspaper }, // Added Blog link
    { href: '/faq', label: 'FAQ', icon: MessageCircleQuestion },
    { href: '/contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <>
    <footer className="bg-primary text-primary-foreground mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <GraduationCap className="h-8 w-8" />
              <span className="text-2xl font-headline font-bold">Pixar Edu</span>
            </div>
            <p className="text-primary-foreground/90">
              Your trusted partner in achieving global education dreams. We provide expert guidance and comprehensive support for students aspiring to study abroad.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2">
              {importantLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center space-x-2 hover:text-accent transition-colors">
                    <link.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="flex items-center space-x-2 hover:text-accent transition-colors">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="flex items-center space-x-2 hover:text-accent transition-colors">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>New Baneshwor, Kathmandu, Nepal, 44600</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@pixaredu.com" className="hover:text-accent transition-colors">info@pixaredu.com</a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="tel:+9779761859757" className="hover:text-accent transition-colors">+977 9761859757</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} Pixar Educational Consultancy. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <AdminFooter />
    </>
  );
}
    
