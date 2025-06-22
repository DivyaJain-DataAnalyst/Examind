import { gsap } from "gsap";
import { AlignJustify, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Logo from "./Logo";

const publicNavbarLinks = [
    { id: 1, label: "About Us", href: "/about" },
    { id: 2, label: "Login", href: "/login" },
    { id: 3, label: "Register", href: "/register" },
];

const NavbarPublic = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                menuRef.current,
                {
                    height: 0,
                    opacity: 0,
                    y: -20,
                    display: "none",
                },
                {
                    height: "auto",
                    opacity: 1,
                    y: 0,
                    display: "block",
                    duration: 0.4,
                    ease: "power2.out",
                },
            );
        } else {
            gsap.to(menuRef.current, {
                height: 0,
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    // Set display to none after animation
                    if (menuRef.current) {
                        menuRef.current.style.display = "none";
                    }
                },
            });
        }
    }, [isOpen]);

    return (
        <>
            <div className="relative top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-16 py-10 text-black shadow">
                <Logo className="text-3xl" />

                <ul className="hidden cursor-pointer text-xl font-semibold lg:flex lg:gap-8">
                    {publicNavbarLinks.map((item) => (
                        <li key={item.id}>
                            <a href={item.href}>{item.label}</a>
                        </li>
                    ))}
                </ul>

                <div className="relative h-8 w-8 cursor-pointer rounded-md p-2 lg:hidden">
                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                            isOpen
                                ? "scale-90 rotate-45 opacity-0"
                                : "scale-100 rotate-0 opacity-100"
                        }`}
                    >
                        <AlignJustify onClick={toggleMenu} size={32} />
                    </div>
                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                            isOpen
                                ? "scale-100 rotate-0 opacity-100"
                                : "scale-90 -rotate-45 opacity-0"
                        }`}
                    >
                        <X onClick={toggleMenu} size={32} />
                    </div>
                </div>
            </div>

            {/* Animated Mobile Menu */}
            {/* Animated Mobile Menu */}
            <div
                ref={menuRef}
                className="absolute z-50 w-full overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md backdrop-saturate-150 xl:hidden"
                style={{ display: "none" }}
            >
                <ul className="relative space-y-4 px-16 py-6 text-center text-xl font-bold text-black lg:hidden">
                    {publicNavbarLinks.map((item) => (
                        <li key={item.id}>
                            <a
                                href={item.href}
                                className="transition-colors duration-200 hover:text-sky-300"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default NavbarPublic;
