import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PlayColorIcon } from "@components/icons/PlayColorIcon";
import { useAppSelector } from "@hooks/useAppSelector";
import { useTranslation } from "react-i18next";
import { appSliceActions } from "@features/appSlice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import ImageScene from "./ImageScene";
import { LeftOutlined, RightOutlined, DoubleRightOutlined } from "@ant-design/icons";

export const StartScene = () => {
  const dispatch = useAppDispatch();

  const { lectureName, config } = useAppSelector((state) => state.app);
  const { t } = useTranslation();

  const [sliders, setSliders] = useState<{ url: string; animations: string }[]>([]);
  const [slideActive, setSlideActive] = useState<number>(0);

  useEffect(() => {
    if (config && config?.instructions) {
      setSliders(config.instructions);
    }
  }, [config]);

  const handleClick = useCallback(() => {
    dispatch(appSliceActions.playLecture());
    dispatch(appSliceActions.setEnabledAllControls());

    dispatch(appSliceActions.setActiveControl({ id: "scene", value: true }));
    dispatch(appSliceActions.setActiveControl({ id: "chat", value: true }));
    dispatch(appSliceActions.setShowControls({ id: "play", value: false }));

    dispatch(appSliceActions.setActiveControl({ id: "pause", value: false }));
    dispatch(appSliceActions.setShowControls({ id: "pause", value: true }));
    dispatch(appSliceActions.setShowControls({ id: "stop", value: false }));
  }, [dispatch]);

  const isFinished = useMemo<boolean>(() => {
    return sliders.length === 0 || slideActive === sliders.length;
  }, [slideActive, sliders]);

  const nextSlide = useCallback(() => {
    if (slideActive === sliders.length) {
      return;
    }
    setSlideActive(slideActive + 1);
  }, [slideActive, sliders.length]);

  const prevSlide = useCallback(() => {
    if (slideActive === 0) {
      return;
    }
    setSlideActive(slideActive - 1);
  }, [slideActive]);

  const finishSlide = useCallback(() => {

    setSlideActive(sliders.length);
  }, [sliders.length]);

  return (
    <div className="start-scene-container">
      <div>
        {isFinished ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '13rem 0 0 70px',
            }}
          >
            <p>
              {t('welcome_lecture')}
              <br />«<span className="colorize">{lectureName}</span>».
            </p>
            <p className="small">
              {t('start_lecture_prompt')}&nbsp; «&nbsp;
              <span onClick={handleClick} style={{ cursor: 'pointer' }}>
                <PlayColorIcon />
              </span>
              &nbsp;»
            </p>
          </div>
        ) : (
          <div
            style={{
              borderStartStartRadius: '10px',
              overflow: 'hidden',
              maxHeight: '750px',
            }}
          >
            <ImageScene
              src={sliders[slideActive].url}
              animation={sliders[slideActive].animations}
              alt=""
              classes="w-100"
              style={{ maxHeight: '700px', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>
      {sliders.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            gap: '1rem',
            padding: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--dt-actent-color)',
              cursor: slideActive > 0 ? 'pointer' : 'not-allowed',
              opacity: slideActive > 0 ? 1 : 0.5,
              borderRadius: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '67px',
              maxHeight: '50px',
              padding: '1rem',
              display: 'flex',
            }}
            onClick={prevSlide}
          >
            <LeftOutlined style={{ color: 'black', height: '20px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{slideActive + 1}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>/</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{sliders.length + 1}</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--dt-actent-color)',
              cursor: slideActive < sliders.length ? 'pointer' : 'not-allowed',
              opacity: slideActive < sliders.length ? 1 : 0.5,
              borderRadius: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '67px',
              maxHeight: '50px',
              padding: '1rem',
              display: 'flex',
            }}
            onClick={nextSlide}
          >
            <RightOutlined style={{ color: 'black', height: '20px' }} />
          </div>

          <div
            style={{
              backgroundColor: 'var(--dt-actent-color)',
              cursor: slideActive !== sliders.length ? 'pointer' : 'not-allowed',
              opacity: slideActive !== sliders.length ? 1 : 0.5,
              borderRadius: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '67px',
              maxHeight: '50px',
              padding: '1rem',
              display: 'flex',
            }}
            onClick={finishSlide}
          >
            <DoubleRightOutlined style={{ color: 'black', height: '20px' }} />
          </div>
        </div>
      )}
    </div>
  );
};
