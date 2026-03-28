import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ReactHowler from "react-howler";
import {StringSplitting} from "@tools/StringSplitting";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {textToSpeech} from "@features/playerSlice";
import {useAppSelector} from "@hooks/useAppSelector";
import {blockSliceActions} from "@features/blockSlice";
import {API} from "../../api";

interface PlayerProps {
    message: string;
    startPlayingCB: () => void;
    endPlayingCB: () => void;
    isPause: boolean;
    volume?: number;
}

export const AudioPlayer = ({message, isPause, endPlayingCB, startPlayingCB, volume,}: PlayerProps) => {
    const dispatch = useAppDispatch();

    const {config} = useAppSelector(state => state.app);
    const {currentBlock} = useAppSelector(state => state.block);

    const [arrayMessage, setArrayMessage] = useState<string[]>([]);
    const [audioMessage, setAudioMessage] = useState<{ index: number, url: string }[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
    const [currentTrackUrl, setCurrentTrackUrl] = useState<string | undefined>(undefined);
    const [replaceTranscriptionMessage, setReplaceTranscriptionMessage] = useState<string>("");


    const playerVolume = useMemo(() => {
        const normalizedVolume = (volume) / 100;
        return Math.max(0, Math.min(1, normalizedVolume));
    }, [volume]);

    const reactHowlerRef = useRef<ReactHowler>();

    const resetComponent = () => {
        setArrayMessage([]);
        setAudioMessage([]);
        setCurrentTrackIndex(0);
        setCurrentTrackUrl(undefined);
    };

    const tryReplaceTranscription = useCallback(async (msg: string) => {
        if (
            config
            && config.replaceTranscriptions
            && config.replaceTranscriptions.endpoint
            && config.replaceTranscriptions.groupId
        ) {
            const response = await API.FetchReplaceTranscriptions(config.replaceTranscriptions.endpoint, config.replaceTranscriptions.groupId, msg)
            if (response.data.transcribed_text.length) {
                setReplaceTranscriptionMessage(response.data.transcribed_text);
                return
            }
        }
        setReplaceTranscriptionMessage(msg);
    }, [config])

    useEffect(() => {
        if (message) {
            tryReplaceTranscription(message)
        }
    }, [message, tryReplaceTranscription]);

    useEffect(() => {
        if (replaceTranscriptionMessage) {
            resetComponent();
            setArrayMessage(StringSplitting(replaceTranscriptionMessage));
        }
    }, [replaceTranscriptionMessage]);

    const convertTextToAudio = useCallback(async (text: string, index: number) => {
        try {
            const audioUrl = await dispatch(textToSpeech({text})).unwrap();
            setAudioMessage((prev) => [...prev, {index, url: audioUrl.audio_file_url}]);
        } catch (error) {
            console.error("Ошибка при преобразовании текста в речь:", error);
        }
    }, [dispatch]);

    // Запускаем конвертацию для каждой части
    useEffect(() => {
        arrayMessage.forEach((item, index) => {
            convertTextToAudio(item, index).then();
        });
    }, [arrayMessage, convertTextToAudio]);

    // Изменение URL текущего трека
    const changeCurrentTrackUrl = useCallback(() => {
        const track = audioMessage.find(item => item.index === currentTrackIndex);
        if (track) {
            setCurrentTrackUrl(track.url);
        }
    }, [audioMessage, currentTrackIndex]);

    useEffect(() => {
        if (!currentTrackUrl && audioMessage.length > 0) {
            changeCurrentTrackUrl();
        }
    }, [audioMessage, changeCurrentTrackUrl, currentTrackUrl]);

    const handleEnd = () => {
        if (currentTrackIndex + 1 < arrayMessage.length) {
            setCurrentTrackIndex(currentTrackIndex + 1);
            setCurrentTrackUrl(undefined);
        } else {
            resetComponent();
            if (reactHowlerRef.current) {
                reactHowlerRef.current.howler.unload();
            }
            // Устанавливаем флаг завершения аудио
            dispatch(blockSliceActions.setAudioEnded(true));
            
            // Проверяем тип сцены: если видео, не переключаем блок
            const isVideoSceneWithNoAudio = currentBlock?.content?.scene?.type === 'video'
            
            if (!isVideoSceneWithNoAudio) {
                endPlayingCB();
            }
        }
    };

    return (
        <>
            {currentTrackUrl && (
                <ReactHowler
                    src={currentTrackUrl}
                    onLoad={startPlayingCB}
                    onEnd={handleEnd}
                    format={["mp3"]}
                    playing={!isPause}
                    ref={reactHowlerRef}
                    volume={playerVolume}
                />
            )}
        </>
    );
};
