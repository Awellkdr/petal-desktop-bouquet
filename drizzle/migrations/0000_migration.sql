create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

create table public.gift_orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  payload text not null,
  recipient text, sender text,
  reference text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
grant select, update, delete on public.gift_orders to authenticated;
grant all on public.gift_orders to service_role;
alter table public.gift_orders enable row level security;
create policy "admins read" on public.gift_orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update" on public.gift_orders for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete" on public.gift_orders for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.submit_gift_order(_payload text, _reference text, _recipient text, _sender text)
returns text language plpgsql security definer set search_path=public as $$
declare c text;
begin
  if length(coalesce(trim(_reference),'')) < 4 then raise exception 'Reference required'; end if;
  if length(_payload) > 400000 then raise exception 'Too large'; end if;
  loop
    c := lower(substr(md5(gen_random_uuid()::text),1,8));
    exit when not exists(select 1 from gift_orders where code=c);
  end loop;
  insert into gift_orders(code,payload,reference,recipient,sender) values (c,_payload,left(_reference,1500),left(_recipient,80),left(_sender,80));
  return c;
end $$;
create or replace function public.gift_order_status(_code text) returns text language sql stable security definer set search_path=public as $$ select status from gift_orders where code=_code $$;
create or replace function public.get_gift(_code text) returns text language sql stable security definer set search_path=public as $$ select payload from gift_orders where code=_code and status='approved' $$;
grant execute on function public.submit_gift_order(text,text,text,text), public.gift_order_status(text), public.get_gift(text) to anon, authenticated;
alter publication supabase_realtime add table public.gift_orders;