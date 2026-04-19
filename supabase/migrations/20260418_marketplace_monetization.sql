-- CREATORFORGE MONETIZATION SUITE MIGRATION
-- Establish the tables for the Brand Deal Marketplace

-- 1. Brand Listings (Publicly viewable campaign briefs)
CREATE TABLE IF NOT EXISTS public.brand_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT NOT NULL,
    logo_url TEXT,
    campaign_brief TEXT NOT NULL,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    niche_tags TEXT[] DEFAULT '{}',
    platform_requirements TEXT[] DEFAULT '{}',
    deadline DATE,
    status TEXT DEFAULT 'listed' CHECK (status IN ('listed', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Applications (Creators applying to listings)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES public.brand_listings(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pitch_message TEXT NOT NULL,
    rate_card_url TEXT,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'shortlisted', 'rejected', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Deals (Active contracts and payment tracking)
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.brand_listings(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agreed_amount INTEGER NOT NULL,
    contract_url TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'disputed')),
    platform_fee_percent INTEGER DEFAULT 12,
    completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES

-- Applications: Creators can only see their own applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view own applications" ON public.applications 
    FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can insert applications" ON public.applications 
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Deals: Creators can only see their own deals
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view own deals" ON public.deals 
    FOR SELECT USING (auth.uid() = creator_id);

-- Brand Listings: Publicly viewable
ALTER TABLE public.brand_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listings are publicly viewable" ON public.brand_listings 
    FOR SELECT USING (true);

-- SEED DATA (Red Bull, Decathlon, MyProtein)
INSERT INTO public.brand_listings (brand_name, logo_url, campaign_brief, budget_min, budget_max, niche_tags, platform_requirements)
VALUES 
('Red Bull India', 'https://logo.clearbit.com/redbull.com', 'We are looking for extreme sports and adventure creators to showcase the energy of local Indian adventure spots.', 50000, 250000, '{"Adventure", "Fitness", "Extreme Sports"}', '{"Instagram Reel", "Youtube Short"}'),
('Decathlon', 'https://logo.clearbit.com/decathlon.in', 'Launch campaign for the new Kiprun marathon range. Need marathon runners and serious fitness influencers.', 20000, 80000, '{"Running", "Fitness", "Retail"}', '{"Instagram Story", "Twitter Thread"}'),
('MyProtein India', 'https://logo.clearbit.com/myprotein.com', 'Ambassador program for the 2026 season. Looking for 12 creators with 10k+ followers each.', 100000, 500000, '{"Fitness", "Supplements", "Lifestyle"}', '{"Instagram Post", "Youtube Video"}');
