# Metics API Reference & Postman Kit

Metics exposes a modular Django REST API that covers authentication, organisation onboarding, product catalogue management, procurement workflows, and workflow approvals. This document centralises every available endpoint, describes its contract, and shows the recommended Postman setup (with a ready-to-import collection) so you can explore the API quickly and consistently.

---

## Quick Start

| Setting | Value |
| --- | --- |
| **Base URL** | `https://api.metics.net` (use `{{base_url}}` in Postman) |
| **Auth** | Token-based. Send `Authorization: Token <token>` on every protected request. |
| **Content types** | `application/json` unless otherwise stated. File uploads use `multipart/form-data` or base64 payloads. |
| **Versioning** | Not versioned in the path. Breaking changes are announced in release notes. |

### Postman workflow

1. Import `docs/postman_collection.json` into Postman.
2. Create a Postman environment with:
   - `base_url` – defaults to `https://api.metics.net`
   - `auth_token` – paste the token returned by `/login/`
3. Collections folders mirror the sections below. Each request already contains sample bodies, headers, and query parameters that follow the same best practices described here.

### Authentication flow

1. `POST /register/` – create an account. Depending on deployment flags, email validation or admin approval may be required.
2. `POST /login/` – exchange email/password for a DRF token.
3. Include `Authorization: Token {{auth_token}}` in subsequent calls. Tokens do not expire automatically; rotate them when credentials change.

---

## Common Conventions & Best Practices

- **Standard headers**: always send `Content-Type: application/json` and `Accept: application/json`. Use `Cache-Control: no-cache` while testing.
- **Error format**: DRF validation errors map field names to lists of messages. Business errors return `{ "message": "..." }` or `{ "error": "..." }`. Treat HTTP status codes as the source of truth.
- **Pagination**: when used, responses follow DRF’s `{count, next, previous, results[]}` shape. Accept a `page` query parameter and sometimes `page_size`.
- **Filtering/search**: endpoints that support filtering document the query params in their table entry below.
- **IDs vs slugs**: products and categories rely on slugs, while organisations, auctions, bids, etc. use UUIDs.
- **Date/time**: all timestamps are ISO 8601 UTC strings (e.g. `2024-05-14T10:30:00Z`).
- **Booleans**: send JSON booleans (`true`/`false`). Do not send "0" or "1" strings.
- **File uploads**: there are two patterns:
  - `multipart/form-data` for supplier documents. Send each file in the `file` field and repeat it for multiple files.
  - Base64 payloads (prefixed with `data:<mime>;base64,`), used by product images/documents and template attachments.

### Error & pagination sample

```json
{
  "count": 12,
  "next": "https://api.metics.net/auctions/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

```json
{
  "message": "You are not part of the selected organisation"
}
```

---

## Endpoint Directory

Each table lists the verb, relative path, short description, required auth, and important notes. Paths inherit the base URL.

### 1. Authentication & Users

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| POST | `/login/` | Exchange email/password for a DRF token | – | Returns `{token, user_id, email, organisation}` |
| POST | `/register/` | Register a staff account | – | Body follows `StaffRegistrationSerializer`; triggers email/approval flows |
| GET | `/verify-email/?token=` | Activate account from verification link | – | Provide JWT token from email |
| GET | `/approve-user/?id=` | Metics admin approval | Admin token | Activates pending account |
| GET | `/user-details/` | Current user profile | Token | Returns full `StaffRegistrationSerializer` payload |
| PATCH | `/update-user-details/` | Update profile fields | Token | Partial updates only |
| POST | `/change-password/` | Change password (old → new) | Token | Body: `{old_password, new_password}` |
| POST | `/reset-password/` | Request OTP for password reset | – | Body: `{email}` |
| POST | `/reset-password/<uuid:user_id>/` | Complete reset with OTP | – | Body: `{otp, new_password}` |
| GET | `/check-email/?email=` | Verify if email exists | – | Returns 409 when taken |
| GET | `/check-username/?username=` | Verify if username exists | – | Returns 409 when taken |
| POST | `/set-welcome-screen-seen/` | Mark onboarding screen as seen | Token | Simple acknowledgement payload |
| GET | `/users/<uuid:user_id>/` | Fetch any user by ID (admin use) | Token | Requires proper permissions |
| POST | `/support_us/` | Send message to support | Token | Body: `{"msg": "…"}` |
| GET | `/currencies/` | List supported currencies | – | Returns ISO code, symbol, decimals |

#### Sample: Login + profile

```http
POST /login/
Content-Type: application/json

