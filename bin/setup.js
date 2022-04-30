const fs = require('fs');
const yml = require('js-yaml');
const path = require('path');
const projectDir = path.resolve(__dirname, "..")


module.exports = async () => {
    await setEnv();
}


// jestセットアップ処理の場合の設定
if(String(process.npm_lifecycle_script).match(/^jest/)) {
    // jest.setTimeout(6000)
}

const setEnv = async () => {
    const envFilePath = path.resolve(projectDir, ".env" ,`dev.yml`)
    const envText = fs.readFileSync(envFilePath, "utf-8");
    const data = yml.safeLoad(envText);
    
    const env = {}

    Object.keys(data.export).forEach((key) => {
        Object.assign(env, {[key]: data.export[key]});
    })
    // プロジェクトディレクトリを設定
    Object.assign(env, {PROJECT_DIR: projectDir});

    // 環境変数定義ファイルで定義した環境変数を設定
    Object.assign(process.env, env);
}

