import { appSliceActions } from '@features/appSlice';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import 'animate.css';
import React, { useEffect, useRef, useState } from 'react';
import { ImageSceneConfig } from './type';

interface ImageSceneProps extends ImageSceneConfig {
  src: string;
  alt?: string;
  animation?: string;
  classes?: string;
  style?: React.CSSProperties;
}

const ImageScene = ({
  src,
  alt = 'Image scene',
  animation = 'animate__fadeIn',
  classes = 'rounded-4 w-auto',
  style = { maxWidth: '100%', maxHeight: '100%', zIndex: 1024 },
}: ImageSceneProps) => {
  const dispatch = useAppDispatch();

  const {
    config: { sceneImages },
    sceneRandomNumber,
  } = useAppSelector((state) => state.app);
  const { currentBlock } = useAppSelector((state) => state.block);

  const imgRef = useRef<HTMLImageElement>(null);
  const sceneRandomNumberRef = useRef<number>(sceneRandomNumber);

  const [imageSrc, setImageSrc] = useState<string>();

  useEffect(() => {
    sceneRandomNumberRef.current = sceneRandomNumber;
  }, [sceneRandomNumber]);

  useEffect(() => {
    if (currentBlock?.content?.scene?.random && sceneImages?.length > 0) {
      const nextIndex =
        sceneRandomNumberRef.current >= sceneImages.length ? 0 : sceneRandomNumberRef.current;
      setImageSrc(sceneImages[nextIndex]);
      dispatch(appSliceActions.setSceneRandomNumber(nextIndex + 1));
    } else {
      setImageSrc(src);
    }
  }, [currentBlock, dispatch, sceneImages, src]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) {
      return;
    }

    // Remove previous animation classes
    if (img.dataset.animation) {
      img.classList.remove('animate__animated', img.dataset.animation);
    }

    // Add new animation classes
    img.classList.add('animate__animated', animation);
    img.dataset.animation = animation; // Store current animation

    // Optional: Remove animation classes after animation ends (for repeating animations)
    const handleAnimationEnd = () => {
      img.classList.remove('animate__animated', animation);
    };
    img.addEventListener('animationend', handleAnimationEnd);

    return () => {
      img.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [src, animation]);

  return <img ref={imgRef} src={imageSrc} alt={alt} className={classes} style={style} />;
};

export default ImageScene;