{
  "email": "buyer@example.com",
  "password": "Sup3rSecret!"
}
```

```json
{
  "token": "c590...",
  "user_id": "f1ab2c34-d567-8901-2345-6789abcd0123",
  "email": "buyer@example.com",
  "welcome_screen_seen": false,
  "is_superuser": false,
  "organisation": "Acme Procurement"
}
```

```http
GET /user-details/
Authorization: Token {{auth_token}}
```

---

### 2. Configuration Metadata

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/config/get-country-data/` | Static list of country codes/names | – | Useful for dropdowns |
| GET | `/config/get-measurement-data/` | Measurement unit config | – | Contains code → label mapping |

---

### 3. Organisation Management

#### Core organisation profile

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/organisations/` | Return the current user’s organisation | Token | 404 if user not linked to any org |
| POST | `/organisations/` | Create an organisation and attach current user as admin | Token | Body matches `OrganisationSerializer`; user must not have an org |
| GET | `/organisations/<uuid:id>` | Fetch organisation by ID | Token | Any authenticated user |
| PATCH | `/organisations/<uuid:id>` | Update organisation | Token | Only members of that org; accepts currency code and `additional_attributes` list |
| GET | `/organisations/sellers/` | List all seller organisations | Token | Public catalogue |
| GET | `/organisations/clients/` | List buyer organisations | Token | Useful for supplier CRM |
| GET | `/organisations/<uuid:id>/catalogue` | Public catalogue for seller | Token | Includes published products |
| POST | `/organisations/invite-client` | Invite an external client by email | Token | Body `{name, email}`; de-duplicates |

#### Seller & category management

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| POST | `/organisations/<uuid:id>/add-seller` | Add authorised seller by organisation ID | Token | Request body `{ "organisation-id": "..." }` |
| POST | `/organisations/<uuid:id>/remove-seller` | Remove authorised seller | Token | Same payload as add |
| GET | `/organisations/<uuid:id>/authorised-sellers` | List authorised sellers | Token | Members of the organisation only |
| POST | `/organisations/<uuid:id>/become-seller` | Enable seller mode & attach categories | Token | Body `{ "product-categories": ["slug"] }` |
| PATCH | `/organisations/<uuid:id>/become-seller` | Toggle seller flag / add categories | Token | `product_categories` list of slugs, `is_seller` boolean |
| DELETE | `/organisations/<uuid:id>/become-seller` | Remove categories from seller | Token | Body `{ "product_categories": ["slug"] }` |
| GET | `/organisations/organisation-selling-category` | Seller categories for current org | Token | Requires membership |
| GET | `/organisations/<uuid:id>/selling-categories/` | Public seller categories | – | No auth; use for marketplaces |

#### Staff & invite flows

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| POST | `/organisations/invite/` | Invite a staff member by email | Token | Only organisation admins |
| GET | `/organisations/<uuid:id>/staffs/` | List staff | Token | Admin only |
| POST | `/organisations/<uuid:id>/staffs/` | Create staff account directly | Token | Body follows `OrganisationStaffRegistrationSerializer` |
| PATCH | `/organisations/<uuid:org_id>/staffs/<uuid:user_id>/` | Update staff profile/password | Token | Admin only; supports `old_password` + `new_password` |

#### Supplier documentation & public assets

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/organisations/supplier-documents/<uuid:org_uuid>/` | List supplier documents | Token | Only members of that supplier org |
| POST | `/organisations/supplier-documents/<uuid:org_uuid>/` | Upload 1..n documents | Token | `multipart/form-data`, repeat `file` fields |
| DELETE | `/organisations/supplier-documents/<uuid:org_uuid>/<uuid:doc_id>/` | Delete document | Token | Owner only |

