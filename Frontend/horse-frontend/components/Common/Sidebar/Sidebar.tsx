"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as styles from "./Sidebar.css";
import { useState } from "react";
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

  const navItems = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Lineage Tree", href: "/horses", icon: "🌳" },
  ];

  const recentHorses = [...horses].slice(-5).reverse();

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
              {recentHorses.map((horse) => (
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
