import type { RootState } from '../store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

export interface CartItemDTO {
  productId: string
  display_name: string
  price: number
  images?: { url: string; alt?: string }[]
  quantity: number
}

export interface CartDTO { items: CartItemDTO[] }

export const cartAdapter = createEntityAdapter<CartItemDTO, string>({
  selectId: (i: CartItemDTO) => i.productId,
})

export type CartNormalizedState = ReturnType<typeof cartAdapter.getInitialState>

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Cart'],
  //Refect data when reconnect
  // refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (b) => ({

    // GET /api/carts/items
    getCart: b.query<CartNormalizedState, void>({
      query: () => ({ url:'/carts/items', method: 'GET'}),
      transformResponse: (res: CartDTO) =>
        cartAdapter.setAll(cartAdapter.getInitialState(), res.items),
      keepUnusedDataFor: 300,
      //Update specific item
      providesTags: (res) => 
        res 
        ? [{type: 'Cart' as const, id: 'List'}, ...res.ids.map((id) => ({ type:'Cart' as const, id}))]
        : [ {type: 'Cart' as const, id: 'List'} ],
    }),
    // POST /api/carts/items
    addItem: b.mutation <CartDTO, { productId: string, quantity?: number }>({
      query: (body) => ({ url:'/carts/items', method: 'POST', body}),
      //Optimistic update
      async onQueryStarted(arg , lifecycleApi){
        //Ensure cart is existed
        lifecycleApi.dispatch(cartApi.util.prefetch('getCart', undefined, { force: false }))
        const patch = lifecycleApi.dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const exists = draft.entities[arg.productId]
            if(exists) {
              exists.quantity += arg.quantity ?? 1
            }else{
              cartAdapter.upsertOne(draft,{
                productId: arg.productId,
                display_name: '',
                price: 0,
                images: [],
                quantity: arg.quantity ?? 1
              })
            }
          })
        )

        try {
          const { data: serverCart } = await lifecycleApi.queryFulfilled
          lifecycleApi.dispatch(
            cartApi.util.updateQueryData('getCart', undefined, (draft) => {
              syncFromServer(draft, serverCart.items)
            }),
          )
        } catch {
          patch.undo()
        }
      },
      // //Invalidate specific item
      // invalidatesTags: (_, err,arg) => 
      //   err ? [] : [{ type: 'Cart', id: 'List' }, { type: 'Cart', id: arg.productId }]
    }),
    // PATCH /api/carts/items
    updateQty: b.mutation< CartDTO, { productId: string, quantity: number }>({
      query: (body) => ({ url:'/carts/items', method: 'PATCH', body }),
      //Optimistic update
      async onQueryStarted(arg, lifecycleApi){
        const patch = lifecycleApi.dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const it = draft.entities[arg.productId]
            if(it) it.quantity = arg.quantity
        })
      )

      try {
        const { data: serverCart } = await lifecycleApi.queryFulfilled
        lifecycleApi.dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            syncFromServer(draft, serverCart.items)
          }),
        )
      } catch {
        patch.undo()
      }
    },
      //Invalidates specific item
      // invalidatesTags: (_, err, arg) => (
      //   err ? [] : [{ type: 'Cart', id: 'List' }, { type: 'Cart', id: arg.productId }]
      // ),
    }),
    // DELETE /api/cart/items/:productId
    removeItem: b.mutation<CartDTO, { productId: string}>({
      query: ({productId}) => ({ url: `/carts/items/${productId}`, method: 'DELETE'}),
      //Optimistic update
      async onQueryStarted(arg, lifecycleApi){
        const patch = lifecycleApi.dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            cartAdapter.removeOne(draft, arg.productId)
          })
        )

      try {
        const { data: serverCart } = await lifecycleApi.queryFulfilled
        lifecycleApi.dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            syncFromServer(draft, serverCart.items)
          }),
        )
      } catch {
        patch.undo()
      }
      },
      //Invalidates specific item
      // invalidatesTags: (_, err, arg) => (
      //   err ? [] : [{ type: 'Cart', id: 'List' }, { type: 'Cart', id: arg.productId }]
      // )
    })
  }),
})

export const {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateQtyMutation,
  useRemoveItemMutation,
} = cartApi

function syncFromServer(draft: CartNormalizedState, serverItems: CartItemDTO[]) {
  for (const s of serverItems) {
    const cur = draft.entities[s.productId]
    if (!cur) {
      cartAdapter.addOne(draft, s)
    } else {
      if (cur.quantity !== s.quantity) cur.quantity = s.quantity
      if (cur.price !== s.price) cur.price = s.price
      if (cur.display_name !== s.display_name) cur.display_name = s.display_name

      const a = cur.images ?? []
      const b = s.images ?? []
      const sameLen = a.length === b.length
      const sameAll = sameLen && a.every((ai, idx) => ai.url === b[idx].url && ai.alt === b[idx].alt)
      if (!sameAll) cur.images = s.images
    }
  }

  const serverIds = new Set(serverItems.map((i) => i.productId))
  const toRemove = (draft.ids as string[]).filter((id) => !serverIds.has(id))
  if (toRemove.length) cartAdapter.removeMany(draft, toRemove)
}

const selectGetCartResult = cartApi.endpoints.getCart.select()

export const selectCartAdapterState = createSelector(
  selectGetCartResult,
  (res) => res.data ?? cartAdapter.getInitialState()
)

export const cartSelectors = cartAdapter.getSelectors<RootState>(selectCartAdapterState)

export const selectCartTotalQty = createSelector(selectCartAdapterState, (s) =>
  (s.ids as string[]).reduce((sum, id) => sum + (s.entities[id]!.quantity || 0), 0)
)

export const selectCartTotalPrice = createSelector(selectCartAdapterState, (s) =>
  (s.ids as string[]).reduce((sum, id) => {
    const it = s.entities[id]!
    return sum + (it.price || 0) * (it.quantity || 0)
  }, 0)
)