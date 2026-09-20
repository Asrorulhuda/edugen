import React from 'react';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

// Modular Landing Page Components
import Navbar from '@/Components/Landing/Navbar';
import HeroSection from '@/Components/Landing/HeroSection';
import StatsSection from '@/Components/Landing/StatsSection';
import FeaturesSection from '@/Components/Landing/FeaturesSection';
import WorkflowSection from '@/Components/Landing/WorkflowSection';
import PricingSection, { PlanItem } from '@/Components/Landing/PricingSection';
import FaqSection from '@/Components/Landing/FaqSection';
import FooterSection from '@/Components/Landing/FooterSection';

interface SectionData {
    id: number;
    key: string;
    title: string;
    content: any;
    is_active: boolean;
}

interface WelcomeProps extends PageProps {
    sections?: Record<string, SectionData>;
    plans?: PlanItem[];
    canLogin?: boolean;
    canRegister?: boolean;
    laravelVersion?: string;
    phpVersion?: string;
}

export default function Welcome({ auth, sections, plans, canLogin = true, canRegister = true }: WelcomeProps) {
    const heroContent = sections?.hero?.content;
    const statsContent = sections?.stats?.content?.items;
    const featuresContent = sections?.features?.content;
    const workflowContent = sections?.workflow?.content;
    const faqContent = sections?.faqs?.content;
    const footerContent = sections?.footer?.content;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
            <Head>
                <title>EduGen — Platform Generator Perangkat Guru untuk Kurikulum Merdeka & KBC</title>
                <meta
                    name="description"
                    content="EduGen adalah platform Multi-SaaS untuk menyusun TP, ATP, Modul Ajar, Bank Soal HOTS, kisi-kisi, dan rubrik asesmen berbasis Kurikulum Merdeka (Kemendikdasmen) dan Kurikulum Berbasis Cinta / KBC (Kemenag)."
                />
            </Head>

            {/* Navigation */}
            <Navbar auth={auth} canLogin={canLogin} canRegister={canRegister} />

            {/* Main Content */}
            <main>
                {/* Hero with Cute Companion & Dual Curriculum Showcase */}
                <HeroSection content={heroContent} />

                {/* Statistics & Metrics */}
                <StatsSection items={statsContent} />

                {/* 2 Kurikulum Berdampingan & Fitur Utama */}
                <FeaturesSection content={featuresContent} />

                {/* 4-Step Interactive Workflow */}
                <WorkflowSection content={workflowContent} />

                {/* Real-time Synchronized Billing & Pricing */}
                <PricingSection plans={plans} auth={auth} />

                {/* FAQ Accordion */}
                <FaqSection content={faqContent} />
            </main>

            {/* Footer & Contact */}
            <FooterSection content={footerContent} />
        </div>
    );
}
