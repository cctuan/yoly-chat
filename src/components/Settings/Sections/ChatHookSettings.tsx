import React, { useState, useCallback, useMemo } from 'react'
import SectionHeading from '../Elements/SectionHeading'
import FieldWrapper from '../Elements/FieldWrapper'
import { useSettings } from '../../../hooks/useSettings'
import * as Switch from '@radix-ui/react-switch'
import { ChatHookItem } from '../../../config/settings'

type ConfigItemType = {
  id: string;
  key: string;
  value: string;
}

const ConfigItem = React.memo(({ item, onChange, onRemove }: { item: ConfigItemType, onChange: (id: string, key: string, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <div className="cdx-flex cdx-items-center cdx-mb-2">
      <input
        type="text"
        value={item.key}
        onChange={(e) => onChange(item.id, e.target.value, item.value)}
        className="input cdx-w-1/3 cdx-mr-2"
        placeholder="Key"
      />
      <input
        type="text"
        value={item.value}
        onChange={(e) => onChange(item.id, item.key, e.target.value)}
        className="input cdx-w-1/3 cdx-mr-2"
        placeholder="Value"
      />
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="cdx-px-2 cdx-py-1 cdx-bg-red-500 cdx-text-white cdx-rounded-md cdx-hover:cdx-bg-red-600"
      >
        Remove
      </button>
    </div>
  )
})

const ChatHookItemComponent = React.memo(({ item, index, onItemChange, onRemove }: { item: ChatHookItem, index: number, onItemChange: (index: number, field: keyof ChatHookItem, value: any) => void, onRemove: (index: number) => void }) => {
  const [configItems, setConfigItems] = useState<ConfigItemType[]>(
    Object.entries(item.config).map(([key, value]) => ({
      id: Math.random().toString(36).substr(2, 9),
      key,
      value
    }))
  );

  const handleConfigChange = useCallback((id: string, key: string, value: string) => {
    setConfigItems(prev => prev.map(item => 
      item.id === id ? { ...item, key, value } : item
    ));
  }, []);

  const handleAddConfig = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      key: '',
      value: ''
    };
    setConfigItems(prev => [...prev, newItem]);
  }, []);

  const handleRemoveConfig = useCallback((id: string) => {
    setConfigItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Update the parent component when configItems change
  React.useEffect(() => {
    const newConfig = configItems.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
    onItemChange(index, 'config', newConfig);
  }, [configItems, index, onItemChange]);

  const configItemsContent = useMemo(() => (
    <>
      {configItems.map(configItem => (
        <ConfigItem 
          key={configItem.id}
          item={configItem}
          onChange={handleConfigChange}
          onRemove={handleRemoveConfig}
        />
      ))}
      <button
        type="button"
        onClick={handleAddConfig}
        className="cdx-mt-2 cdx-px-4 cdx-py-2 cdx-bg-green-500 cdx-text-white cdx-rounded-md cdx-hover:cdx-bg-green-600"
      >
        Add Config Item
      </button>
    </>
  ), [configItems, handleConfigChange, handleRemoveConfig, handleAddConfig]);

  return (
    <div className="cdx-mt-4 cdx-p-4 cdx-border cdx-border-gray-200 cdx-rounded-md">
      <FieldWrapper title="Name" description="Name of the chat hook">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onItemChange(index, 'name', e.target.value)}
          className="input cdx-w-full"
        />
      </FieldWrapper>
      <FieldWrapper title="URL" description="URL of the chat hook">
        <input
          type="text"
          value={item.url}
          onChange={(e) => onItemChange(index, 'url', e.target.value)}
          className="input cdx-w-full"
        />
      </FieldWrapper>
      <FieldWrapper title="Description" description="Description of the chat hook">
        <textarea
          value={item.description}
          onChange={(e) => onItemChange(index, 'description', e.target.value)}
          className="input cdx-w-full"
        />
      </FieldWrapper>
      <FieldWrapper title="Token" description="Token for the chat hook (optional)">
        <input
          type="text"
          value={item.token || ''}
          onChange={(e) => onItemChange(index, 'token', e.target.value)}
          className="input cdx-w-full"
        />
      </FieldWrapper>
      <FieldWrapper title="Config" description="Configuration for the chat hook">
        {configItemsContent}
      </FieldWrapper>
      <FieldWrapper title="Enable" description="Enable or disable this chat hook" row>
        <Switch.Root
          checked={item.enable}
          onCheckedChange={(value) => onItemChange(index, 'enable', value)}
          className="cdx-w-[42px] cdx-h-[25px] cdx-bg-neutral-500 cdx-rounded-full cdx-relative data-[state=checked]:cdx-bg-blue-500 cdx-outline-none cdx-cursor-default"
        >
          <Switch.Thumb className="cdx-block cdx-w-[21px] cdx-h-[21px] cdx-bg-white cdx-rounded-full cdx-transition-transform cdx-duration-100 cdx-translate-x-0.5 cdx-will-change-transform data-[state=checked]:cdx-translate-x-[19px]" />
        </Switch.Root>
      </FieldWrapper>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="cdx-mt-2 cdx-px-4 cdx-py-2 cdx-bg-red-500 cdx-text-white cdx-rounded-md cdx-hover:cdx-bg-red-600"
      >
        Remove
      </button>
    </div>
  )
})

