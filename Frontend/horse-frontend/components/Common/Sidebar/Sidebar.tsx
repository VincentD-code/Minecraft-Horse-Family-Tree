"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as styles from "./Sidebar.css";
import { useState, useEffect } from "react";
import HorseCreateModal from "@/components/Modals/HorseCreateModal/HorseCreateModal";
import { Horse } from "@/types/horse";
import Image from "next/image";
import { getHorseVariantImage } from "@/utils/variant";

interface SidebarProps {
  horses: Horse[];
}

export default function Sidebar({ horses }: SidebarProps) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentViewed, setRecentViewed] = useState<Horse[]>([]);

  useEffect(() => {
    const updateRecent = () => {
      const stored = localStorage.getItem("recently-viewed-horses");
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        const viewedHorses = ids
          .map(id => horses.find(h => h.id === id))
          .filter((h): h is Horse => !!h);
        setRecentViewed(viewedHorses.slice(0, 5));
      } else {
        // Fallback to most recently created
        setRecentViewed([...horses].slice(-5).reverse());
      }
    };

    updateRecent();
    window.addEventListener("storage", updateRecent);
    return () => window.removeEventListener("storage", updateRecent);
  }, [horses]);

  const navItems = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Lineage Tree", href: "/horses", icon: "🌳" },
  ];

  return (
    <>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoEmoji}>🐴</span> 
          <span className={styles.logoText}>HorseTree</span>
        </Link>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>Navigation</span>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href ? styles.navLinkActive : styles.navLink
                }
              >
                <span className={styles.navIcon}>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>

          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>Recent Activity</span>
            <div className={styles.recentList}>
              {recentViewed.map((horse) => (
                <Link 
                  key={horse.id} 
                  href={`/horses/${horse.id}`} 
                  className={styles.recentItem}
                >
                  <div className={styles.recentImageContainer}>
                    <Image 
                      src={getHorseVariantImage(horse.variant)} 
                      alt={horse.name} 
                      width={24} 
                      height={24}
                    />
                  </div>
                  <span className={styles.recentName}>{horse.name}</span>
                </Link>
              ))}
              {recentViewed.length === 0 && (
                <div className={styles.recentItem} style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className={styles.footer}>
          <button
            className={styles.createButton}
            onClick={() => setIsModalOpen(true)}
          >
            <span>+</span> New Horse
          </button>
        </div>
      </aside>

      <HorseCreateModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        horses={horses}
      />
    </>
  );
}
