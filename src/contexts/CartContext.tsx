'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  giftId: string;
  name: string;
  imageUrl: string;
  futureValue: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalFutureValue: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.giftId === action.payload.giftId
      );
      
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
        };
        return {
          items: newItems,
          totalFutureValue: newItems.reduce(
            (sum, item) => sum + item.futureValue * item.quantity,
            0
          ),
        };
      }
      
      const newItem: CartItem = {
        ...action.payload,
        id: `${action.payload.giftId}-${Date.now()}`,
      };
      const newItems = [...state.items, newItem];
      return {
        items: newItems,
        totalFutureValue: newItems.reduce(
          (sum, item) => sum + item.futureValue * item.quantity,
          0
        ),
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        items: newItems,
        totalFutureValue: newItems.reduce(
          (sum, item) => sum + item.futureValue * item.quantity,
          0
        ),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== action.payload.id);
        return {
          items: newItems,
          totalFutureValue: newItems.reduce(
            (sum, item) => sum + item.futureValue * item.quantity,
            0
          ),
        };
      }
      
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: newItems,
        totalFutureValue: newItems.reduce(
          (sum, item) => sum + item.futureValue * item.quantity,
          0
        ),
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], totalFutureValue: 0 };
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], totalFutureValue: 0 });
  
  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
