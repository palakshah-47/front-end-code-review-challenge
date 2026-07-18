export interface Pagination {
  total: number
  limit: number
  offset: number
  total_pages: number
  current_page: number
}

export interface ImageType {
  _score: number
  title: string
  image_id: string
  artist_display: string
}

export interface Response {
  pagination: Pagination
  data: ImageType[]
}
