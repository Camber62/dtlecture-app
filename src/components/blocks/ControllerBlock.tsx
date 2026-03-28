import { ChatBlock } from '@components/blocks/ChatBlock';
import { JustBlock } from '@components/blocks/JustBlock';
import { PromptBlock } from '@components/blocks/PromptBlock';
import { QuestionBlock } from '@components/blocks/QuestionBlock';
import { AudioPlayer } from '@components/core/AudioPlayer';
import { appSliceActions } from '@features/appSlice';
import { blockSliceActions } from '@features/blockSlice';
import { chatSliceActions } from '@features/chatSlice';
import { playerSliceActions } from '@features/playerSlice';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useKeyboardPress } from '@hooks/useKeyboardPress';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const ControllerBlock = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { config, lectureIsPlay, lectureIsPause, lectureIsStop, answerMode, lectureNextUrl } =
    useAppSelector((state) => state.app);
  const { blocksStatus, blocks, currentBlock, currentBlockIndex } = useAppSelector(
    (state) => state.block
  );

  const { volume } = useAppSelector((state) => state.player);
  const { messages } = useAppSelector((state) => state.chat);

  const [audioPlayerMessage, setAudioPlayerMessage] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');

  const curentBlockTypeRef = useRef<string>('');
  const curentBlockIndexRef = useRef<number>(-1);

  const arrawRightPress = useKeyboardPress('ArrowRight');
  const arrawLeftPress = useKeyboardPress('ArrowLeft');

  useEffect(() => {
    if (currentBlock) {
      curentBlockTypeRef.current = currentBlock.type;
    }
  }, [currentBlock]);

  useEffect(() => {
    curentBlockIndexRef.current = currentBlockIndex;
  }, [currentBlockIndex]);

  useEffect(() => {
    if (arrawRightPress && lectureIsPlay) {
      if (
        !curentBlockTypeRef.current ||
        curentBlockTypeRef.current === 'question' ||
        curentBlockTypeRef.current === 'chat' ||
        curentBlockTypeRef.current === 'prompt'
      ) {
        toast.warning(t('blocks.controller.control_unavailable_text'));
        return;
      }
      dispatch(blockSliceActions.next());
    }
  }, [arrawRightPress, dispatch, lectureIsPlay, t]);

    useEffect(() => {
      if (arrawLeftPress && lectureIsPlay && curentBlockIndexRef.current > 0) {
        if (
          !curentBlockTypeRef.current ||
          curentBlockTypeRef.current === 'question' ||
          curentBlockTypeRef.current === 'chat' ||
          curentBlockTypeRef.current === 'prompt'
        ) {
          toast.warning(t('blocks.controller.control_unavailable_text_2'));
          return;
        }
        dispatch(blockSliceActions.prev());
      }
    }, [arrawLeftPress, dispatch, lectureIsPlay, t]);

  useEffect(() => {
    if (config && config.blocks && blocksStatus === 'idle') {
      dispatch(blockSliceActions.set(config.blocks));
    }
  }, [dispatch, config, blocksStatus]);

  useEffect(() => {
    if (config && lectureIsPlay) {
      dispatch(blockSliceActions.next(config.firstBlockId));
    }
  }, [dispatch, lectureIsPlay, config]);

  useEffect(() => {
    if (lectureIsStop) {
      dispatch(playerSliceActions.setNeedCB(false));
      dispatch(blockSliceActions.reset());
    }
  }, [dispatch, lectureIsStop]);

  useEffect(() => {
    if (currentBlock && (currentBlock.type === 'question' || currentBlock.type === 'chat')) {
      dispatch(appSliceActions.setActiveControl({ id: 'chat', value: true }));
    }
  }, [answerMode, currentBlock, dispatch]);

  useEffect(() => {
    dispatch(appSliceActions.setAnswerMessage(''));
    dispatch(
      appSliceActions.setBlockAnswerMode(currentBlock?.content?.params?.answerMode || 'default')
    );
  }, [currentBlock, dispatch]);

  useEffect(() => {
    if (chatMessage) {
      dispatch(chatSliceActions.addMessage({ text: chatMessage, system: true }));
    }
  }, [chatMessage, dispatch]);

  useEffect(() => {
    if (messages.length && !messages[messages.length - 1].system) {
      dispatch(appSliceActions.setAnswerMessage(''));
      dispatch(appSliceActions.setAnswerStatus('idle'));
    }
  }, [dispatch, messages]);

    
  // Очищаем аудио сообщение при смене блока, если у нового блока scene.audio = true
  useEffect(() => {
    if (currentBlock?.content?.scene?.audio) {
      setAudioPlayerMessage('');
    }
  }, [currentBlock]);

  const normalizeBlockType = (type: string): string => {
    return type
      ?.toLowerCase()
      .replace('с', 'c')
      .replace('т', 't')
      .replace('а', 'a')
      .replace('н', 'h');
  };

  const renderBlock = () => {
    if (!currentBlock) {
      return null;
    }

    const normalizedType = normalizeBlockType(currentBlock.type);
    const props = {
      setAudioTextCB: currentBlock.content?.scene?.audio 
        ? () => {}
        : (text: string) => setAudioPlayerMessage(text),
      setChatTextCB: (text: string) => setChatMessage(text),
    };

    switch (normalizedType) {
      case 'chat':
        return <ChatBlock key={`${normalizedType}-${currentBlock.id}`} {...props} />;
      case 'just':
        return <JustBlock key={`${normalizedType}-${currentBlock.id}`} {...props} />;
      case 'question':
        return <QuestionBlock key={`${normalizedType}-${currentBlock.id}`} {...props} />;
      case 'prompt':
        return <PromptBlock key={`${normalizedType}-${currentBlock.id}`} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderBlock()}
      {currentBlock && lectureIsPlay && audioPlayerMessage && (
        <AudioPlayer
          message={audioPlayerMessage}
          volume={currentBlock.content?.volume ?? volume}
          startPlayingCB={() => {
            dispatch(chatSliceActions.changeLoader(false));
            dispatch(chatSliceActions.addMessageLoader(''));
          }}
          endPlayingCB={() => {
            if (!blocks[currentBlockIndex + 1]) {
              toast.success(t('lecture_ended'));
              if (lectureNextUrl) {
                setTimeout(() => {
                  window.location.href = lectureNextUrl;
                }, 3000);
              }
            } else {
              dispatch(blockSliceActions.setIsEnd(true));
            }
          }}
          isPause={lectureIsPause}
        />
      )}
    </div>
  );
};
