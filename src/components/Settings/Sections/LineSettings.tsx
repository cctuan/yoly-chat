import React, { useState } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useSettings } from '../../../hooks/useSettings'
import FieldWrapper from '../Elements/FieldWrapper'
import SectionHeading from '../Elements/SectionHeading'

const LineSettings = () => {
  const [settings, setSettings] = useSettings()
  const [showToken, setShowToken] = useState(false)
  const wikiAuthTokenInputRef = React.useRef<HTMLInputElement>(null)

  const lineSettings = settings.line || { wikiAuthToken: null, enableWikiRag: false, shouldGetInnerLinks: false }

  const handleWikiAuthTokenSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    const target = event.target as HTMLFormElement
    const input = target.querySelector('input') as HTMLInputElement
    const value = input.value

    setSettings({
      ...settings,
      line: {
        ...lineSettings,
        wikiAuthToken: value,
      },
    })

    if (wikiAuthTokenInputRef.current) {
      wikiAuthTokenInputRef.current.classList.add('input-success')
      wikiAuthTokenInputRef.current.value = `✅  ${value}`
      setTimeout(() => {
        if (!wikiAuthTokenInputRef.current) return
        wikiAuthTokenInputRef.current.classList.remove('input-success')
        wikiAuthTokenInputRef.current.value = value
      }, 2000)
    }
  }

  return (
    <div className="cdx-w-full cdx-flex-shrink-0 cdx-rounded-md">
      <SectionHeading title="Line" />
      <FieldWrapper
        title="Enable Wiki RAG"
        description="Enable or disable Wiki Retrieval-Augmented Generation"
        row={true}
      >
        <Switch.Root
          checked={lineSettings.enableWikiRag}
          onCheckedChange={(value) => {
            setSettings({
              ...settings,
              line: {
                ...lineSettings,
                enableWikiRag: value,
              },
            })
          }}
          className="cdx-w-[42px] cdx-h-[25px] cdx-bg-neutral-500 cdx-rounded-full cdx-relative data-[state=checked]:cdx-bg-blue-500 cdx-outline-none cdx-cursor-default"
        >
          <Switch.Thumb className="cdx-block cdx-w-[21px] cdx-h-[21px] cdx-bg-white cdx-rounded-full cdx-transition-transform cdx-duration-100 cdx-translate-x-0.5 cdx-will-change-transform data-[state=checked]:cdx-translate-x-[19px]" />
        </Switch.Root>
      </FieldWrapper>
      <FieldWrapper
        title="Get Inner Links"
        description="Enable or disable fetching content from inner links"
        row={true}
      >
        <Switch.Root
          checked={lineSettings.shouldGetInnerLinks}
          onCheckedChange={(value) => {
            setSettings({
              ...settings,
              line: {
                ...lineSettings,
                shouldGetInnerLinks: value,
              },
            })
          }}
          className="cdx-w-[42px] cdx-h-[25px] cdx-bg-neutral-500 cdx-rounded-full cdx-relative data-[state=checked]:cdx-bg-blue-500 cdx-outline-none cdx-cursor-default"
        >
          <Switch.Thumb className="cdx-block cdx-w-[21px] cdx-h-[21px] cdx-bg-white cdx-rounded-full cdx-transition-transform cdx-duration-100 cdx-translate-x-0.5 cdx-will-change-transform data-[state=checked]:cdx-translate-x-[19px]" />
        </Switch.Root>
      </FieldWrapper>
      <FieldWrapper
        title="Wiki Auth Token"
        description="Enter your Wiki authentication token"
        onSubmit={handleWikiAuthTokenSubmit}
      >
        <div className="cdx-flex cdx-gap-2 cdx-items-center">
          <div className="cdx-relative cdx-w-full">
            <input
              required
              ref={wikiAuthTokenInputRef}
              placeholder="Enter your Wiki auth token"
              defaultValue={lineSettings.wikiAuthToken || ''}
              type={showToken ? 'text' : 'password'}
              className="input"
            />

            <button
              type="button"
              className="cdx-absolute cdx-right-4 cdx-top-1/2 cdx-transform cdx--translate-y-1/2 cdx-text-neutral-500 dark:cdx-text-neutral-200 cdx-bg-transparent cdx-outline-none cdx-cursor-pointer"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>
          <button type="submit" className="btn">
            Update
          </button>
        </div>
      </FieldWrapper>
    </div>
  )
}

export default LineSettings