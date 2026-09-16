"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
	children: ReactNode;
	className?: string;
	as?: ElementType;
};

export function Reveal({ children, className, as = "div" }: RevealProps) {
	const ref = useRef<HTMLElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const Component = as as ElementType;

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setIsVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setIsVisible(true);
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.2 },
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<Component
			ref={ref}
			className={`reveal${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
		>
			{children}
		</Component>
	);
}
