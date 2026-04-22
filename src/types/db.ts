export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sort_order: number;
};

export type Service = {
  id: string;
  category_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  price_unit: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Worker = {
  id: string;
  full_name: string;
  phone: string;
  specialties: string[];
  areas: string[];
  rating: number;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
};

export type OrderStatus = "new" | "accepted" | "in_progress" | "completed" | "cancelled";

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: string;
  province: string | null;
  district: string | null;
  service_id: string | null;
  description: string | null;
  images: string[];
  scheduled_at: string | null;
  status: OrderStatus;
  assigned_worker_id: string | null;
  internal_note: string | null;
  total_price: number | null;
  created_at: string;
  updated_at: string;
};

export type ProjectStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export type ProjectInquiry = {
  id: string;
  company_name: string;
  tax_code: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  project_type: string;
  area_sqm: number | null;
  budget: number | null;
  timeline: string | null;
  description: string | null;
  attachment_urls: string[];
  status: ProjectStatus;
  internal_note: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin" | "staff";
  created_at: string;
};
