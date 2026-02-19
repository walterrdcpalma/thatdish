CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE TABLE "Restaurants" (
        "Id" uuid NOT NULL,
        "Name" character varying(200) NOT NULL,
        "Address" character varying(500),
        "Latitude" double precision,
        "Longitude" double precision,
        "ContactInfo" text,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Restaurants" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "ExternalId" character varying(256) NOT NULL,
        "Email" character varying(256),
        "DisplayName" character varying(200),
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE TABLE "Dishes" (
        "Id" uuid NOT NULL,
        "RestaurantId" uuid NOT NULL,
        "Name" character varying(200) NOT NULL,
        "Description" character varying(1000),
        "ImageUrl" character varying(2000) NOT NULL,
        "FoodType" integer NOT NULL,
        "IsMainDish" boolean NOT NULL,
        "SortOrder" integer NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Dishes" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Dishes_Restaurants_RestaurantId" FOREIGN KEY ("RestaurantId") REFERENCES "Restaurants" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE TABLE "Likes" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "DishId" uuid NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Likes" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Likes_Dishes_DishId" FOREIGN KEY ("DishId") REFERENCES "Dishes" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_Likes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE TABLE "Ratings" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "DishId" uuid NOT NULL,
        "Score" integer NOT NULL,
        "CreatedAtUtc" timestamp with time zone NOT NULL,
        "UpdatedAtUtc" timestamp with time zone,
        CONSTRAINT "PK_Ratings" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Ratings_Dishes_DishId" FOREIGN KEY ("DishId") REFERENCES "Dishes" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_Ratings_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE INDEX "IX_Dishes_RestaurantId" ON "Dishes" ("RestaurantId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE INDEX "IX_Likes_DishId" ON "Likes" ("DishId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Likes_UserId_DishId" ON "Likes" ("UserId", "DishId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE INDEX "IX_Ratings_DishId" ON "Ratings" ("DishId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Ratings_UserId_DishId" ON "Ratings" ("UserId", "DishId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Users_ExternalId" ON "Users" ("ExternalId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260215190749_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260215190749_InitialCreate', '10.0.0');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    ALTER TABLE "Restaurants" ADD "ClaimRequestedAtUtc" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    ALTER TABLE "Restaurants" ADD "ClaimReviewedAtUtc" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    ALTER TABLE "Restaurants" ADD "ClaimStatus" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    ALTER TABLE "Restaurants" ADD "ClaimedByUserId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    ALTER TABLE "Restaurants" ADD "Cuisine" character varying(100);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    ALTER TABLE "Restaurants" ADD "OwnershipType" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    ALTER TABLE "Dishes" ADD "CreatedByUserId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260219221053_SyncModel') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260219221053_SyncModel', '10.0.0');
    END IF;
END $EF$;
COMMIT;

