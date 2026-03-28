import React, {useRef, useEffect, useState} from 'react';
import { blockSliceActions } from '@features/blockSlice';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { chatSliceActions } from '@features/chatSlice';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface VideoSceneConfig {
    src: string;
    audio?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    volume?: number;
}

interface VideoSceneProps {
    config: VideoSceneConfig;
}

const VideoScene: React.FC<VideoSceneProps> = ({config}) => {
    const dispatch = useAppDispatch();
    const videoRef = useRef<HTMLVideoElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [isSafari, setIsSafari] = useState(false);
    const { lectureIsPause, lectureIsPlay, lectureNextUrl } = useAppSelector((state) => state.app);
    const { blocks, currentBlockIndex, audioEnded, videoEnded} = useAppSelector((state) => state.block);
    const { t } = useTranslation();

    // Функция для обработки окончания видео
    const handleVideoEnded = () => {
        dispatch(blockSliceActions.setVideoEnded(true));
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
    };

    const endVideo = () => {
        dispatch(blockSliceActions.setVideoEnded(true));
    }

    useEffect(() => {
        if(audioEnded && videoEnded){
            handleVideoEnded();
     }
     }, [audioEnded,videoEnded]);


    useEffect(() => {
        // Определяем Safari браузер
        const safariDetected = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        setIsSafari(safariDetected);
    }, []);

    // Устанавливаем громкость видео
    useEffect(() => {
        if (videoRef.current && !isSafari) {
            const video = videoRef.current;
            if (config.volume !== undefined) {
                video.volume = config.volume;
            }
        }
    }, [config.volume, isSafari]);

    // Синхронизация видео с состоянием аудио лекции 
    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            if (lectureIsPlay) {
                video.play();
                if (config.audio) {
                    dispatch(chatSliceActions.changeLoader(false));
                    dispatch(chatSliceActions.addMessageLoader(''));
                }
            }
            if (lectureIsPause) {
                video.pause();
            }
        }
    }, [lectureIsPause, lectureIsPlay, isSafari, config.audio, dispatch, config.src]);

    return (
        <div className="d-flex justify-content-center h-100 w-100 rounded-4 align-items-center">
            {!isSafari ? (
            <video
                ref={videoRef}
                src={config.src}
                autoPlay={config.audio}
                loop={config.loop}
                muted={config.muted}
                controls={config.controls}
                className={`h-100 w-100 object-fit-contain rounded-4`}
                preload="metadata"
                playsInline
                onEnded={config.audio ? handleVideoEnded : endVideo}
            />
            ) : (
            <img
                ref={imgRef}
                src={config.src}
                autoPlay={config.audio}
                loop={config.loop}
                muted={config.muted}
                controls={config.controls}
                alt="Video content"
                className={`h-100 w-100 object-fit-contain rounded-4`}
                preload="metadata"
                playsInline
            {...{} as any}
            />
            )}
        </div>
    );
};

export default VideoScene;