#### Sample: Create organisation

```json
POST /organisations/
Authorization: Token {{auth_token}}
{
  "name": "Acme Procurement",
  "address_line1": "100 Main Ave",
  "city": "Dubai",
  "country": "AE",
  "email": "contact@acme.com",
  "contact": "+97150000000",
  "currency": "USD",
  "selling_categories": ["electronics"],
  "additional_attributes": [
    {"name": "Industry", "value": "Energy"}
  ]
}
```

---

### 4. Product Catalogue & Enquiries

#### Categories & subcategories

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/product/product-category/` | List all categories | Token | Sorted by name |
| POST | `/product/product-category/` | Create category | Token | Body `{name, description}` |
| GET | `/product/product-category/<str:slug>/` | Retrieve category | Token | – |
| PATCH | `/product/product-category/<str:slug>/` | Update category | Token | Partial updates |
| DELETE | `/product/product-category/<str:slug>/` | Delete category | Token | Hard delete |
| GET | `/product/product-category/<str:slug>/product-subcategory/` | List subcategories for category | Token | – |
| POST | `/product/product-category/<str:slug>/product-subcategory/` | Create subcategory | Token | Body `{name, description}` |
| GET | `/product/product-subcategory/<str:slug>/` | Retrieve subcategory | Token | – |
| PATCH | `/product/product-subcategory/<str:slug>/` | Update subcategory | Token | Partial |
| DELETE | `/product/product-subcategory/<str:slug>/` | Delete subcategory | Token | – |

#### Inventory & product assets

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/product/product-list/` | List products for current organisation | Token | Response `{inventory, enquiry_count}` |
| POST | `/product/product-list/` | Create product | Token | Body follows `ProductSerializer`; requires `product_sub_category` slug |
| GET | `/product/product-detail/<uuid:id>/` | Retrieve product | Token | Ensures same organisation |
| PATCH | `/product/product-detail/<uuid:id>/` | Update product core fields + media | Token | Accepts `existing_images`, `new_images` base64, same for documents |
| DELETE | `/product/product-detail/<uuid:id>/` | Delete product | Token | – |
| POST | `/product/upload` | Bulk CSV upload | Token | CSV columns: subcategory slug, product data |
| GET | `/product/products/<uuid:product_id>/images/` | List product images | Token | Returns `ProductImageSerializer` |
| GET | `/product/products/<uuid:product_id>/documents/` | List product documents | Token | Returns `ProductDocumentSerializer` |

#### Catalogue exposure

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/product/product-catalogue/<uuid:id>/` | Public catalogue by organisation | Basic auth optional | `id` is the organisation UUID; includes org name/email |
| GET | `/product/product-catalogue-filter/<uuid:organisation_id>/<uuid:category_id>/` | Filter catalogue by category | Basic auth optional | – |
| GET | `/product/product-catalogue-detail/<uuid:id>/` | Public product detail | Basic auth optional | – |

#### Enquiries (RFIs outside procurement module)

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/product/enquiries/` | List enquiries (internal view) | AllowAny | – |
| POST | `/product/enquiries/` | Submit enquiry to a supplier | AllowAny | Body: `organisation_name`, `email`, `supplier_email`, `items[] {product_id, quantity}` |
| GET | `/product/enquiries/<uuid:id>/` | Retrieve enquiry | AllowAny | – |
| PATCH | `/product/enquiries/<uuid:id>/` | Acknowledge (sets `int_status=1`) & email requester | AllowAny | No body |
| DELETE | `/product/enquiries/<uuid:id>/` | Reject enquiry | AllowAny | Sets `int_status=-1` |
| GET | `/product/enquiries/organisation/<uuid:organisation_id>/` | List enquiries for supplier org | AllowAny | Distinct enquiries referencing supplier |

