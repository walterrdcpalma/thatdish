using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThatDish.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SyncModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ClaimRequestedAtUtc",
                table: "Restaurants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClaimReviewedAtUtc",
                table: "Restaurants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ClaimStatus",
                table: "Restaurants",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "ClaimedByUserId",
                table: "Restaurants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cuisine",
                table: "Restaurants",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OwnershipType",
                table: "Restaurants",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedByUserId",
                table: "Dishes",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClaimRequestedAtUtc",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "ClaimReviewedAtUtc",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "ClaimStatus",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "ClaimedByUserId",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Cuisine",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "OwnershipType",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Dishes");
        }
    }
}
