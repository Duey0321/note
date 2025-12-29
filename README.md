This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


README
JWTを使用した目的について
本アプリケーションでは、認証セッションの管理にJWT戦略を採用している
Sessionをデータベースに永続化せず、JWTをHttpOnlyCookieとしてクライアントで保持することにより、サーバーレス環境(Supabase,Vercel)においてもｍスケーラブルかつ低レイテンシな認証を実現している。

JWTには最小限の識別情報(userId, role等)のみを含め、認可判断はServerActionやServerComponents側で行うことでクライアント改ざんを前提とした安全な設計としている。

この構成により、MiddlewareではDBにアクセスせず、JWTのみでアクセス制御が可能
Server Actions ではauth()を通して、同一セッションを安全に参照可能
Prismaを用いた操作では、userIdを必須条件とし、他ユーザーのデータ操作を物理的に阻止
といった実務を想定した責務分離を行っている。


本アプリケーションでは、すべての更新・削除クエリにおいてuserIdをwhere条件に含めることで、他のユーザーのデータを物理的に操作できないことを目的としている。
認証状況やUIの制御を信頼せず、最終的な所有権のけんしょうを常にデータベースのクエリにゆだねることで、認可漏れを構造的に防止している。一言で「認証は通過点、認可はクエリで保証する」

なぜauth()を直接呼ぶ設計なのか
Nextjs/authjsでは、「現在のリクエストに紐づく認証状態」を最も安全に取得できる勇逸の入り口が、auth()だから。Const session = await  auth()この一文で得られるのは、①現在のHttpリクエスト、そのCookie、認証済JWT、Auth.jsの検証ロジックを通過した結果

アプリケーションでは、認証状態取得に、auth()を直接呼び出す設計を採用している。
UIから渡されるsessionやpropsを信頼せず、ServerComponentsやServer Actions、Middlewareの各レイヤで常に現在のリクエストに紐づく認証情報を再取得することで、認証状態の不整合や改ざんリスクを排除している。
この設計により、サーバーサイドのあらゆる処理が、同一の認証基盤に依存する、実務を想定した構成としている。一言で「Sessionは持ち回さない。Auth()で毎回取りに行く」
なぜMddlewareでDBを読まないか
Middlewareは「軽量・高速・副作用なし」であるべきで、DBアクセスはその思想と真っ向から拮抗するため
Middlewareはデータベースアクセスを行わない設計としている。NextJsMiddlewareはEdgeRunTime上で実行され、全リクエストに対して発火するため、DBアクセスを含めるとパフォーマンスやスケーラビリティーにおいて重大な影響を与える。
そのため本アプリケーションでは、MiddlewareではJWTに含まれる認証情報のみを用いてルートレベルのアクセス制御を行い、データ取得や認可処理は、ServerActions/Apiにて実施している。

JWTに何を入れてはいけないか
JWTには漏れても問題ない最小限の識別情報だけを含める。秘密情報・頻繁に変わる情報・権限情報に使う詳細情報は避ける
JWTには、漏洩しても致命的にならない最小限の識別情報のみを含めている。
JWTはクライアントに配布されるため、パスワードや、秘密情報、頻繁に変更される状態情報は含めない。本アプリケーションではJWTを「ユーザー識別のための軽量な情報源」と位置づけ、最終的な認可判断や状態管理は必ずデータベースを正とする設計としている。

「READMEの概略」
JWTは信頼の源泉ではなく、ユーザー識別のための軽量な情報として使っています。


