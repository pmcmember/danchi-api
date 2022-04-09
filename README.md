
# danchiサイト用WebAPI

DANCHi公式ウェブサイトのWeb APIの定義<br>

<!-- - サイトURL<br>
https://yubiori-band.com -->
- APIドキュメント<br>
https://shigeyuki-nakano.github.io/danchi-api/openapi

主に以下を取り扱っています。
- お問い合わせ機能
- MicroCMSに対しリクエストキック
- ブログコメントCRUD
- MicroCMS musics API用ユーティリティ
- SSR

<br>
<br>

## menu
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<br>


<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<br>
<br>


## version
前提パッケージのバージョンについて紹介します。

- node: v14.10.0
- yarn: v1.22.10

<br>
<br>

## init
プロジェクトの初期設定について紹介します。
<br>


#### パッケージのインストール

yarn installを叩いてpackage.jsonから必要パッケージをインストールしてください
```
yarn install
```
<br>

#### プロジェクト環境変数
このプロジェクトの管理者から環境変数ファイルを取得し、指定のパスに配置してください。

<table>
	<tr>
		<th></th>
		<th>対象ファイル</th>
		<th>配置先パス</th>		
	</tr>
	<tr>
		<td>開発環境用</td>
		<td>dev.yml</td>
		<td>${projectDir}/.env/</td>
	</tr>
	<tr>
		<td>本番環境用</td>
		<td>prd.yml</td>
		<td>${projectDir}/.env/</td>		
	</tr>
</table>
<br>


#### awsプロファイル設定
このプロジェクトの管理者からaws cliの「aws access key」と「aws secret access key」を取得し、以下コマンドを実行してください。

  

```
aws_access_key_id="プロジェクト管理者から受け取る"
aws_secret_access_key="プロジェクト管理者から受け取る"

npx serverless config credentials \
	--key ${aws_access_key} \
	--secret ${aws_secret_access_key} \
	--profile sls \
	--provider aws
```
<br>
<br>

初期設定については以上です。

  
  
<br>
<br>


## deploy

ここではリソースのAWSへのデプロイについて紹介します。
<br>
<br>

#### スタック一覧
下記が当プロジェクトのcloudformationスタック一覧です。

<table>
	<tr>
		<th></th>
		<th>スタック名</th>
		<th>説明</th>
	</tr>
	<tr>
		<td>共通スタック</td>
		<td>danchi-api-${stage}-CfnStack-CommonStack</td>
		<td>当プロジェクト共通で使用するリソースのプロビジョニング</td>
	</tr>
	<tr>
		<td>アプリケーションスタック</td>
		<td>danchi-api-${stage}-CfnStack-ApplicationStack</td>
		<td>アプリケーション実行環境のプロビジョニング</td>
	</tr>
	<tr>
		<td>監視スタック</td>
		<td>danchi-api-${stage}-CfnStack-MonitorStack</td>
		<td>当プロジェクトのリソース監視のためのリソースのプロビジョニング</td>
	</tr>
</table>
<br>

#### デプロイコマンド
デプロイを実施する際は下記指定のコマンドを実施してください。

共通スタックのデプロイ
```
npm run common-deploy [-- [--stage ${stage}] [--region ${region}]]
```
アプリケーションスタックのデプロイ
```
npm run application-deploy [-- [--stage ${stage}] [--region ${region}]]
```
監視スタックのデプロイ
```
npm run monitor-deploy [-- [--stage ${stage}] [--region ${region}]]
```

オプションは下記が指定可能。

	--stage 
		デプロイする際のステージを指定する。
			開発環境デプロイの場合 : dev
			本番環境デプロイの場合 : prd
		指定は任意で、指定しなかった場合devが設定される。
	
	--region
		デプロイするリージョンを指定する。
		指定は任意で、指定しなかった場合ap-northeast-1が設定される。
  
<br>
<br>

 ## OpenAPI document
 当プロジェクトのAPI仕様の記載、APIGatewayの構築はOpenAPIドキュメントにて行っています。<br>
 ここではOpenAPIドキュメントの編集方法について紹介します。

1. 前提パッケージ
	- docker (v19.03.1で動作検証済み)
	- docker-compose (v19.03.1で動作検証済み)

	※上記Docker ToolBoxにて構築

2. 準備

	下記コマンドを実行してください。

	```
	npm run openapi:start
	```

	実行するとブラウザが立ち上がり、openapiドキュメントが閲覧できるようになります。

3. 編集

	ドキュメントが閲覧できるようになった後、下記ディレクトリ配下に格納されているymlファイルを編集してください。

	<table>
		<tr>
			<th colspan="6">ファイルパス</th>
			<th>説明</th>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td>openapi.yml</td>
			<td></td>
			<td></td>
			<td>openapi定義の最親ファイル(各コンポーネントをこのファイルから呼び出す)</td>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td>paths</td>
			<td>*.yml</td>
			<td></td>
			<td>APIで利用可能なリクエスト・メソッドを定義するファイル</td>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td>components</td>
			<td>schemas</td>
			<td>*.ts</td>
			<td>スキーマの型定義ファイル(書き込み用)</td>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td>components</td>
			<td>schemas</td>
			<td>*.json</td>
			<td>スキーマの型定義ファイル(読み込み用)</td>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td>components</td>
			<td>securitySchemes</td>
			<td>*.yml</td>
			<td>APIの認証設定を定義するファイル</td>
		</tr>
	</table>

	編集後、「2. 準備」にて開いたページをリロードすれば最新の内容が表示されます。

4. 終了

	ドキュメント編集環境はdockerにて動作しているため、編集を終了する際は対象コンテナの終了をしなければなりません。<br>
	終了する際のコマンドを紹介します。<br>
	<br>
	下記コマンドを実行し、dockerコンテナを停止してください。
	```
	npm run openapi:stop
	```
	下記が最後に表示されていれば停止スクリプトが正常に終了したことになります。
	```
	Stop Open API document browsing environment is complete.
	```


## infrastructure
<!-- - 構成概要図
![構成概要図画像](./docs/readme/images/outline_architecture.png "構成概要図画像")

- メール送信処理構成図
	![メール送信処理構成図画像](./docs/readme/images/paths/v1_sendEmail_send_architecture.png "メール送信処理構成図画像")

- メール送信ヘルスチェック処理構成図
![メール送信ヘルスチェック処理構成図画像](./docs/readme/images/paths/v1_sendEmail_healthCheck_architecture.png "メール送信ヘルスチェック処理構成図画像")

- ライブ情報取得処理構成図
![ライブ情報取得処理構成図画像](./docs/readme/images/paths/v1_livePlan_architecture.png "ライブ情報取得処理構成図画像") -->

