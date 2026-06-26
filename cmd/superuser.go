package cmd

import (
	"errors"
	"fmt"

	"github.com/fatih/color"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/security"
	"github.com/spf13/cobra"
)

// NewSuperuserCommand creates and returns new command for managing
// superuser accounts (create, update, upsert, delete).
func NewSuperuserCommand(app core.App) *cobra.Command {
	command := &cobra.Command{
		Use:   "superuser",
		Short: "管理超级用户",
	}

	command.AddCommand(superuserUpsertCommand(app))
	command.AddCommand(superuserCreateCommand(app))
	command.AddCommand(superuserUpdateCommand(app))
	command.AddCommand(superuserDeleteCommand(app))
	command.AddCommand(superuserOTPCommand(app))
	command.AddCommand(superuserIPsCommand(app))

	return command
}

func superuserUpsertCommand(app core.App) *cobra.Command {
	command := &cobra.Command{
		Use:          "upsert",
		Example:      "superuser upsert test@example.com 1234567890",
		Short:        "创建或更新（如果邮箱已存在）单个超级用户",
		SilenceUsage: true,
		RunE: func(command *cobra.Command, args []string) error {
			if len(args) != 2 {
				return errors.New("缺少邮箱和密码参数")
			}

			if args[0] == "" || is.EmailFormat.Validate(args[0]) != nil {
				return errors.New("缺少或无效的邮箱地址")
			}

			superusersCol, err := app.FindCachedCollectionByNameOrId(core.CollectionNameSuperusers)
			if err != nil {
				return fmt.Errorf("failed to fetch %q collection: %w", core.CollectionNameSuperusers, err)
			}

			superuser, err := app.FindAuthRecordByEmail(superusersCol, args[0])
			if err != nil {
				superuser = core.NewRecord(superusersCol)
			}

			superuser.SetEmail(args[0])
			superuser.SetPassword(args[1])

			if err := app.Save(superuser); err != nil {
				return fmt.Errorf("failed to upsert superuser account: %w", err)
			}

			color.Green("成功保存超级用户 %q！", superuser.Email())
			return nil
		},
	}

	return command
}

func superuserCreateCommand(app core.App) *cobra.Command {
	command := &cobra.Command{
		Use:          "create",
		Example:      "superuser create test@example.com 1234567890",
		Short:        "创建新的超级用户",
		SilenceUsage: true,
		RunE: func(command *cobra.Command, args []string) error {
			if len(args) != 2 {
				return errors.New("缺少邮箱和密码参数")
			}

			if args[0] == "" || is.EmailFormat.Validate(args[0]) != nil {
				return errors.New("缺少或无效的邮箱地址")
			}

			superusersCol, err := app.FindCachedCollectionByNameOrId(core.CollectionNameSuperusers)
			if err != nil {
				return fmt.Errorf("failed to fetch %q collection: %w", core.CollectionNameSuperusers, err)
			}

			superuser := core.NewRecord(superusersCol)
			superuser.SetEmail(args[0])
			superuser.SetPassword(args[1])

			if err := app.Save(superuser); err != nil {
				return fmt.Errorf("failed to create new superuser account: %w", err)
			}

			color.Green("成功创建超级用户 %q！", superuser.Email())
			return nil
		},
	}

	return command
}

func superuserUpdateCommand(app core.App) *cobra.Command {
	command := &cobra.Command{
		Use:          "update",
		Example:      "superuser update test@example.com 1234567890",
		Short:        "更改超级用户的密码",
		SilenceUsage: true,
		RunE: func(command *cobra.Command, args []string) error {
			if len(args) != 2 {
				return errors.New("缺少邮箱和密码参数")
			}

			if args[0] == "" || is.EmailFormat.Validate(args[0]) != nil {
				return errors.New("缺少或无效的邮箱地址")
			}

			superuser, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, args[0])
			if err != nil {
				return fmt.Errorf("邮箱为 %q 的超级用户不存在", args[0])
			}

			superuser.SetPassword(args[1])

			if err := app.Save(superuser); err != nil {
				return fmt.Errorf("failed to change superuser %q password: %w", superuser.Email(), err)
			}

			color.Green("成功更改超级用户 %q 的密码！", superuser.Email())
			return nil
		},
	}

	return command
}

func superuserDeleteCommand(app core.App) *cobra.Command {
	command := &cobra.Command{
		Use:          "delete",
		Example:      "superuser delete test@example.com",
		Short:        "删除已有的超级用户",
		SilenceUsage: true,
		RunE: func(command *cobra.Command, args []string) error {
			if len(args) == 0 || args[0] == "" || is.EmailFormat.Validate(args[0]) != nil {
				return errors.New("缺少或无效的邮箱地址")
			}

			superuser, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, args[0])
			if err != nil {
				color.Yellow("超级用户 %q 不存在或已被删除", args[0])
				return nil
			}

			if err := app.Delete(superuser); err != nil {
				return fmt.Errorf("failed to delete superuser %q: %w", superuser.Email(), err)
			}

			color.Green("成功删除超级用户 %q！", superuser.Email())
			return nil
		},
	}

	return command
}

func superuserOTPCommand(app core.App) *cobra.Command {
	command := &cobra.Command{
		Use:          "otp",
		Example:      "superuser otp test@example.com",
		Short:        "为指定的超级用户创建一次性密码(OTP)",
		SilenceUsage: true,
		RunE: func(command *cobra.Command, args []string) error {
			if len(args) == 0 || args[0] == "" || is.EmailFormat.Validate(args[0]) != nil {
				return errors.New("缺少或无效的邮箱地址")
			}

			superuser, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, args[0])
			if err != nil {
				return fmt.Errorf("邮箱为 %q 的超级用户不存在", args[0])
			}

			if !superuser.Collection().OTP.Enabled {
				return errors.New("_superusers 集合未启用OTP认证")
			}

			pass := security.RandomStringWithAlphabet(superuser.Collection().OTP.Length, "1234567890")

			otp := core.NewOTP(app)
			otp.SetCollectionRef(superuser.Collection().Id)
			otp.SetRecordRef(superuser.Id)
			otp.SetPassword(pass)

			err = app.Save(otp)
			if err != nil {
				return fmt.Errorf("failed to create OTP: %w", err)
			}

			color.New(color.BgGreen, color.FgBlack).Printf("成功为超级用户 %q 创建OTP:", superuser.Email())
			color.Green("\n├─ ID:    %s", otp.Id)
			color.Green("├─ 密码:  %s", pass)
			color.Green("└─ 有效期: %d秒\n\n", superuser.Collection().OTP.Duration)
			return nil
		},
	}

	return command
}

func superuserIPsCommand(app core.App) *cobra.Command {
	command := &cobra.Command{
		Use:          "ips",
		Example:      "superuser ips 127.0.0.1 10.0.0.0/24",
		Short:        "更新超级用户IP白名单设置（IP/子网参数用空格分隔；留空则清除白名单限制）",
		SilenceUsage: true,
		RunE: func(command *cobra.Command, args []string) error {
			settings := app.Settings()
			settings.SuperuserIPs = args

			if err := app.Save(settings); err != nil {
				return err
			}

			if len(args) == 0 {
				color.Green("已成功清除超级用户IP白名单设置！")
			} else {
				color.New(color.BgGreen, color.FgBlack).Println("已成功更新超级用户IP白名单设置：")
				superuserIPs := app.Settings().SuperuserIPs
				for i, ip := range superuserIPs {
					if i == len(superuserIPs)-1 {
						color.Green("└─ %s", ip)
					} else {
						color.Green("├─ %s", ip)
					}
				}
			}

			return nil
		},
	}

	return command
}
