import { useState, useEffect, useRef } from "react";

// Returns true when the navbar should be hidden (user is scrolling down
// past a small threshold near the top). Scrolling up, or being close to
// the top of the page, always reveals it again.
export function useScrollDirection(hideThreshold = 80) {
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show the navbar near the top of the page.
            if (currentScrollY < hideThreshold) {
                setHidden(false);
            } else if (currentScrollY > lastScrollY.current) {
                // Scrolling down
                setHidden(true);
            } else {
                // Scrolling up
                setHidden(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hideThreshold]);

    return hidden;
}