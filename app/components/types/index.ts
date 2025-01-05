export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  bq: number;
  area: number;
  images: Array<{ url: string }>;
  features: Array<{ name: string }>;
}

export interface PropertyDetailProps {
  property: Property;
}
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export interface ApiResponse {
    properties: Property[];
    pagination: PaginationInfo;
  }