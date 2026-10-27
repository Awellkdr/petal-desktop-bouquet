create or replace function public.grant_first_admin() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists(select 1 from user_roles where role='admin') then insert into user_roles(user_id, role) values (new.id,'admin'); end if;
  return new;
end $$;
create trigger on_auth_user_first_admin after insert on auth.users for each row execute function public.grant_first_admin();