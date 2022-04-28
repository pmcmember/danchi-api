
# danchiサイト用WebAPI

DANCHi公式ウェブサイトのWeb APIの定義<br>

<!-- - サイトURL<br>
https://yubiori-band.com -->
- APIドキュメント<br>
https://shigeyuki-nakano.github.io/danchi-api/openapi

主に以下を取り扱っています。
- お問い合わせ機能
- blogs、musicsデータの取得
- ブログコメントCRUD
- MicroCMS API用ユーティリティ
- SSR

<br>
<br>

## メニュー
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<br>

- [前提パッケージ](#%E5%89%8D%E6%8F%90%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8)
- [ディレクトリ構成](#%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E6%A7%8B%E6%88%90)
- [初期設定](#%E5%88%9D%E6%9C%9F%E8%A8%AD%E5%AE%9A)
- [インフラ構成のデプロイ](#%E3%82%A4%E3%83%B3%E3%83%95%E3%83%A9%E6%A7%8B%E6%88%90%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4)
- [インフラ構成図](#%E3%82%A4%E3%83%B3%E3%83%95%E3%83%A9%E6%A7%8B%E6%88%90%E5%9B%B3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<br>
<br>


## 前提パッケージ
プロジェクト環境を構築するにあたり、前提となるパッケージとそのバージョンについて紹介します。

- node: >= v14.10.0
- yarn: >= v1.22.10
- docker: >= v19.03.1
- docker-compose: >= v19.03.1
- aws cli: >= 2.0.0

<br>
<br>

## ディレクトリ構成
	.
	├── LambdaLayers
	│     ⇒Lambdaレイヤー(※1)置き場
	├── bin
	│     ⇒ユーティリティスクリプト置き場
	├── docker
	│     ⇒dockerfile、Docker内で利用するファイル置き場
	├── docs
	│     ⇒各種ドキュメント置き場
	├── infra
	│     ⇒インフラ構成管理ソースコード置き場
	└── src
	      ⇒Lambda内で実行するソースコード置き場

※1: 実行時Lambdaに対してライブラリコードを注入する機能。デプロイの際ライブラリコードをLambdaのコンテナに含める必要がなくなり、コンテナが軽量化される。

<br>
<br>

## 初期設定
プロジェクトの初期設定について紹介します。
<br>


1. パッケージのインストール

	yarn installを叩いてpackage.jsonから必要パッケージをインストールしてください
	```
	yarn install
	```
	<br>

1. プロジェクト環境変数

	プロジェクト管理者から環境変数ファイルを取得し、指定のパスに配置してください。<br>
	※セキュリティのため、リポジトリに上げていません。<br>
	　取得したい場合は管理者にお問い合わせください。

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


1. awsプロファイル設定
	このプロジェクトの管理者からaws cliの「aws access key」と「aws secret access key」を取得し、以下コマンドを実行してください。

	```
	$ aws configure --profile danchi-sls
	AWS Access Key ID [None]: "プロジェクト管理者から受け取る"
	AWS Secret Access Key [None]: "プロジェクト管理者から受け取る"
	Default region name [None]: ap-northeast-1
	Default output format [None]: json
	```

	初期設定については以上です。
	<br>
	<br>


## インフラ構成のデプロイ

ここではリソースのAWSへのデプロイについて紹介します。
<br>
<br>

1. デプロイコマンド
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

1. スタック一覧
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
			<td>アプリケーション実行リソースのプロビジョニング</td>
		</tr>
		<tr>
			<td>監視スタック</td>
			<td>danchi-api-${stage}-CfnStack-MonitorStack</td>
			<td>アプリケーションリソース監視のためのリソースのプロビジョニング</td>
		</tr>
	</table>
	<br>

 ## API仕様
 当プロジェクトのAPI仕様はOpenAPIドキュメントにて記載し、その定義をAPIGateway構築の際にimportして構築しています。<br>
 この方法をとることで仕様と実装の乖離が起こらないため、ドキュメントの正確性が担保されます。<br>
 API仕様の変更をしたい場合はOpenAPIドキュメントを編集してください。<br>
 <br>
 このセクションではドキュメントの確認・編集方法、OpenAPI定義ファイルの場所とファイル内容の説明について紹介します。

1. 前提パッケージ
	- docker (v19.03.1で動作検証済み)
	- docker-compose (v19.03.1で動作検証済み)

	※上記Docker ToolBoxにて構築

1. 準備

	下記コマンドを実行してください。

	```
	npm run doc:start
	```

	上記のコマンドが正常終了するとOpenAPI閲覧、作成用のコンテナが起動します。<br>
	<br>
	次に下記コマンドを実行してください。

	```
	npm run doc:open
	```
	ブラウザにてOpenAPIドキュメント閲覧ページが開かれます。<br>
	API仕様はこちらにて確認してください。<br>
	<br>
	※Docker DesktopにてDocker環境を構築している方は下記にアクセスしてください。
	```
	http://localhost:8002
	```

1. 編集

	コンテナ起動後、下記ディレクトリ配下に格納されているymlファイルを編集してください。

	<div style="background: #ffcc00;color: black;border-radius: 5px;padding: 5px;">
		<div><span style="border-radius: 50%;background:#ff9933;color:#990033;">:exclamation:</span>編集の際下記項目に注意してください</div>
		<ol>
			<li>
				<div><strong>型定義ファイル(*.ts)について</strong></div>
				編集するとswagger-mergerコンテナ内で実行されているスクリプトで自動的にjsonファイルを作成します。json作成には時間がかかるため、編集直後にswagger-uiで確認しても反映されていないことがあります。その場合はしばらく時間を置いてから再度アクセスしてください。(デプロイも編集直後ではなくjsonファイルが作成されたことを確認してからお願いします。)
			</li>
		</ol>
	</div>
	<br>
	<br>

	<table>
		<tr>
			<th colspan="5">ディレクトリ</th>
			<th>ファイル名</th>
			<th>説明</th>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td></td>
			<td></td>
			<td>openapi.yml</td>
			<td>openapi定義の最親ファイル(各コンポーネントをこのファイルから呼び出す)</td>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td>paths</td>
			<td></td>
			<td>*.yml</td>
			<td>APIで利用可能なリクエスト・メソッドを定義するファイル</td>
		</tr>
		<tr>
			<td>docs</td>
			<td>openapi</td>
			<td>src</td>
			<td>components</td>
			<td>securitySchemes</td>
			<td>*.yml</td>
			<td>API認証定義ファイル</td>
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
			<td>src</td>
			<td>domain</td>
			<td>model</td>
			<td>common</td>
			<td></td>
			<td>*.ts</td>
			<td>共通スキーマの型定義ファイル(書き込み用)</td>
		</tr>
		<tr>
			<td>src</td>
			<td>domain</td>
			<td>model</td>
			<td>blogs</td>
			<td></td>
			<td>*.ts</td>
			<td>blogsスキーマの型定義ファイル(書き込み用)</td>
		</tr>
		<tr>
			<td>src</td>
			<td>domain</td>
			<td>model</td>
			<td>musics</td>
			<td></td>
			<td>*.ts</td>
			<td>musicsスキーマの型定義ファイル(書き込み用)</td>
		</tr>
	</table>

	編集後、「2. 準備」にて開いたページをリロードすれば最新の内容が表示されます。

1. 終了

	ドキュメントの編集を終了する際は、下記コマンドを実行しdockerコンテナを停止してください。
	```
	npm run doc:stop
	```
	下記が最後に表示されていれば停止スクリプトが正常に終了したことになります。
	```
	Stop Open API document browsing environment is complete.
	```


## インフラ構成図
構成図作成中
<!-- - 構成概要図
![構成概要図画像](./docs/readme/images/outline_architecture.png "構成概要図画像")

- メール送信処理構成図
	![メール送信処理構成図画像](./docs/readme/images/paths/v1_sendEmail_send_architecture.png "メール送信処理構成図画像")

- メール送信ヘルスチェック処理構成図
![メール送信ヘルスチェック処理構成図画像](./docs/readme/images/paths/v1_sendEmail_healthCheck_architecture.png "メール送信ヘルスチェック処理構成図画像")

- ライブ情報取得処理構成図
![ライブ情報取得処理構成図画像](./docs/readme/images/paths/v1_livePlan_architecture.png "ライブ情報取得処理構成図画像") -->

