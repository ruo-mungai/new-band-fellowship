-- Fix permissions for newband_user 
\c newband_fellowship 
 
-- Grant schema permissions 
GRANT USAGE ON SCHEMA public TO newband_user; 
GRANT CREATE ON SCHEMA public TO newband_user; 
 
-- Grant on all existing objects 
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO newband_user; 
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO newband_user; 
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO newband_user; 
 
-- Set default privileges 
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO newband_user; 
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO newband_user; 
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO newband_user; 
 
-- Make user the owner 
ALTER SCHEMA public OWNER TO newband_user; 
 
-- Verify 
SELECT 
    nspname AS schema, 
    nspowner::regrole AS owner, 
    has_schema_privilege('newband_user', nspname, 'USAGE') AS has_usage, 
    has_schema_privilege('newband_user', nspname, 'CREATE') AS has_create 
FROM pg_namespace 
WHERE nspname = 'public'; 