const ChatHookSettings = () => {
  const [settings, setSettings] = useSettings()
  const chatHookSettings = settings.chatHook || { enable: false, items: [] }

  const handleEnableChange = useCallback((value: boolean) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      chatHook: {
        ...prevSettings.chatHook,
        enable: value,
      },
    }))
  }, [setSettings])

  const handleAddChatHook = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const newItem: ChatHookItem = {
      url: '',
      name: '',
      description: '',
      config: {},
      token: '',
      enable: true,
    }
    setSettings((prevSettings) => ({
      ...prevSettings,
      chatHook: {
        ...prevSettings.chatHook,
        items: [...prevSettings.chatHook.items, newItem],
      },
    }))
  }, [setSettings])

  const handleRemoveChatHook = useCallback((index: number) => {
    setSettings((prevSettings) => {
      const newItems = prevSettings.chatHook.items.filter((_, i) => i !== index)
      return {
        ...prevSettings,
        chatHook: {
          ...prevSettings.chatHook,
          items: newItems,
        },
      }
    })
  }, [setSettings])

  const handleItemChange = useCallback((index: number, field: keyof ChatHookItem, value: any) => {
    setSettings((prevSettings) => {
      const newItems = prevSettings.chatHook.items.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value }
        }
        return item
      })
      return {
        ...prevSettings,
        chatHook: {
          ...prevSettings.chatHook,
          items: newItems,
        },
      }
    })
  }, [setSettings])

  return (
    <div>
      <SectionHeading title="Chat Hook Settings" />

      <FieldWrapper
        title="Enable Chat Hooks"
        description="Enable or disable all chat hooks"
        row
      >
        <Switch.Root
          checked={chatHookSettings.enable}
          onCheckedChange={handleEnableChange}
          className="cdx-w-[42px] cdx-h-[25px] cdx-bg-neutral-500 cdx-rounded-full cdx-relative data-[state=checked]:cdx-bg-blue-500 cdx-outline-none cdx-cursor-default"
        >
          <Switch.Thumb className="cdx-block cdx-w-[21px] cdx-h-[21px] cdx-bg-white cdx-rounded-full cdx-transition-transform cdx-duration-100 cdx-translate-x-0.5 cdx-will-change-transform data-[state=checked]:cdx-translate-x-[19px]" />
        </Switch.Root>
      </FieldWrapper>

      {chatHookSettings.items.map((item, index) => (
        <ChatHookItemComponent
          key={index}
          item={item}
          index={index}
          onItemChange={handleItemChange}
          onRemove={handleRemoveChatHook}
        />
      ))}

      <button
        type="button"
        onClick={handleAddChatHook}
        className="cdx-mt-4 cdx-px-4 cdx-py-2 cdx-bg-blue-500 cdx-text-white cdx-rounded-md cdx-hover:cdx-bg-blue-600"
      >
        Add Chat Hook
      </button>
    </div>
  )
}

export default ChatHookSettings