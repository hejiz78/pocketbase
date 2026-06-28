function e(e){let i=app.utils.getApiExampleURL(),a=[{title:`请求密码重置`,content:n},{title:`确认密码重置`,content:r}],o=store({activeActionIndex:0});return t.div({pbEvent:`apiPreviewPasswordReset`,className:`content`},t.p(null,`Sends ${e.name} password reset email request.`),t.p(null,`密码重置成功后，该特定记录之前发出的所有认证令牌将失效（如果用户尚未验证，将被标记为已验证）。`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${i}');

                        ...

                        await pb.collection('${e.name}').requestPasswordReset('test@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${e.name}').confirmPasswordReset(
                            'RESET_TOKEN',
                            'NEW_PASSWORD',
                            'NEW_PASSWORD_CONFIRM',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`JS SDK 文档`}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${i}');

                        ...

                        await pb.collection('${e.name}').requestPasswordReset('test@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${e.name}').confirmPasswordReset(
                          'RESET_TOKEN',
                          'NEW_PASSWORD',
                          'NEW_PASSWORD_CONFIRM',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`Dart SDK 文档`}))},{title:`curl`,language:`bash`,value:`
                        # Request password reset
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "email":"..." }' \\
                          '${i}/api/collections/${e.name}/request-password-reset'

                        # Confirm password reset
                        #
                        # note: all previous user auth tokens will be invalidated
                        # (and the user will be marked as verified if not already)
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "token":"...", "password":"", "passwordConfirm":"" }' \\
                          '${i}/api/collections/${e.name}/confirm-password-reset'
                    `}]}),t.nav({className:`btns m-t-base m-b-sm`},()=>a.map((e,n)=>t.button({type:`button`,className:()=>`btn sm expanded ${o.activeActionIndex==n?`active`:`secondary`}`,textContent:()=>e.title,onclick:()=>o.activeActionIndex=n}))),()=>a[o.activeActionIndex]?.content?.(e))}function n(e){return[t.div({className:`block`},t.strong(null,`API详情`)),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${e.name}/request-password-reset`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`请求体参数`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`email `,t.em(null,`（必需）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`用于发送密码重置请求的认证记录邮箱地址（如果存在）。`)))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,`示例响应`)),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
                {
                  "status": 400,
                  "message": "验证提交的数据时发生错误。",
                  "data": {
                    "email": {
                      "code": "validation_required",
                      "message": "缺少必需的值。"
                    }
                  }
                }
            `}]})]}function r(e){return[t.div({className:`block`},t.strong(null,`API详情`)),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${e.name}/confirm-password-reset`)),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`请求体参数`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`token `,t.em(null,`（必需）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`来自密码重置请求邮件的令牌。`)),t.tr(null,t.td({className:`min-width`},`password `,t.em(null,`（必需）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`要设置的新密码。`)),t.tr(null,t.td({className:`min-width`},`passwordConfirm `,t.em(null,`（必需）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`新密码的确认。`)))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,`示例响应`)),app.components.codeBlockTabs({tabs:[{title:204,value:`null`},{title:400,value:`
                {
                  "status": 400,
                  "message": "验证提交的数据时发生错误。",
                  "data": {
                    "token": {
                      "code": "validation_required",
                      "message": "缺少必需的值。"
                    }
                  }
                }
            `}]})]}export{e as docsPasswordReset};