-- Safely extend payment_status enum with missing values
-- These are needed by the manual payment verification workflow

do $$ begin
  alter type payment_status add value if not exists 'waiting_payment';
exception when others then null;
end $$;

do $$ begin
  alter type payment_status add value if not exists 'waiting_verification';
exception when others then null;
end $$;

do $$ begin
  alter type payment_status add value if not exists 'rejected';
exception when others then null;
end $$;