#### Sample: Create product

```json
POST /product/product-list/
Authorization: Token {{auth_token}}
{
  "name": "Dell Latitude 5440",
  "description": "14\" business laptop",
  "product_sub_category": "laptops",
  "market_price": "1200.00",
  "list_price_per_unit": "1100.00",
  "unit_of_issue": "EA",
  "base_item_id": "DL5440",
  "is_available": true,
  "show_in_catalogue": true,
  "is_inventory_item": true,
  "additional_attributes": [{"name": "CPU", "value": "i7"}],
  "images": [{"image": "data:image/png;base64,iVBORw0..."}],
  "documents": [{"name": "spec.pdf", "document": "data:application/pdf;base64,JVBERi0..."}]
}
```

---

### 5. Procurement Suite (Auctions, Bids, Purchase Orders)

#### Auction headers (RFQs)

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/my-auctions/` | Paginated list of auctions created by current organisation | Token | Uses `AuctionHeaderSerializer` |
| GET | `/auctions/` | For sellers: open/closed auctions they can bid on | Token | Filters by selling categories & country filters |
| POST | `/auctions/` | Create RFQ/Auction header | Token | Body: `title`, `requisition_number`, category slugs, incoterms, attachments, focal points |
| GET | `/auctions/<uuid:id>` | Retrieve auction header | Token | – |
| PATCH | `/auctions/<uuid:id>` | Update header fields/attributes | Token | Owner only |
| DELETE | `/auctions/<uuid:id>` | Delete auction header | Token | Owner only |
| DELETE | `/auction-header/attachment/<uuid:id>` | Remove header attachment | Token | Owner only |
| DELETE | `/auction-header/focal-point/<uuid:id>` | Remove focal point | Token | Owner only |
| GET | `/auctions/<uuid:auction_id>/compare-bids` | Matrix comparing bid prices per line & supplier | Token | Auction owner only |
| POST | `/ignore-auction-header/<uuid:auction_id>/` | Seller hides RFQ from "Open" list | Token | Stores entry in `IgnoredAuctionHeader` |

#### Auction discussions & lines

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/auctions/<uuid:id>/comments` | List comments | Token | Ordered by creation |
| POST | `/auctions/<uuid:id>/comments` | Add comment | Token | Body `{message}` |
| GET | `/auctions/<uuid:auction_id>/auction-lines` | List line items | Token | – |
| POST | `/auctions/<uuid:auction_id>/auction-lines` | Create line item | Token | Owner only; accepts attachments & additional attributes |
| GET | `/auction-lines/<uuid:id>` | Retrieve line item | Token | – |
| PATCH | `/auction-lines/<uuid:id>` | Update line (quantity, attributes, attachments) | Token | Owner only & RFQ must remain editable |
| DELETE | `/auction-lines/<uuid:id>` | Delete line | Token | – |
| DELETE | `/auction-lines/attachment/<uuid:id>` | Remove line attachment | Token | – |
| GET | `/auction-lines/<uuid:id>/comments` | List line comments | Token | – |
| POST | `/auction-lines/<uuid:id>/comments` | Add line comment | Token | Body `{message}` |

