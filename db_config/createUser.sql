-- Connect to the master database to create the login
USE master;
GO

-- Create a login for the user
CREATE LOGIN CareLinc_Test1 WITH PASSWORD = 'imsotired';
GO

-- Grant the sysadmin role to the login
ALTER SERVER ROLE sysadmin ADD MEMBER CareLinc_Test1;
GO