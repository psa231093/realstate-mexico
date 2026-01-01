-- Urbanify Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Create ENUMs
CREATE TYPE "PropertyType" AS ENUM ('CASA', 'DEPARTAMENTO', 'TERRENO', 'LOCAL_COMERCIAL', 'OFICINA', 'BODEGA', 'RANCHO');
CREATE TYPE "PropertyStatus" AS ENUM ('VENTA', 'RENTA', 'VENDIDO', 'RENTADO');
CREATE TYPE "UserRole" AS ENUM ('USER', 'AGENT', 'ADMIN');

-- Profile table (extends Supabase Auth)
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "sellerType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
CREATE INDEX "Profile_email_idx" ON "Profile"("email");

-- Property table
CREATE TABLE "Property" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "status" "PropertyStatus" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" DECIMAL(3,1),
    "parkingSpaces" INTEGER,
    "areaTotal" DECIMAL(10,2),
    "areaCovered" DECIMAL(10,2),
    "yearBuilt" INTEGER,
    "street" TEXT NOT NULL,
    "exteriorNumber" TEXT,
    "interiorNumber" TEXT,
    "colonia" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'México',
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "amenities" JSONB,
    "mainImageUrl" TEXT,
    "slug" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");
CREATE INDEX "Property_type_status_state_municipality_idx" ON "Property"("type", "status", "state", "municipality");
CREATE INDEX "Property_price_bedrooms_bathrooms_idx" ON "Property"("price", "bedrooms", "bathrooms");
CREATE INDEX "Property_latitude_longitude_idx" ON "Property"("latitude", "longitude");
CREATE INDEX "Property_slug_idx" ON "Property"("slug");
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX "Property_createdAt_idx" ON "Property"("createdAt");

-- PropertyImage table
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PropertyImage_propertyId_order_idx" ON "PropertyImage"("propertyId", "order");

-- Favorite table
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Favorite_userId_propertyId_key" ON "Favorite"("userId", "propertyId");
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- SavedSearch table
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SavedSearch_userId_idx" ON "SavedSearch"("userId");

-- Inquiry table
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "senderId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NUEVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Inquiry_propertyId_idx" ON "Inquiry"("propertyId");
CREATE INDEX "Inquiry_senderId_idx" ON "Inquiry"("senderId");
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

-- Conversation table
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "propertyId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "lastMessageText" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Conversation_propertyId_buyerId_sellerId_key" ON "Conversation"("propertyId", "buyerId", "sellerId");
CREATE INDEX "Conversation_buyerId_idx" ON "Conversation"("buyerId");
CREATE INDEX "Conversation_sellerId_idx" ON "Conversation"("sellerId");
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");

-- Message table
CREATE TABLE "Message" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- Add Foreign Key Constraints
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Realtime for messaging
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";
ALTER PUBLICATION supabase_realtime ADD TABLE "Conversation";

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedSearch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Inquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view all profiles" ON "Profile" FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON "Profile" FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Users can insert own profile" ON "Profile" FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Property policies
CREATE POLICY "Anyone can view active properties" ON "Property" FOR SELECT USING (active = true);
CREATE POLICY "Owners can view own properties" ON "Property" FOR SELECT USING (auth.uid()::text = "ownerId");
CREATE POLICY "Owners can insert properties" ON "Property" FOR INSERT WITH CHECK (auth.uid()::text = "ownerId");
CREATE POLICY "Owners can update own properties" ON "Property" FOR UPDATE USING (auth.uid()::text = "ownerId");
CREATE POLICY "Owners can delete own properties" ON "Property" FOR DELETE USING (auth.uid()::text = "ownerId");

-- PropertyImage policies
CREATE POLICY "Anyone can view property images" ON "PropertyImage" FOR SELECT USING (true);
CREATE POLICY "Property owners can manage images" ON "PropertyImage" FOR ALL USING (
    EXISTS (SELECT 1 FROM "Property" WHERE "Property".id = "PropertyImage"."propertyId" AND "Property"."ownerId" = auth.uid()::text)
);

-- Favorite policies
CREATE POLICY "Users can view own favorites" ON "Favorite" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can manage own favorites" ON "Favorite" FOR ALL USING (auth.uid()::text = "userId");

-- SavedSearch policies
CREATE POLICY "Users can manage own saved searches" ON "SavedSearch" FOR ALL USING (auth.uid()::text = "userId");

-- Inquiry policies
CREATE POLICY "Property owners can view inquiries" ON "Inquiry" FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Property" WHERE "Property".id = "Inquiry"."propertyId" AND "Property"."ownerId" = auth.uid()::text)
    OR auth.uid()::text = "senderId"
);
CREATE POLICY "Anyone can create inquiries" ON "Inquiry" FOR INSERT WITH CHECK (true);

-- Conversation policies
CREATE POLICY "Participants can view conversations" ON "Conversation" FOR SELECT USING (
    auth.uid()::text = "buyerId" OR auth.uid()::text = "sellerId"
);
CREATE POLICY "Buyers can create conversations" ON "Conversation" FOR INSERT WITH CHECK (auth.uid()::text = "buyerId");
CREATE POLICY "Participants can update conversations" ON "Conversation" FOR UPDATE USING (
    auth.uid()::text = "buyerId" OR auth.uid()::text = "sellerId"
);

-- Message policies
CREATE POLICY "Conversation participants can view messages" ON "Message" FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM "Conversation"
        WHERE "Conversation".id = "Message"."conversationId"
        AND (auth.uid()::text = "Conversation"."buyerId" OR auth.uid()::text = "Conversation"."sellerId")
    )
);
CREATE POLICY "Conversation participants can send messages" ON "Message" FOR INSERT WITH CHECK (
    auth.uid()::text = "senderId"
    AND EXISTS (
        SELECT 1 FROM "Conversation"
        WHERE "Conversation".id = "conversationId"
        AND (auth.uid()::text = "Conversation"."buyerId" OR auth.uid()::text = "Conversation"."sellerId")
    )
);
CREATE POLICY "Recipients can mark messages as read" ON "Message" FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM "Conversation"
        WHERE "Conversation".id = "Message"."conversationId"
        AND (auth.uid()::text = "Conversation"."buyerId" OR auth.uid()::text = "Conversation"."sellerId")
    )
);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public."Profile" (id, email, name, "avatarUrl")
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