#### Bids

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/auctions/<uuid:auction_id>/bids` | List bids for auction | Token | Auction owner |
| POST | `/auctions/<uuid:auction_id>/bids` | Submit bid header + optional template metadata + lines | Token | Seller with organisation; body includes `templates`, `lst_bid_line` JSON |
| PATCH | `/auctions/<uuid:auction_id>/bids` | Alternate submission method (legacy) | Token | Same contract as POST |
| GET | `/all-bids/` | List bids submitted by current organisation | Token | Sellers only |
| GET | `/bids/<uuid:id>` | Retrieve bid header | Token | – |
| PATCH | `/bids/<uuid:id>` | Update bid status/data | Token | Bid owner only |
| DELETE | `/bids/<uuid:id>` | Delete bid | Token | Owner only |
| GET | `/bids/<uuid:id>/comments` | List header comments (bidder + buyer) | Token | Automatically checks permissions |
| POST | `/bids/<uuid:id>/comments` | Add header comment | Token | – |
| GET | `/bids/<uuid:bid_id>/bid-lines` | List bid lines | Token | – |
| POST | `/bids/<uuid:bid_id>/bid-lines` | Add bid line | Token | Owner only; enforces partial bidding rules |
| GET | `/bid-lines/<uuid:id>` | Retrieve bid line | Token | – |
| PATCH | `/bid-lines/<uuid:id>` | Update bid line | Token | Owner only |
| DELETE | `/bid-lines/<uuid:id>` | Delete bid line | Token | Owner only |
| GET | `/bid-lines/<uuid:id>/comments` | List bid line comments | Token | – |
| POST | `/bid-lines/<uuid:id>/comments` | Add bid line comment | Token | Owner only |
| GET | `/auctions/<uuid:auction_id>/bids` (seller view) | When called by seller that created the bid, returns their submission | Token | Duplicated URL handled by `list_bids_by_auction_view` |

#### Purchase orders & status

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/purchase-orders/` | Buyer view of issued purchase orders | Token | Filters by buyer organisation |
| GET | `/purchase-orders/<uuid:purchase_order_id>/` | Fetch purchase order details | Token | Includes PO header & lines |
| POST | `/purchase-orders/<uuid:purchase_order_id>/` | Render PO as styled HTML/PDF | Token | Returns HTML payload |
| POST | `/create-purchase-order/<uuid:bid_id>/` | Convert winning bid to PO | Token | Generates sequential `document_num`, copies bid lines |
| GET | `/purchase-order-status/` | Supplier view of POs assigned to them | Token | Supplier must be seller |
| POST | `/purchase-order-status/` | Supplier updates status (`Approve`/`Reject`) | Token | Body `{po_id, status}` |
| GET | `/purchase-order-detail/<uuid:supplier_id>/` | Buyer-centric list of PO document numbers for supplier | Token | – |

#### Analytics & dashboards

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/dashboard/` | Buyer dashboard snapshot | Token | Returns counts + last 5 auctions |
| GET | `/supplier-dashboard/` | Supplier dashboard snapshot | Token | Requires seller org |
| GET | `/activity-logs/buyers/` | Buyer activity logs (latest five by default) | Token | Use `?all=true` to fetch everything |
| DELETE | `/activity-logs/buyers/delete/<uuid:log_id>/` | Delete buyer log entry | Token | – |
| GET | `/activity-logs/suppliers/` | Supplier activity logs | Token | – |
| DELETE | `/activity-logs/suppliers/delete/<uuid:log_id>/` | Delete supplier log entry | Token | – |

#### Templates, Incoterms & supplier intelligence

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/list-incoterms/` | List all Incoterms | Token | Useful for RFQs |
| GET | `/templates/` | List every template (admin wide) | Token | – |
| POST | `/templates/` | Create template (stores document fragments) | Token | Body includes `name`, `description`, base64 files |
| GET | `/templates/<uuid:template_id>/` | Retrieve template | Token | – |
| PATCH | `/templates/<uuid:template_id>/` | Update template | Token | – |
| DELETE | `/templates/<uuid:template_id>/delete/` | Delete template | Token | – |
| GET | `/list-templates/` | List templates belonging to current organisation | Token | – |
| GET | `/supplier-actions_count/<uuid:supplier_id>/` | Summary (bids + POs) for supplier vs buyer | Token | Buyer-only |
| GET | `/buyer-suppliers-attachments/<uuid:supplier_id>/` | Fetch RFQ + line attachments exchanged with supplier | Token | Shows header + line attachments |
| GET | `/supplier-bid-details/<uuid:supplier_id>/` | Detailed bids submitted by supplier to current buyer | Token | – |

