import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';
import { useThree } from '@/hooks/use-three';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Instagram, 
  Twitter, 
  Facebook, 
  Send 
} from 'lucide-react';

export default function Contact() {
  const { animate } = useGSAP();
  const { setupParticlesBackground } = useThree();
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const particlesBgRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contactSectionRef.current) {
      animate(contactSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }, { from: { opacity: 0, y: 50 } });
    }

    if (formRef.current && connectRef.current) {
      animate([formRef.current, connectRef.current], {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        delay: 0.5,
      }, { from: { opacity: 0, x: -50 } });
    }

    // Set up particles background
    if (particlesBgRef.current) {
      setupParticlesBackground(particlesBgRef.current);
    }
  }, [animate, setupParticlesBackground]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, we would submit the form data to a server
    alert('Thank you for your message! We will get back to you soon.');
  }

  return (
    <section 
      id="contact" 
      ref={contactSectionRef}
      className="py-20 px-8 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div ref={particlesBgRef} className="w-full h-full"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="inline-block text-5xl font-heading font-bold relative">
            <span className="relative z-10">Contact Us</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-primary opacity-30"></span>
          </h2>
          <p className="text-xl mt-4 text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or interested in collaborations? Reach out to our team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <form 
              ref={formRef} 
              className="space-y-6"
              onSubmit={handleSubmit}
              style={{ opacity: 0, transform: 'translateX(-50px)' }}
            >
              <div>
                <label className="block text-muted-foreground mb-2" htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-background/50 border border-border rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-all" 
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2" htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-background/50 border border-border rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-all" 
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2" htmlFor="subject">Subject</label>
                <select 
                  id="subject" 
                  className="w-full bg-background/50 border border-border rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                  required
                >
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-2" htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full bg-background/50 border border-border rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-all" 
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn-animated w-full bg-primary hover:bg-opacity-90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div 
            ref={connectRef}
            className="flex flex-col justify-between"
            style={{ opacity: 0, transform: 'translateX(-50px)' }}
          >
            <div>
              <h3 className="text-2xl font-heading font-bold mb-6 text-white">Connect With Us</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 text-primary p-3 rounded-lg">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Our Location</h4>
                    <p className="text-muted-foreground">123 Innovation Avenue, Tech District, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 text-primary p-3 rounded-lg">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email Us</h4>
                    <p className="text-muted-foreground">hello@novafashion.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 text-primary p-3 rounded-lg">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Call Us</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h4 className="text-white font-medium mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-background/50 border border-border w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram />
                  </a>
                  <a 
                    href="#" 
                    className="bg-background/50 border border-border w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                    aria-label="Twitter"
                  >
                    <Twitter />
                  </a>
                  <a 
                    href="#" 
                    className="bg-background/50 border border-border w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0 h-72 relative rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3" 
                alt="Our store" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-xl font-heading font-bold text-white mb-1">Visit Our Flagship Store</h4>
                <p className="text-muted-foreground">Experience NOVA in person</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
