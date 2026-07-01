// One of four mutually-exclusive outcomes from POST /v2/magic_link (mirrors the
// Ruby Api::V2::MagicLinksController). The frontend branches on which fields are
// present: `token` = skip-login, `mismatch_user`, `require_login`, or `expired`.
export interface MagicLinkResolution {
  expired?: boolean;
  mismatch_user?: boolean;
  require_login?: boolean;
  same_user?: boolean;
  token?: string;
  product_variant_id?: number;
  slug?: string;
  drug?: string;
  qty?: number | null;
}
