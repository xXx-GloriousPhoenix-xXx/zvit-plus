using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZvitPlus.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "template_types",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_template_types", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    login = table.Column<string>(type: "varchar(24)", maxLength: 24, nullable: false),
                    email = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    password = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false),
                    role = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                    is_banned = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "files",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    author = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    file_size = table.Column<long>(type: "bigint", nullable: false),
                    file_path = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_files", x => x.id);
                    table.ForeignKey(
                        name: "fk_files_users_author_id",
                        column: x => x.author,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "refresh_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    token = table.Column<string>(type: "varchar(512)", maxLength: 512, nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    expires_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    is_revoked = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refresh_tokens", x => x.id);
                    table.ForeignKey(
                        name: "fk_refresh_tokens_users_user_id",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "templates",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    template_type = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    file = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    is_private = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_templates", x => x.id);
                    table.ForeignKey(
                        name: "fk_templates_files_id",
                        column: x => x.file,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_templates_template_types_id",
                        column: x => x.template_type,
                        principalTable: "template_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "reports",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    template = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    file = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    is_private = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reports", x => x.id);
                    table.ForeignKey(
                        name: "fk_reports_files_id",
                        column: x => x.file,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_reports_templates_id",
                        column: x => x.template,
                        principalTable: "templates",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "idx_files_author_id",
                table: "files",
                column: "author");

            migrationBuilder.CreateIndex(
                name: "idx_refresh_tokens_token",
                table: "refresh_tokens",
                column: "token");

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_UserId",
                table: "refresh_tokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "idx_reports_file_id",
                table: "reports",
                column: "file",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_reports_template_id",
                table: "reports",
                column: "template");

            migrationBuilder.CreateIndex(
                name: "idx_template_types_name",
                table: "template_types",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_templates_file_id",
                table: "templates",
                column: "file",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_templates_template_type_id",
                table: "templates",
                column: "template_type");

            migrationBuilder.CreateIndex(
                name: "idx_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_users_login",
                table: "users",
                column: "login",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "refresh_tokens");

            migrationBuilder.DropTable(
                name: "reports");

            migrationBuilder.DropTable(
                name: "templates");

            migrationBuilder.DropTable(
                name: "files");

            migrationBuilder.DropTable(
                name: "template_types");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
