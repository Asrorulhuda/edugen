import React from 'react';
import OwlAiLoadingModal, { OwlAiLoadingModalProps } from '@/Components/OwlAiLoadingModal';

export type AiGeneratingModalProps = OwlAiLoadingModalProps;

/**
 * AiGeneratingModal
 * Reusable modal for AI generation across RPP, Soal, TP, ATP, and Rubriks.
 * Features the large flying Owly mascot with flapping wings & tactile animations.
 */
export default function AiGeneratingModal(props: AiGeneratingModalProps) {
    return <OwlAiLoadingModal {...props} />;
}
