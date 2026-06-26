package core

// Common settings placeholder tokens
const (
	EmailPlaceholderAppName   string = "{APP_NAME}"
	EmailPlaceholderAppURL    string = "{APP_URL}"
	EmailPlaceholderToken     string = "{TOKEN}"
	EmailPlaceholderOTP       string = "{OTP}"
	EmailPlaceholderOTPId     string = "{OTP_ID}"
	EmailPlaceholderAlertInfo string = "{ALERT_INFO}"
)

var defaultVerificationTemplate = EmailTemplate{
	Subject: "验证您的 " + EmailPlaceholderAppName + " 邮箱",
	Body: `<p>您好，</p>
<p>感谢您加入 ` + EmailPlaceholderAppName + `。</p>
<p>点击下方按钮验证您的邮箱地址。</p>
<p>
  <a class="btn" href="` + EmailPlaceholderAppURL + "/_/#/auth/confirm-verification/" + EmailPlaceholderToken + `" target="_blank" rel="noopener">验证邮箱</a>
</p>
<p><i>如果您近期没有注册，请忽略此邮件。</i></p>
<p>
  此致，<br/>
  ` + EmailPlaceholderAppName + ` 团队
</p>`,
}

var defaultResetPasswordTemplate = EmailTemplate{
	Subject: "重置您的 " + EmailPlaceholderAppName + " 密码",
	Body: `<p>您好，</p>
<p>点击下方按钮重置您的密码。</p>
<p>
  <a class="btn" href="` + EmailPlaceholderAppURL + "/_/#/auth/confirm-password-reset/" + EmailPlaceholderToken + `" target="_blank" rel="noopener">重置密码</a>
</p>
<p><i>如果您没有要求重置密码，请忽略此邮件。</i></p>
<p>
  此致，<br/>
  ` + EmailPlaceholderAppName + ` 团队
</p>`,
}

var defaultConfirmEmailChangeTemplate = EmailTemplate{
	Subject: "确认您的 " + EmailPlaceholderAppName + " 新邮箱地址",
	Body: `<p>您好，</p>
<p>点击下方按钮确认您的新邮箱地址。</p>
<p>
  <a class="btn" href="` + EmailPlaceholderAppURL + "/_/#/auth/confirm-email-change/" + EmailPlaceholderToken + `" target="_blank" rel="noopener">确认新邮箱</a>
</p>
<p><i>如果您没有要求更改邮箱地址，请忽略此邮件。</i></p>
<p>
  此致，<br/>
  ` + EmailPlaceholderAppName + ` 团队
</p>`,
}

var defaultOTPTemplate = EmailTemplate{
	Subject: EmailPlaceholderAppName + " 的一次性密码",
	Body: `<p>您好，</p>
<p>您的一次性密码为：<strong>` + EmailPlaceholderOTP + `</strong></p>
<p><i>如果您没有要求一次性密码，可以忽略此邮件。</i></p>
<p>
  此致，<br/>
  ` + EmailPlaceholderAppName + ` 团队
</p>`,
}

var defaultAuthAlertTemplate = EmailTemplate{
	Subject: "从新位置登录",
	Body: `<p>您好，</p>
<p>我们检测到您的 ` + EmailPlaceholderAppName + ` 账户从一个新位置登录：</p>
<p><em>` + EmailPlaceholderAlertInfo + `</em></p>
<p><strong>如果不是您本人操作，请立即更改您的 ` + EmailPlaceholderAppName + ` 账户密码，以撤销其他位置的访问权限。</strong></p>
<p>如果是您本人操作，可以忽略此邮件。</p>
<p>
  此致，<br/>
  ` + EmailPlaceholderAppName + ` 团队
</p>`,
}
