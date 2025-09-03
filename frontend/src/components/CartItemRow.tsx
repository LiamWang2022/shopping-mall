import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  cartSelectors,
  useUpdateQtyMutation,
  useRemoveItemMutation
} from "../services/cartApi";
import { extractErrorMessage } from "../lib/rtkError";

export const CartItemRow = React.memo(function CartItemRow({id}: {id:string}){
  const makeSelectItemById = (id: string) =>
    (state: RootState) => cartSelectors.selectById(state, id)

  const item = useSelector(makeSelectItemById(id))
  const[updateItem, {isLoading:updateLoading}] = useUpdateQtyMutation()
  const[removeItem, {isLoading:removeLoading}] = useRemoveItemMutation()

  if(!item) return null
  const cover = item.images?.[0]?.url

  const onDec = async() => {
    try{
      const next = item.quantity -1
      await updateItem({productId: item.productId, quantity: next}).unwrap()
    }catch(e){
      console.error(extractErrorMessage(e))
    }
  }
  const onInc = async() => {
    try{
      await updateItem({productId: item.productId, quantity: item.quantity + 1}).unwrap()
    }catch(e){
      console.log(extractErrorMessage(e))
    }
  }
  const onRemove = async() => {
    try{
      await removeItem({productId: item.productId})
    }catch(e){
      console.log(extractErrorMessage(e))
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border p-4 bg-white">
      <div className="flex items-center gap-3">
        {cover ? (
          <img
            src={cover}
            alt={item.display_name}
            className="w-16 h-16 object-cover rounded-lg bg-gray-100"
          />
        ) : (
          <div className="w-16 h-16 grid place-items-center rounded-lg bg-gray-100 text-xs text-gray-500">
            No Img
          </div>
        )}
        <div>
          <div className="font-medium">{item.display_name}</div>
          <div className="text-sm text-gray-600">£{Number(item.price).toFixed(2)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="border rounded px-2" disabled={updateLoading} onClick={onDec}>
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button className="border rounded px-2" disabled={updateLoading} onClick={onInc}>
          +
        </button>
        <button className="ml-3 border rounded px-2 py-1" disabled={removeLoading} onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  )
})