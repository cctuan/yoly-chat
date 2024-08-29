import { defaultPrompts } from '../prompts/default'

export enum ThemeOptions {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum AvailableModels {
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4O = 'gpt-4o',
  GPT_4_TURBO = 'gpt-4-turbo',
}

export enum Mode {
  HIGHLY_PRECISE = 0,
  PRECISE = 0.5,
  BALANCED = 1,
  CREATIVE = 1.5,
}

export interface ChatHookItem {
  url: string;
  name: string;
  description: string;
  config: { [key: string]: string };
  token?: string;
  enable: boolean;
}


export type Settings = {
  quickMenu: {
    enabled: boolean
    items: typeof defaultPrompts
    excludedSites: string[]
  }
  chat: {
    openAIKey: string | null
    model: AvailableModels
    mode: Mode
    showLocalModels: boolean
  }
  general: {
    theme: ThemeOptions
    webpageContext: boolean,
  },
  line: {
    wikiAuthToken: string | null,
    enableWikiRag: boolean,
    shouldGetInnerLinks: boolean,
  },
  chatHook: {
    enable: boolean,
    items: ChatHookItem[]
  }
}

export const defaultSettings: Settings = {
  quickMenu: {
    enabled: true,
    items: defaultPrompts,
    excludedSites: [],
  },
  chat: {
    openAIKey: null,
    model: AvailableModels.GPT_4_TURBO,
    mode: Mode.BALANCED,
    showLocalModels: false,
  },
  general: {
    theme: ThemeOptions.SYSTEM,
    webpageContext: false,
  },
  line: {
    wikiAuthToken: null,
    enableWikiRag: false,
    shouldGetInnerLinks: false,
  },
  chatHook: {
    enable: false,
    items: []
  }
}
