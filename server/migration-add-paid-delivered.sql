-- Migration: Add paid and delivered boolean fields to orders table
-- Run this in your Hostinger PHPMyAdmin

ALTER TABLE orders 
ADD COLUMN paid BOOLEAN DEFAULT FALSE NOT NULL AFTER notes,
ADD COLUMN delivered BOOLEAN DEFAULT FALSE NOT NULL AFTER paid;


