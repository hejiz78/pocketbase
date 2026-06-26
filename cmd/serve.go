package cmd

import (
	"errors"
	"net/http"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/spf13/cobra"
)

// NewServeCommand creates and returns new command responsible for
// starting the default PocketBase web server.
func NewServeCommand(app core.App, showStartBanner bool) *cobra.Command {
	var allowedOrigins []string
	var httpAddr string
	var httpsAddr string

	command := &cobra.Command{
		Use:          "serve [domain(s)]",
		Args:         cobra.ArbitraryArgs,
		Short:        "启动Web服务器（如果未指定域名，默认为127.0.0.1:8090）",
		SilenceUsage: true,
		RunE: func(command *cobra.Command, args []string) error {
			// set default listener addresses if at least one domain is specified
			if len(args) > 0 {
				if httpAddr == "" {
					httpAddr = "0.0.0.0:80"
				}
				if httpsAddr == "" {
					httpsAddr = "0.0.0.0:443"
				}
			} else {
				if httpAddr == "" {
					httpAddr = "127.0.0.1:8090"
				}
			}

			err := apis.Serve(app, apis.ServeConfig{
				HttpAddr:           httpAddr,
				HttpsAddr:          httpsAddr,
				ShowStartBanner:    showStartBanner,
				AllowedOrigins:     allowedOrigins,
				CertificateDomains: args,
			})

			if errors.Is(err, http.ErrServerClosed) {
				return nil
			}

			return err
		},
	}

	command.PersistentFlags().StringSliceVar(
		&allowedOrigins,
		"origins",
		[]string{"*"},
		"CORS允许的域名来源列表",
	)

	command.PersistentFlags().StringVar(
		&httpAddr,
		"http",
		"",
		"HTTP服务器监听的TCP地址\n（如果指定了域名参数 - 默认为0.0.0.0:80，否则 - 默认为127.0.0.1:8090）",
	)

	command.PersistentFlags().StringVar(
		&httpsAddr,
		"https",
		"",
		"HTTPS服务器监听的TCP地址\n（如果指定了域名参数 - 默认为0.0.0.0:443，否则 - 默认为空字符串，即不启用TLS）\n传入的HTTP流量也将自动重定向到HTTPS版本",
	)

	return command
}
