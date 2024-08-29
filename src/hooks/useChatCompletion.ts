import endent from 'endent'
import { ChatOpenAI } from '@langchain/openai'
import { Ollama } from '@langchain/community/llms/ollama'
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages'
import { useMemo, useState } from 'react'
import { AvailableModels, type Mode, type ChatHookItem } from '../config/settings'
import { getMatchedContent } from '../lib/getMatchedContent'
import { ChatRole, useCurrentChat } from './useCurrentChat'
import type { MessageDraft } from './useMessageDraft'

interface UseChatCompletionProps {
  model: AvailableModels
  apiKey: string
  mode: Mode
  systemPrompt: string
  chatHook: {
    enable: boolean
    items: ChatHookItem[]
  }
}

/**
 * This hook is responsible for managing the chat completion
 * functionality by using the useCurrentChat hook
 *
 * It adds functions for
 * - submitting a query to the chat
 * - cancelling a query
 *
 * And returns them along with useful state from useCurrentChat hook
 */
let controller: AbortController

export const useChatCompletion = ({
  model,
  apiKey,
  mode,
  systemPrompt,
  chatHook,
}: UseChatCompletionProps) => {
  const {
    messages,
    updateAssistantMessage,
    addNewMessage,
    commitToStoredMessages,
    clearMessages,
    removeMessagePair,
  } = useCurrentChat()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const llm = useMemo(() => {
    const isOpenAIModel = Object.values(AvailableModels).includes(model)
    if (isOpenAIModel) {
      return new ChatOpenAI({
        streaming: true,
        openAIApiKey: apiKey,
        modelName: model,
        temperature: Number(mode)
      })
    }
    return new Ollama({ model: model.replace('ollama-', '') })
  }, [apiKey, model, mode])

  const previousMessages = messages.map((msg) => {
    switch (msg.role) {
      case ChatRole.ASSISTANT:
        return new AIMessage(msg.content)
      case ChatRole.SYSTEM:
        return new SystemMessage(msg.content)
      case ChatRole.USER:
        return new HumanMessage(msg.content)
    }
  })

  const findBestChatHookItem = async (message: string) => {
    if (!chatHook.enable || chatHook.items.length === 0) return null;

    const openaiClient = new ChatOpenAI({ 
      model: "gpt-4o-mini", 
      apiKey 
    });

    const descriptions = chatHook.items.map(item => item.description).join('\n');
    const prompt = `
      Based on the following message, which of these descriptions best matches the user's intent?
      Message: ${message}
      Descriptions:
      ${descriptions}
      
      Reply with only the number of the best matching description (1 for the first, 2 for the second, etc.).
    `;

    const response = await openaiClient.invoke([new HumanMessage(prompt)], {
      functions: [{
        name: "choose_hook_item",
        description: "Choose the best chat hook item based on the user's message",
        parameters: {
          type: "object",
          properties: {
            index: {
              type: "integer",
              description: "The index of the best chat hook item, starting from 1, if none match, then return 0"
            }
          }
        }
      }],
      function_call: {
        name: "choose_hook_item",
      }
    });
    const argumentsString = response.additional_kwargs.function_call?.arguments;
    const bestIndex = argumentsString ? JSON.parse(argumentsString).index - 1 : undefined;
    if (bestIndex === undefined || bestIndex < 0 || bestIndex >= chatHook.items.length) return null;

    return chatHook.items[bestIndex];
  }

  const submitQuery = async (message: MessageDraft, context?: string) => {
    await addNewMessage(ChatRole.USER, message)
    controller = new AbortController()
    const options = {
      signal: controller.signal,
      callbacks: [{ handleLLMNewToken: updateAssistantMessage }],
    }

    setError(null)
    setGenerating(true)

    try {
      /**
       * If context is provided, we need to use the LLM to get the relevant documents
       * and then run the LLM on those documents. We use in memory vector store to
       * get the relevant documents
       */
      let matchedContext: string | undefined
      if (context) {
        const {pageContent, pageHtml} = JSON.parse(context);
        matchedContext = await getMatchedContent(message.text, pageContent, apiKey)
      }

      let expandedQuery = matchedContext
        ? endent`
      ### Context
      ${matchedContext}
      ### Question:
      ${message.text}
    `
        : message.text

      if (chatHook.enable) {
        const bestChatHookItem = await findBestChatHookItem(message.text);
        console.log({ bestChatHookItem });
        if (bestChatHookItem) {
          console.log({context})
          const {pageContent, pageHtml} = JSON.parse(context|| '{}');
          const response = await fetch(bestChatHookItem.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(bestChatHookItem.token ? { 'Authorization': `Bearer ${bestChatHookItem.token}` } : {})
            },
            body: JSON.stringify({
              message: message.text,
              referenceContext: matchedContext,
              context: pageHtml,
              config: bestChatHookItem.config
            })
          });

          if (response.ok) {
            const hookResponse = await response.text();
            expandedQuery += endent`
              ### ChatHook Response (from ${bestChatHookItem.name})
              ${hookResponse}
            `;
          } else {
            console.error('ChatHook request failed:', response.statusText);
          }
        }
      }

      const messages = [
        new SystemMessage(systemPrompt),
        ...previousMessages,
        new HumanMessage({
          content:
            message.files.length > 0
              ? [
                  { type: 'text', text: expandedQuery },
                  ...(message.files.length > 0
                    ? await Promise.all(
                        message.files.map(async (file) => {
                          return {
                            type: 'image_url',
                            image_url: { url: file.src },
                          } as const
                        }),
                      )
                    : []),
                ]
              : expandedQuery,
        }),
      ]

      console.log(JSON.stringify(messages, null, 2))

      await llm.invoke(messages, options)
    } catch (e) {
      setError(e as Error)
    } finally {
      commitToStoredMessages()
      setGenerating(false)
    }
  }

  const cancelRequest = () => {
    controller.abort()
    commitToStoredMessages()
    setGenerating(false)
  }

  return {
    messages,
    submitQuery,
    generating,
    cancelRequest,
    clearMessages,
    removeMessagePair,
    error,
  }
}
