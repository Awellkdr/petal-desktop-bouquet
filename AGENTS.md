<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The 3D studio lives as a self-contained static page (public/bloom.html); / is a landing page linking to it via #new (empty vase) and #preset=<id> (ready-made bouquets). Why: preserves the original WebGL app untouched.
- desktop-widget/ is an Electron app built by GitHub Actions into one-click installers; gifts reach it via the bloomstudio:// link. Why: browsers cannot create transparent always-on-top desktop windows.
- The isolated preload bridge identifies native launches, which always enter transparent widget mode before scene initialization, even without a gift payload. Why: first installation must not show the full studio or an opaque floor.
- Landing live scenes use bloom.html?embed=1 with existing gift/preset hashes; catalog previews are captured from that same renderer. Why: the featured bouquet and ready-made previews match the actual studio without duplicating its 3D engine.

- The static studio sharing dialog collects a manual transfer reference only in memory and gates link copying on its presence; it does not verify or store payments. Why: the requested payment instructions are manual, with no payment-service integration.
- Keep legacy desktop protocol and installer artifact names stable when rebranding display names. Why: existing installations and release download links must keep working.
- Gift hashes activate a read-only recipient presentation independently of native widget mode; embeds override it and new/preset launches remain editable. Why: recipients see their gift without editor controls, while the same renderer supports the landing page and transparent desktop app.
