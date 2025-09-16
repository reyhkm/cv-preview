
import React, { useState, useEffect, useCallback, FormEvent } from 'react';

interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

const PageContent: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [theme, setTheme] = useState('light');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- THEME LOGIC ---
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    // --- SCROLL ANIMATION LOGIC ---
    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.2 });

        const elementsToAnimate = document.querySelectorAll('.animate-mask');
        elementsToAnimate.forEach(el => revealObserver.observe(el));

        return () => elementsToAnimate.forEach(el => revealObserver.unobserve(el));
    }, []);

    // --- NOTIFICATION LOGIC ---
    const showNotification = useCallback((message: string, type: 'success' | 'error') => {
        const id = Date.now();
        const newNotification: Notification = { id, message, type, visible: false };

        setNotifications(prev => [...prev, newNotification]);

        setTimeout(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, visible: true } : n));
        }, 10);

        setTimeout(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, visible: false } : n));
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 500); // Wait for fade out animation
        }, 5000);
    }, []);

    // --- FORM LOGIC ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwOnpojIrcb8FSlxQcswDYuRqTQ1qMGfyBZEsL72OCf9Bh23MF0d9Hex4PoF7WRAC_0/exec';
        setIsSubmitting(true);

        try {
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });
            showNotification('Message sent successfully!', 'success');
            setFormState({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error!', (error as Error).message);
            showNotification('An error occurred, message was not sent.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
      <>
        <header className="navbar fixed w-full z-50 p-4 md:p-8">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#" className="font-serif text-2xl">R.</a>
                 <div className="flex items-center space-x-4">
                    <nav className="hidden md:flex space-x-8 text-sm uppercase">
                        <a href="#about">About</a>
                        <a href="#projects">Work</a>
                        <a href="#contact">Contact</a>
                    </nav>
                     <button id="theme-toggle" type="button" onClick={toggleTheme} className="p-2 rounded-full text-foreground hover:bg-muted/20 transition-colors focus:outline-none" aria-label="Toggle theme">
                        <svg id="theme-toggle-dark-icon" className={theme === 'light' ? 'hidden' : 'h-5 w-5'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        <svg id="theme-toggle-light-icon" className={theme === 'dark' ? 'hidden' : 'h-5 w-5'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </button>
                    <div className="md:hidden">
                         <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground dark:text-background focus:outline-none">
                            <i className="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-background/90 dark:bg-foreground/90 backdrop-blur-md">
                    <ul className="flex flex-col items-center space-y-6 p-6 text-xl">
                        <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
                        <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>Work</a></li>
                        <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
                    </ul>
                </div>
            )}
        </header>

        <main>
            <section id="hero" className="h-screen min-h-[700px] w-full flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="section-heading">
                        <div className="animate-mask"><span className="inline-block">REY</span></div>
                        <div className="animate-mask" style={{ transitionDelay: '0.1s' }}><span className="inline-block">-KAL</span></div>
                    </h1>
                    <div className="animate-mask" style={{ transitionDelay: '0.2s' }}>
                        <p className="mt-4 text-muted max-w-lg mx-auto">
                            AI Engineer & Creative Technologist. Weaving intelligence into digital experiences.
                        </p>
                    </div>
                </div>
            </section>

            <section id="about" className="py-24 md:py-40">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div className="animate-mask">
                            <img src="/photo.png" alt="Portrait of Reykal" className="w-full h-auto filter grayscale" loading="lazy" decoding="async"/>
                        </div>
                        <div className="max-w-md">
                            <div className="animate-mask"><p className="section-subheading mb-4">01 / About</p></div>
                            <div className="animate-mask" style={{ transitionDelay: '0.1s' }}><h2 className="text-4xl md:text-5xl font-serif mb-6">A confluence of code and creativity.</h2></div>
                            <div className="animate-mask" style={{ transitionDelay: '0.2s' }}>
                                <p className="text-muted leading-relaxed">
                                    I operate at the intersection of machine learning and user experience, transforming complex datasets into intuitive, elegant solutions. My work is driven by a belief that the most powerful technology feels less like a machine and more like a conversation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="projects" className="py-24 md:py-40">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-mask"><p className="section-subheading mb-4">02 / Selected Work</p></div>
                        <div className="mt-12">
                            <button onClick={() => setModalOpen(true)} className="project-item flex justify-between items-center py-8 w-full text-left">
                                <h3 className="text-4xl md:text-6xl font-serif">Arum – Barista AI</h3>
                                <span className="text-muted hidden md:inline">Google Gemini</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <div className="modal" style={{ display: 'block' }} onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                        <p className="section-subheading mb-2">Case Study</p>
                        <h2 className="text-3xl md:text-4xl font-serif mb-6">Arum - Barista AI</h2>
                        <div className="mb-6">
                            <img src="/rey.wuaze.com__i=1(iPhone 14 Pro Max).png" alt="Arum - Mobile Screenshot"/>
                        </div>
                        <p className="text-muted mb-6">Arum is a virtual assistant designed to elevate the ordering experience in a virtual café. Leveraging Google Gemini Flash, it comprehends natural language, provides personalized recommendations, and processes orders with seamless efficiency.</p>
                        <a href="https://aicoffee.pages.dev" target="_blank" className="font-semibold hover:text-muted transition-colors">View Live Project →</a>
                    </div>
                </div>
            )}
            
            <section id="skills" className="py-24 md:py-40">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                    <div>
                        <div className="animate-mask"><p className="section-subheading mb-12">03 / Capabilities</p></div>
                        <div className="space-y-6">
                            <div className="animate-mask" style={{ transitionDelay: '0.1s' }}><div className="pb-6 border-b border-muted/50 dark:border-gray-700"><h4 className="text-3xl font-serif">Python & Machine Learning</h4><p className="text-muted mt-2">Core competency in building and deploying intelligent models.</p></div></div>
                            <div className="animate-mask" style={{ transitionDelay: '0.2s' }}><div className="pb-6 border-b border-muted/50 dark:border-gray-700"><h4 className="text-3xl font-serif">Data Analysis & Visualization</h4><p className="text-muted mt-2">Translating complex data into actionable insights.</p></div></div>
                            <div className="animate-mask" style={{ transitionDelay: '0.3s' }}><div className="pb-6"><h4 className="text-3xl font-serif">Web Technologies</h4><p className="text-muted mt-2">Frontend skills (HTML, CSS, JS) to bring models to life.</p></div></div>
                        </div>
                    </div>
                    <div>
                        <div className="animate-mask"><p className="section-subheading mb-12">Certification</p></div>
                        <div className="animate-mask" style={{ transitionDelay: '0.1s' }}><a href="https://coursera.org/verify/specialization/QG3SZH3EVR8L" target="_blank" rel="noopener noreferrer" className="block border border-muted/50 dark:border-gray-700 p-2 hover:border-foreground dark:hover:border-background transition-colors"><img src="/sertifikat.png" alt="Sertifikat Machine Learning" className="w-full" loading="lazy" decoding="async" /></a></div>
                    </div>
                </div>
            </div>
            </section>
            
            <section id="contact" className="py-24 md:py-40 bg-background dark:bg-foreground">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="animate-mask"><p className="section-subheading mb-4">04 / Contact</p></div>
                        <div className="animate-mask" style={{ transitionDelay: '0.1s' }}><h2 className="section-heading">Let's Talk.</h2></div>
                    </div>
                    <div className="max-w-3xl mx-auto mt-12">
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <input type="text" name="name" value={formState.name} onChange={handleInputChange} required placeholder="Your Name" />
                            <input type="email" name="email" value={formState.email} onChange={handleInputChange} required placeholder="Your Email" />
                            <textarea name="message" value={formState.message} onChange={handleInputChange} rows={1} required placeholder="Your Message" className="resize-none"></textarea>
                            <button type="submit" disabled={isSubmitting} className="w-full py-4 text-xl font-sans font-medium uppercase tracking-widest mt-8">
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
        
        <footer className="py-16">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center">
                <p className="font-serif text-2xl mb-4 md:mb-0">REYKAL</p>
                <div className="flex space-x-6 text-muted mb-4 md:mb-0">
                    <a href="https://www.linkedin.com/in/reykal-al-hikam-469956286/" target="_blank" className="hover:text-foreground footer-link">LinkedIn</a>
                    <a href="https://www.instagram.com/reyhkm" target="_blank" className="hover:text-foreground footer-link">Instagram</a>
                </div>
                <p className="text-sm text-muted">© 2025. All Rights Reserved.</p>
            </div>
        </footer>

        <div id="notification-container" className="fixed top-5 right-5 z-[10001] space-y-2">
            {notifications.map(notif => (
                <div key={notif.id} className={`notification ${notif.type} ${notif.visible ? 'is-visible' : ''}`}>
                    {notif.message}
                </div>
            ))}
        </div>
      </>
    );
};

export default PageContent;
