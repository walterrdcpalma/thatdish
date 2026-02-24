using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThatDish.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Cuisines (no FK)
            migrationBuilder.CreateTable(
                name: "Cuisines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Cuisines", x => x.Id); });
            migrationBuilder.CreateIndex(name: "IX_Cuisines_Name", table: "Cuisines", column: "Name", unique: true);

            // DishFamilies (no FK)
            migrationBuilder.CreateTable(
                name: "DishFamilies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_DishFamilies", x => x.Id); });
            migrationBuilder.CreateIndex(name: "IX_DishFamilies_Name", table: "DishFamilies", column: "Name", unique: true);

            // DishCategories (FK DishFamilies)
            migrationBuilder.CreateTable(
                name: "DishCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DishFamilyId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DishCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DishCategories_DishFamilies_DishFamilyId",
                        column: x => x.DishFamilyId,
                        principalTable: "DishFamilies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateIndex(
                name: "IX_DishCategories_DishFamilyId_Name",
                table: "DishCategories",
                columns: new[] { "DishFamilyId", "Name" },
                unique: true);

            // Restaurants (FK Cuisines)
            migrationBuilder.CreateTable(
                name: "Restaurants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Cuisine = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    CuisineId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Address = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    City = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Country = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Latitude = table.Column<double>(type: "REAL", nullable: true),
                    Longitude = table.Column<double>(type: "REAL", nullable: true),
                    ContactInfo = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    OwnershipType = table.Column<int>(type: "INTEGER", nullable: false),
                    ClaimStatus = table.Column<int>(type: "INTEGER", nullable: false),
                    ClaimedByUserId = table.Column<Guid>(type: "TEXT", nullable: true),
                    ClaimRequestedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ClaimReviewedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Restaurants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Restaurants_Cuisines_CuisineId",
                        column: x => x.CuisineId,
                        principalTable: "Cuisines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateIndex(name: "IX_Restaurants_CuisineId", table: "Restaurants", column: "CuisineId");

            // Users
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ExternalId = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    DisplayName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Users", x => x.Id); });
            migrationBuilder.CreateIndex(name: "IX_Users_ExternalId", table: "Users", column: "ExternalId", unique: true);

            // Dishes (FK Restaurants, DishCategories)
            migrationBuilder.CreateTable(
                name: "Dishes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    RestaurantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DishCategoryId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false),
                    FoodType = table.Column<int>(type: "INTEGER", nullable: false),
                    IsMainDish = table.Column<bool>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "TEXT", nullable: true),
                    LikesCount = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    SavesCount = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    RatingsCount = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0),
                    AverageRating = table.Column<decimal>(type: "TEXT", nullable: false, defaultValue: 0m)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dishes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dishes_Restaurants_RestaurantId",
                        column: x => x.RestaurantId,
                        principalTable: "Restaurants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Dishes_DishCategories_DishCategoryId",
                        column: x => x.DishCategoryId,
                        principalTable: "DishCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateIndex(name: "IX_Dishes_RestaurantId", table: "Dishes", column: "RestaurantId");
            migrationBuilder.CreateIndex(name: "IX_Dishes_DishCategoryId", table: "Dishes", column: "DishCategoryId");

            // SavedDishes
            migrationBuilder.CreateTable(
                name: "SavedDishes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DishId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedDishes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedDishes_Dishes_DishId",
                        column: x => x.DishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedDishes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateIndex(name: "IX_SavedDishes_DishId", table: "SavedDishes", column: "DishId");
            migrationBuilder.CreateIndex(
                name: "IX_SavedDishes_UserId_DishId",
                table: "SavedDishes",
                columns: new[] { "UserId", "DishId" },
                unique: true);

            // Likes
            migrationBuilder.CreateTable(
                name: "Likes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DishId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Likes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Likes_Dishes_DishId",
                        column: x => x.DishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Likes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateIndex(name: "IX_Likes_DishId", table: "Likes", column: "DishId");
            migrationBuilder.CreateIndex(
                name: "IX_Likes_UserId_DishId",
                table: "Likes",
                columns: new[] { "UserId", "DishId" },
                unique: true);

            // Ratings
            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DishId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Score = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ratings_Dishes_DishId",
                        column: x => x.DishId,
                        principalTable: "Dishes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ratings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateIndex(name: "IX_Ratings_DishId", table: "Ratings", column: "DishId");
            migrationBuilder.CreateIndex(
                name: "IX_Ratings_UserId_DishId",
                table: "Ratings",
                columns: new[] { "UserId", "DishId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Likes");
            migrationBuilder.DropTable(name: "Ratings");
            migrationBuilder.DropTable(name: "SavedDishes");
            migrationBuilder.DropTable(name: "Dishes");
            migrationBuilder.DropTable(name: "Users");
            migrationBuilder.DropTable(name: "Restaurants");
            migrationBuilder.DropTable(name: "DishCategories");
            migrationBuilder.DropTable(name: "DishFamilies");
            migrationBuilder.DropTable(name: "Cuisines");
        }
    }
}
