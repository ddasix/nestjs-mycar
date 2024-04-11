import { rm } from 'fs/promises';
import { join } from 'path';

// 테스트환경설정이 끝나고 테스트가 시작되기 전  실행함.
global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite')).then(result => console.log);
    } catch (error) {}
});
