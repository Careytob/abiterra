//lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// User related queries
export const userQueries = {
  async createUser(userData: {
    id: string,
    name: string,
    email: string,
    password?: string,
    phone?: string,
    image?: string
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        accounts (*),
        inquiry (*),
        sessions (*)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async updateUser(id: string, updateData: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }
}

// Account related queries
export const accountQueries = {
  async createAccount(accountData: {
    id: string,
    userId: string,
    type: string,
    provider: string,
    providerAccountId: string,
    refresh_token?: string,
    access_token?: string,
    expires_at?: number,
    token_type?: string,
    scope?: string,
    id_token?: string,
    session_state?: string
  }) {
    const { data, error } = await supabase
      .from('accounts')
      .insert([accountData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getAccountByProvider(provider: string, providerAccountId: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('provider', provider)
      .eq('provider_account_id', providerAccountId)
      .single()
    if (error) throw error
    return data
  }
}

// Session related queries
export const sessionQueries = {
  async createSession(sessionData: {
    id: string,
    sessionToken: string,
    userId: string,
    expires: Date
  }) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getSessionByToken(sessionToken: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()
    if (error) throw error
    return data
  },

  async deleteSession(sessionToken: string) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken)
    if (error) throw error
  }
}

// Property related queries
export const propertyQueries = {
  async createProperty(propertyData: {
    title: string,
    description: string,
    location: string,
    price: number,
    type: 'SALE' | 'RENT',
    agentId: string,
    area: number,
    bathrooms: number,
    bedrooms: number,
    bq: number,
    city: string,
    state: string,
    toilets: number,
    latitude?: number,
    longitude?: number
  }) {
    const { data, error } = await supabase
      .from('property')
      .insert([propertyData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getProperties() {
    const { data, error } = await supabase
      .from('property')
      .select(`
        *,
        feature (*),
        image (*),
        inquiry (*)
      `)
      .order('createdAt', { ascending: false })
    if (error) throw error
    return data
  },

  async getPropertyById(id: number) {
    const { data, error } = await supabase
      .from('property')
      .select(`
        *,
        feature (*),
        image (*),
        inquiry (*)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async updateProperty(id: number, updateData: any) {
    const { data, error } = await supabase
      .from('property')
      .update(updateData)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }
}

// Feature related queries
export const featureQueries = {
  async addFeature(featureData: { name: string, propertyId: number }) {
    const { data, error } = await supabase
      .from('feature')
      .insert([featureData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getPropertyFeatures(propertyId: number) {
    const { data, error } = await supabase
      .from('feature')
      .select('*')
      .eq('propertyId', propertyId)
    if (error) throw error
    return data
  }
}

// Image related queries
export const imageQueries = {
  async addImage(imageData: { url: string, propertyId: number }) {
    const { data, error } = await supabase
      .from('image')
      .insert([imageData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getPropertyImages(propertyId: number) {
    const { data, error } = await supabase
      .from('image')
      .select('*')
      .eq('propertyId', propertyId)
    if (error) throw error
    return data
  }
}

// Inquiry related queries
export const inquiryQueries = {
  async createInquiry(inquiryData: {
    userId: string,
    propertyId: number,
    message: string,
    status?: 'PENDING' | 'REVIEWED' | 'CONTACTED'
  }) {
    const { data, error } = await supabase
      .from('inquiry')
      .insert([inquiryData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getPropertyInquiries(propertyId: number) {
    const { data, error } = await supabase
      .from('inquiry')
      .select(`
        *,
        users (*)
      `)
      .eq('propertyId', propertyId)
    if (error) throw error
    return data
  },

  async updateInquiryStatus(id: number, status: 'PENDING' | 'REVIEWED' | 'CONTACTED') {
    const { data, error } = await supabase
      .from('inquiry')
      .update({ status })
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }
}

// Contact related queries
export const contactQueries = {
  async createContact(contactData: {
    firstName: string,
    lastName: string,
    email: string,
    phone?: string,
    inquiry: 'BUYING' | 'LAND' | 'RENTING' | 'OTHER',
    message: string
  }) {
    const { data, error } = await supabase
      .from('contact')
      .insert([contactData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getContacts() {
    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .order('createdAt', { ascending: false })
    if (error) throw error
    return data
  },

  async updateContactStatus(id: number, status: 'PENDING' | 'REVIEWED' | 'CONTACTED') {
    const { data, error } = await supabase
      .from('contact')
      .update({ status })
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  }
}