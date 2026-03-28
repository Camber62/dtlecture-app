import { cleanUrl, cleanUrlsInJson } from './urlCleanup';

describe('cleanUrl', () => {
  it('удаляет query parameters из URL', () => {
    const input =
      'https://photo-upload.storage.yandexcloud.net/photo-upload/file/image.png?param1=value1&param2=value2';
    expect(cleanUrl(input)).toBe(
      'https://photo-upload.storage.yandexcloud.net/photo-upload/file/image.png'
    );
  });

  it('оставляет URL без изменений, если нет ?', () => {
    const input = 'https://example.com/image.png';
    expect(cleanUrl(input)).toBe(input);
  });

  it('корректно обрабатывает расширения .jpg, .pdf', () => {
    expect(cleanUrl('https://example.com/file.jpg?token=abc')).toBe(
      'https://example.com/file.jpg'
    );
    expect(cleanUrl('https://example.com/doc.pdf?utm=1')).toBe(
      'https://example.com/doc.pdf'
    );
  });
});

describe('cleanUrlsInJson', () => {
  it('очищает URL в объекте', () => {
    const input = {
      imageUrl: 'https://example.com/img.png?param=1',
      nested: {
        audioUrl: 'https://storage.example.com/audio.mp3?token=xyz',
      },
    };
    const result = cleanUrlsInJson(input);
    expect(result.imageUrl).toBe('https://example.com/img.png');
    expect(result.nested.audioUrl).toBe('https://storage.example.com/audio.mp3');
  });

  it('очищает URL в массиве', () => {
    const input = [
      'https://example.com/a.png?x=1',
      'not a url',
      { url: 'https://example.com/b.jpg?y=2' },
    ];
    const result = cleanUrlsInJson(input);
    expect(result[0]).toBe('https://example.com/a.png');
    expect(result[1]).toBe('not a url');
    expect((result[2] as { url: string }).url).toBe('https://example.com/b.jpg');
  });

  it('не затрагивает строки без http/https', () => {
    const input = { text: 'hello', path: '/local/file.png' };
    const result = cleanUrlsInJson(input);
    expect(result.text).toBe('hello');
    expect(result.path).toBe('/local/file.png');
  });

  // Дополнительный важный тест:
  it('не обрезает обычные строки с вопросительным знаком', () => {
    const input = { question: 'Что такое переменная?' };
    const result = cleanUrlsInJson(input);
    expect(result.question).toBe('Что такое переменная?'); // ← сохраняется полностью!
  });
});