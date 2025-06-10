import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8" />
              <span className="text-2xl font-headline font-bold">Pixar Edu</span>
            </div>
            <p className="text-sm">
              Your trusted partner in achieving global education dreams. We provide expert guidance and comprehensive support for students aspiring to study abroad.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="/countries/europe" className="hover:text-accent transition-colors">Country Guides</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-headline">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>123 Education Lane, Knowledge City, Global</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@pixaredu.com" className="hover:text-accent transition-colors">info@pixaredu.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <a href="tel:+1234567890" className="hover:text-accent transition-colors">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Pixar Educational Consultancy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
