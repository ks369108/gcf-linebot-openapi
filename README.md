# gcf-linebot-openapi

Simple openAI linebot with node.js on google cloud function

- Linebot + OpenAI
- Google Cloud Functions (2nd gen)
- NodeJs 20

### Line Developer

- Create channel with [LINE Developers](https://developers.line.biz/console/)
  - Setting
    - Basic settings
      - **`Channel secret`**: to grant an app access to channel
    - Messaging API settings
      - **`Channel access token`**: channel access token to call Messaging API
      - Webhook URL: The URL of an endpoint on your server that can process webhook events sent by the LINE Platform.
      - Use webhook: enable
      - Auto-reply messages: disable (option)
- [LINE Developers messaging-api](https://developers.line.biz/en/docs/messaging-api/)

### OpenAI API

- Get **`API keys`** from [API Keys](https://platform.openai.com/api-keys)

  - Click `Create new secret key` button to get the key, and note it down because **it only displays once**

- API Document

  - [API reference](https://platform.openai.com/docs/api-reference/introduction)

  - [github for openai-node](https://github.com/openai/openai-node)
  - `openai/openai-node` migrate V3 to V4: [v3 to v4 Migration Guide · openai/openai-node · Discussion #217](https://github.com/openai/openai-node/discussions/217)

## Google Cloud Function (Gen 2)

### with line bot message API

1. Create Cloud Function

   1. 環境變數設置

      - 函式詳細資料 > 編輯 > 執行階段變數

        ```bash
        CHANNEL_ACCESS_TOKEN= # Channel access token
        CHANNEL_SECRET= # Channel secret
        ```

   2. code

      - `package.json`
        - 引入 @line/bot-sdk
      - `index.js`
        - 程式進入點修改為 main
        - Return http status 200

   3. GCF 權限設置

      - Set cloud function invoker for allUsers
      - `gcloud` roles/run.invoker
        ```bash
        gcloud functions add-invoker-policy-binding linebot-openai \
              --region="asia-east1" \
              --member="allUsers"
        ```

   4. Webhook URL

      1. 觸發條件頁籤 > HTTPS URL
      2. 填入 webhook setting
      3. Click the `verify` button, get "success"
      4. Enable “use webhook”

### with OpenAI API

1. Cloud Function 設定

   1. 環境變數設置

      - 函式詳細資料 > 編輯 > 執行階段變數
        ```bash
        CHANNEL_ACCESS_TOKEN=
        CHANNEL_SECRET=
        OPENAI_API_KEY=
        ```

   2. code
      - `package.json`
        - 引入 openai
      - `index.js`

