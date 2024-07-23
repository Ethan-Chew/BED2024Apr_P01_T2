-- Connect to the master database to create the login
USE master;
GO

-- Create a login for the user
CREATE LOGIN CareLinc_User WITH PASSWORD = 'imsotired';
GO

-- Grant the sysadmin role to the login
ALTER SERVER ROLE sysadmin ADD MEMBER CareLinc_User;
GO