#### Sample: Create auction header

```json
POST /auctions/
Authorization: Token {{auth_token}}
{
  "title": "FY25 Office Furniture",
  "requisition_number": "RFQ-25-001",
  "product_category": "office-supplies",
  "product_sub_category": "workstations",
  "is_open": true,
  "need_by_date": "2024-11-01T00:00:00Z",
  "note_to_supplier": "Please include delivery timelines",
  "partial_bidding": true,
  "partial_quantity_bidding": false,
  "bln_incoterms": true,
  "incoterms": "fob",
  "authorized_sellers": ["f67a...", "c2a1..."] ,
  "additional_attributes": [{"name": "Budget", "value": "40000"}],
  "attachments": [{"name": "Requirements", "file": "data:application/pdf;base64,JVBERi0..."}],
  "focal_points": [{"user": "buyer@example.com", "role": "owner"}]
}
```

---

### 6. Workflow Approvals

Workflow endpoints honour two feature toggles: global `WORKFLOW_APPROVALS_ENABLED` and organisation-level `workflow_approvals_enabled`. All endpoints require the user to belong to an organisation with the feature enabled.

| Method | Path | Description | Auth | Notes |
| --- | --- | --- | --- | --- |
| GET | `/workflow/settings/` | Read workflow settings for current org | Token | Returns booleans + reminder frequency |
| PATCH | `/workflow/settings/` | Update workflow settings | Token | Organisation admin only |
| GET | `/workflow/templates/` | List workflow templates for org | Token | – |
| POST | `/workflow/templates/` | Create template (steps, conditions, notifications) | Token | Org admin only; body follows `WorkflowTemplateSerializer` |
| GET | `/workflow/templates/<uuid:pk>/` | Retrieve template | Token | – |
| PATCH | `/workflow/templates/<uuid:pk>/` | Update template | Token | Org admin |
| DELETE | `/workflow/templates/<uuid:pk>/` | Delete template | Token | Org admin |
| GET | `/workflow/tasks/` | List pending tasks assigned to user | Token | – |
| POST | `/workflow/tasks/<uuid:pk>/action/` | Approve/Reject task | Token | Body `{action: \"approve\" or \"reject\", comment?}` |
| POST | `/workflow/tasks/<uuid:pk>/delegate/` | Delegate task to another org user | Token | Admin or permitted delegate |
| GET | `/workflow/instances/<uuid:pk>/logs/` | Audit log for workflow instance | Token | Query params `from`, `to` (ISO strings) |

#### Sample: delegate workflow task

```json
POST /workflow/tasks/ee97c0cf-b122-4ea2-9baf-2ef5ebbc954a/delegate/
Authorization: Token {{auth_token}}
{
  "assignee": "0df66faa-5585-4032-81d1-e137b6432bc9"
}
```

---

## Postman Collection & Environment

- **File**: `docs/postman_collection.json`
- **Schema**: Postman v2.1
- **Variables**: the collection relies on `{{base_url}}` (defaults to `https://api.metics.net`) and `{{auth_token}}` (your DRF token). Override them via a Postman environment for multi-stage deployments.
- **Examples**: every POST/PATCH request includes a minimal body aligned with the serializers in code. GET requests show example query parameters in the description.

### Import steps

1. Open Postman → Collections → *Import* → select `docs/postman_collection.json`.
2. Create/choose an environment and add `base_url` + `auth_token`.
3. Run requests directly or convert them to Postman Monitors for regression testing. Attachments already illustrate how to send base64 or multipart payloads.

---

## Next steps & Validation

- Run unit/integration tests relevant to your changes (e.g. `pytest` for business logic) whenever you extend the API.
- Keep this file and the Postman collection in sync. Add new endpoints to both.
- For third-party developers, start with Authentication → Organisation setup → Products → Auctions/Bids to trace the happy path end-to-end.
