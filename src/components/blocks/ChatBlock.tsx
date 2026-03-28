import { appSliceActions } from '@features/appSlice';
import { blockSliceActions } from '@features/blockSlice';
import { chatSliceActions } from '@features/chatSlice';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { ReplacingVariables } from '@tools/ReplacingVariables';
import { API } from 'api';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import removeMd from 'remove-markdown';
import type { ChatBlockProps } from '../../types/block';
import type {
  ChatMessageWSSendMessage,
  ChatMessageWSStatus,
  ChatMessageWSStatusChat,
} from '../../types/chat';
import { useTranslation } from 'react-i18next';

export const ChatBlock = (props: ChatBlockProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { answerMessage } = useAppSelector((state) => state.app);
  const { currentBlock, isEnd, answerVariables } = useAppSelector((state) => state.block);

  const [countMessages, setCountMessages] = useState<number>(0);
  const [chatID, setChatID] = useState<string>('');
  const [socketUrl, setSocketUrl] = useState<string>(undefined);
  const [endedChat, setEndedChat] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{ is_user: boolean; message: string }[]>([]);

  const maxQuestion = useMemo<number>(() => {
    return currentBlock.content.params?.chat?.maxQuestion || 4;
  }, [currentBlock.content.params?.chat?.maxQuestion]);

  const processedMessageIds = useRef<Set<any>>(new Set());
  const chatIsInit = useRef<boolean>(false);
  const isSendFerstMessage = useRef<boolean>(false);

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket<
    ChatMessageWSStatus | ChatMessageWSSendMessage | ChatMessageWSStatusChat
  >(
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 3,
      reconnectInterval: 500,
    },
    socketUrl !== undefined
  );

  const setPropsAnswer = useCallback(
    (text: string) => {
      props.setAudioTextCB(removeMd(text));
      props.setChatTextCB(text);
    },
    [props]
  );

  useEffect(() => {
    return () => {
      if (getWebSocket()?.readyState === ReadyState.OPEN) {
        getWebSocket().close();
      }
      setChatID('');
      setSocketUrl(undefined);
      setCountMessages(0);
      setEndedChat(false);
      chatIsInit.current = false;
      isSendFerstMessage.current = false;
      processedMessageIds.current.clear();
      dispatch(chatSliceActions.addMessageLoader(''));
      dispatch(chatSliceActions.changeLoader(false));
    };
  }, [currentBlock.id, dispatch, getWebSocket]);

  useEffect(() => {
    if (!chatIsInit.current && currentBlock.content.params?.chat?.endpoint) {
      chatIsInit.current = true;
      const params = { ...currentBlock.content.params.chat.params };
      for (const key in params) {
        params[key] = ReplacingVariables(params[key], answerVariables);
      }

      API.Chat.ChatCreate(currentBlock.content.params.chat.endpoint, params)
        .then(({ data }: { data: { id: string } }) => {
          if (data.id) {
            setChatID(data.id);
          }
        })
        .catch((error) => {
          console.error('Failed to create chat:', error);
        });
    }
  }, [answerVariables, currentBlock.content]);

  useEffect(() => {
    if (chatID && currentBlock.content.params?.chat?.endpointWs) {
      setSocketUrl(currentBlock.content.params?.chat?.endpointWs.replace('{id}', chatID));
      processedMessageIds.current.clear();
    }
  }, [chatID, currentBlock.content.params?.chat?.endpointWs]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && !isSendFerstMessage.current) {
      isSendFerstMessage.current = true;
      sendJsonMessage({
        command: 'send_message',
        body: {
          text: ReplacingVariables(
            currentBlock.content.params?.chat?.initialPhrase,
            answerVariables
          ),
        },
      });
    }
  }, [
    answerVariables,
    currentBlock.content.params?.chat?.initialPhrase,
    readyState,
    sendJsonMessage,
  ]);

  useEffect(() => {
    if (chatHistory.length) {
      API.SaveChatHistory({
        chat_id: chatID,
        history: JSON.stringify(chatHistory),
        block_id: currentBlock.id
      });
    }
  }, [chatHistory, chatID]);

  useEffect(() => {
    if (isEnd) {
      dispatch(appSliceActions.setNeedAnswer(true));
    }
  }, [dispatch, isEnd]);

  useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage?.command === 'status') {
        if (lastJsonMessage.body.status === 'generating') {
          dispatch(chatSliceActions.addMessageLoader(t('blocks.chat.generate_response_text')));
          dispatch(chatSliceActions.changeLoader(true));
          dispatch(appSliceActions.setNeedAnswer(false));
        }
      }

      if (lastJsonMessage?.command === 'status_chat') {
        setEndedChat(lastJsonMessage.body.status === 'ended');
      }

      if (lastJsonMessage?.command === 'send_message' && lastJsonMessage.body?.message_id) {
        if (!processedMessageIds.current.has(lastJsonMessage.body?.message_id)) {
          processedMessageIds.current.add(lastJsonMessage.body?.message_id);
          setCountMessages((prevState) => prevState + 1);
          setChatHistory((prevState) => [
            ...prevState,
            { is_user: false, message: lastJsonMessage.body.message.content.text },
          ]);
          if (lastJsonMessage.body?.message_id) {
            setPropsAnswer(lastJsonMessage.body.message.content.text);
          }
        }
      }
    }
  }, [dispatch, lastJsonMessage, setPropsAnswer]);

  useEffect(() => {
    if (answerMessage) {
      sendJsonMessage({
        command: 'send_message',
        body: {
          text: answerMessage,
        },
      });
      console.log(111, answerMessage);

      setChatHistory((prevState) => [...prevState, { is_user: true, message: answerMessage }]);
    }
  }, [answerMessage, sendJsonMessage]);

  useEffect(() => {
    if (isEnd && (countMessages >= maxQuestion || endedChat)) {
      if (getWebSocket()?.readyState === ReadyState.OPEN) {
        getWebSocket().close();
      }

      setCountMessages(0);
      setChatID('');
      setSocketUrl(undefined);
      setEndedChat(false);
      chatIsInit.current = false;
      isSendFerstMessage.current = false;
      processedMessageIds.current.clear();

      Promise.resolve().then(() => {
        dispatch(chatSliceActions.changeLoader(false));
        dispatch(blockSliceActions.next(null));
      });
      dispatch(appSliceActions.setNeedAnswer(false));
    } else {
      dispatch(blockSliceActions.setIsEnd(false));
    }
  }, [countMessages, dispatch, endedChat, getWebSocket, isEnd, maxQuestion]);

  useEffect(() => {
    dispatch(chatSliceActions.addMessageLoader(t('blocks.chat.init_chat_text')));
    dispatch(chatSliceActions.changeLoader(true));
    return () => {
      dispatch(chatSliceActions.changeLoader(false));
    };
  }, [dispatch]);

  return <></>;
};
