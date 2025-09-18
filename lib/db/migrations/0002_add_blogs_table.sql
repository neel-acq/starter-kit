CREATE TABLE "blogs" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "content" text NOT NULL,
    "cover_image" text,
    "author" varchar(100) NOT NULL,
    "tags" text NOT NULL DEFAULT '[]',
    "category_id" integer NOT NULL REFERENCES categories (id),
    "status" varchar(20) NOT NULL DEFAULT 'draft',
    "created_at" timestamp DEFAULT now () NOT NULL,
    "updated_at" timestamp DEFAULT now () NOT NULL
);