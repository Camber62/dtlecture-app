import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API } from '../api';
import { RootState } from '../store';
import { ApiFetchLectureConfig } from '../types/api';
import { cleanUrl } from '../utils/urlCleanup';
import { StatusState } from '../types/common';
import { AppSliceState, ControllersKey } from '../types/features';

export const fetchAppConfig = createAsyncThunk('app/fetchAppConfig', async (_, { getState }) => {
  const { app } = getState() as RootState;
  return await API.FetchConfig(app.lectureConfigPath);
});

export const fetchLectureConfig = createAsyncThunk('app/fetchLectureConfig', async () => {
  while (true) {
    const response = await API.FetchLectureConfig();

    if (!response.personal) {
      return response;
    }

    if (response.personal && response.status === 'pending') {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else {
      return response;
    }
  }
});

export const fetchModSettings = createAsyncThunk('app/fetchModSettings', async () => {
  return await API.FetchModSettings();
});

const initialState: AppSliceState = {
  attemptId: '',
  lectureName: '',
  lectureConfigPath: '',
  lectureNextUrl: '',
  lectureJWT: '',
  config: null,
  configStatus: 'idle',
  modSettings: null,
  modSettingsStatus: 'idle',
  lectureIsPlay: false,
  lectureIsPause: false,
  lectureIsStop: false,
  answerMode: null,
  blockAnswerMode: 'default',
  needAnswer: false,
  answerStatus: 'idle',
  answerMessage: '',
  isStartLecture: false,
  isContinue: false,
  isSingleView: true,
  currentTopicId: '',
  sceneRandomNumber: 0,
  lectureState: {
    isPlay: false,
    isPause: false,
    isStop: false,
  },
  controllers: [
    {
      id: 'scene',
      show: false,
      disabled: false,
      active: false,
      help: 'scene',
    },
    {
      id: 'play',
      show: true,
      disabled: false,
      active: false,
      help: 'start',
    },
    {
      id: 'pause',
      show: false,
      disabled: false,
      active: false,
      help: 'pause',
    },
    {
      id: 'stop',
      show: false,
      disabled: false,
      active: false,
      help: 'stop',
    },
    {
      id: 'topics',
      show: true,
      disabled: false,
      active: false,
      help: 'topics',
    },
    {
      id: 'chat',
      show: true,
      disabled: false,
      active: false,
      help: 'chat',
    },
    {
      id: 'subtitles',
      show: false,
      disabled: false,
      active: false,
      help: 'subtitles',
    },
    {
      id: 'settings',
      show: true,
      disabled: false,
      active: false,
      help: 'settingsHelp',
    },
    {
      id: 'raiseHand',
      show: true,
      disabled: false,
      active: false,
      help: 'raiseHand',
    },
  ],
  singleActiveControlList: {
    topics: ['chat', 'settings'],
    chat: ['topics', 'settings'],
    settings: ['topics', 'chat'],
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    playLecture: (state) => {
      state.isStartLecture = true;
      state.lectureIsPlay = true;
      state.lectureIsPause = false;
      state.lectureIsStop = false;
    },
    pauseLecture: (state) => {
      state.lectureIsPause = true;
      state.lectureIsStop = false;
    },
    stopLecture: (state) => {
      state.isStartLecture = false;
      state.lectureIsPlay = false;
      state.lectureIsPause = false;
      state.lectureIsStop = true;
    },
    setAttemptId: (state, action: PayloadAction<string>) => {
      state.attemptId = action.payload;
    },
    setNeedAnswer: (state, action: PayloadAction<boolean>) => {
      state.needAnswer = action.payload;
    },
    setAnswerMessage: (state, action: PayloadAction<string>) => {
      state.answerMessage = action.payload;
    },
    setAnswerMode: (state, action: PayloadAction<'voice' | 'text'>) => {
      state.answerMode = action.payload;
    },
    setBlockAnswerMode: (state, action: PayloadAction<'voice' | 'text' | 'default'>) => {
      state.blockAnswerMode = action.payload;
    },
    setAnswerStatus: (state, action: PayloadAction<StatusState>) => {
      state.answerStatus = action.payload;
    },
    setDisabledAllControls: (state) => {
      state.controllers.map((item) => (item.disabled = true));
    },
    setEnabledAllControls: (state) => {
      //TODO добавить проверку на блокировку кнопок из конфига
      state.controllers.map((item) => (item.disabled = false));
    },
    changeDisabledControls: (
      state,
      action: PayloadAction<{ id: ControllersKey; value: boolean }>
    ) => {
      state.controllers.map((item) => {
        if (item.id === action.payload.id) {
          item.disabled = action.payload.value;
        }
        return item;
      });

      // isSingleView
    },
    setActiveControl: (state, action: PayloadAction<{ id: ControllersKey; value: boolean }>) => {
      state.controllers.map((item) => {
        if (item.id === action.payload.id) {
          item.active = action.payload.value;
        }

        if (
          state.singleActiveControlList[action.payload.id] &&
          state.singleActiveControlList[action.payload.id].includes(item.id)
        ) {
          item.active = false;
        }

        return item;
      });

      const countShow = state.controllers.filter((item) => {
        if (['scene', 'topics', 'chat', 'settings'].includes(item.id)) {
          return item.active;
        }
        return false;
      });
      state.isSingleView = countShow.length < 2;
    },
    setShowControls: (
      state,
      { payload }: PayloadAction<{ id: ControllersKey; value: boolean }>
    ) => {
      state.controllers.map((item) => {
        if (item.id === payload.id) {
          item.show = payload.value;
        }
        return item;
      });
    },
    setDisabledControls: (
      state,
      { payload }: PayloadAction<{ id: ControllersKey; value: boolean }>
    ) => {
      state.controllers.map((item) => {
        if (item.id === payload.id) {
          item.disabled = payload.value;
        }
        return item;
      });
    },
    setCurrentTopicId: (state, action: PayloadAction<string | null>) => {
      state.currentTopicId = action.payload;
    },
    setSceneRandomNumber: (state, action: PayloadAction<number>) => {
      state.sceneRandomNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppConfig.pending, (state) => {
        state.configStatus = 'pending';
      })
      .addCase(fetchAppConfig.fulfilled, (state, action) => {
        state.configStatus = 'succeeded';
        state.config = action.payload;
      })
      .addCase(fetchAppConfig.rejected, (state, action) => {
        state.configStatus = 'failed';
        console.error('Failed to fetch config:', action.error.message);
      })
      .addCase(fetchModSettings.pending, (state) => {
        state.modSettingsStatus = 'pending';
      })
      .addCase(fetchModSettings.fulfilled, (state, action) => {
        state.modSettingsStatus = 'succeeded';
        state.modSettings = action.payload;
      })
      .addCase(fetchModSettings.rejected, (state, action) => {
        state.modSettingsStatus = 'failed';
        console.error('Failed to fetch config:', action.error.message);
      })
      .addCase(
        fetchLectureConfig.fulfilled,
        (state, { payload }: PayloadAction<ApiFetchLectureConfig>) => {
          state.lectureName = payload.name;
          state.lectureConfigPath = cleanUrl(payload.config);
          state.lectureJWT = payload.jwt;
          state.lectureNextUrl = payload.next_url;
        }
      );
  },
});

export const appSliceActions = appSlice.actions;

export const appSliceSelectors = {
  getAnswerMode: (state: AppSliceState) => {
    if (state.blockAnswerMode === 'default') {
      return state.answerMode;
    }
    return state.blockAnswerMode;
  },
};

export default appSlice.reducer;
