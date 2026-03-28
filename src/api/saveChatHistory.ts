import {
  getQueryProperty,
  httpClient,
  httpClientMoodleResponseStructure,
} from '../utils/httpClient';

export const SaveChatHistory = async (props: {
  chat_id: string;
  history: string;
  block_id: string;
}): Promise<httpClientMoodleResponseStructure<boolean>> => {
  const args = {
    ...props,
    instance: getQueryProperty('id'),
  };

  return await httpClient.moodle<boolean>('mod_dtlecture_save_chat_history', args);
};
