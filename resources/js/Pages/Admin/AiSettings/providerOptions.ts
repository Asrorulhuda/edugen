const freeOpenRouterModels = [
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'nvidia/nemotron-3.5-lightning:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
    'google/gemma-4-31b-it:free',
    'liquid/lfm-2.5-2.6b:free',
    'deepseek/deepseek-chat',
    'google/gemini-2.5-flash',
    'anthropic/claude-3.5-sonnet',
];

export const modelOptions: Record<string, string[]> = {
    gemini: ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    openrouter: freeOpenRouterModels,
    openrouter_secondary: freeOpenRouterModels,
};

export const portalUrls: Record<string, { label: string; url: string }> = {
    gemini: {
        label: 'Google AI Studio',
        url: 'https://aistudio.google.com/app/apikey',
    },
    openrouter: {
        label: 'OpenRouter Keys (Key 1)',
        url: 'https://openrouter.ai/keys',
    },
    openrouter_secondary: {
        label: 'OpenRouter Keys (Key 2)',
        url: 'https://openrouter.ai/keys',
    },
};
