"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { contactEmail, socialLinks } from "@/config/social";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#about-me", label: "About" },
] as const;

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      <path
        fill="currentColor"
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.05-1.854-3.05-1.853 0-2.136 1.447-2.136 2.989v5.63H9.352V9h3.414v1.561h.05c.476-.9 1.637-1.853 3.37-1.853 3.603 0 4.267 2.37 4.267 5.455v6.291zM5.337 7.433a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.119 20.452H3.555V9h3.564v11.452z"
      />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7l9 6 9-6"
      />
    </svg>
  );
}

const CONNECT_ACTIONS = [
  {
    key: "instagram",
    href: socialLinks.instagram,
    label: "Instagram",
    Icon: IconInstagram,
    external: true,
  },
  {
    key: "facebook",
    href: socialLinks.facebook,
    label: "Facebook",
    Icon: IconFacebook,
    external: true,
  },
  {
    key: "linkedin",
    href: socialLinks.linkedin,
    label: "LinkedIn",
    Icon: IconLinkedIn,
    external: true,
  },
  {
    key: "gmail",
    href: `mailto:${contactEmail}`,
    label: "Email",
    Icon: IconMail,
    external: false,
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  return (
    <footer className={`site-footer ${pathname === "/" ? "site-footer--home" : ""}`}>
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__identity">
            <Link href="/" className="site-footer__name-link">
              <span className="site-footer__name">Arghyadeep Midya</span>
            </Link>
            <p className="site-footer__role">Wildlife photographer and naturalist</p>
          </div>

          <div className="site-footer__cluster">
            <nav className="site-footer__nav" aria-label="Site">
              <div className="site-footer__nav-line">
                {NAV.map((item, i) => (
                  <Fragment key={item.href}>
                    {i > 0 ? (
                      <span className="site-footer__sep" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <Link href={item.href} className="site-footer__text-link">
                      {item.label}
                    </Link>
                  </Fragment>
                ))}
              </div>
            </nav>

            <div className="site-footer__social-block">
              <span className="site-footer__social-label">Connect</span>
              <ul className="site-footer__icon-row" aria-label="Social and email">
                {CONNECT_ACTIONS.map(({ key, href, label, Icon, external }) => (
                  <li key={key}>
                    <a
                      href={href}
                      className="site-footer__icon-btn"
                      data-social={key}
                      aria-label={label}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <Icon className="site-footer__icon-svg" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="site-footer__email-hint">
                <a href={`mailto:${contactEmail}`} className="site-footer__email-link">
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="site-footer__rule" aria-hidden />

        <div className="site-footer__meta">
          <p className="site-footer__legal">© {year} Arghyadeep Midya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
