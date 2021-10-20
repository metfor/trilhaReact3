import { createContext, ReactNode, useContext, useState,useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem("@RocketShoes:cart");

     if (storagedCart) {
       return JSON.parse(storagedCart);
     }

    return [];
  });
  const prevCartRef=useRef<Product[]>();
  useEffect(()=>{
    prevCartRef.current=cart;
  });
  const cartPreviousValue = prevCartRef.current ?? cart;
  useEffect(()=>{
    if(cartPreviousValue!==cart){
      localStorage.setItem("@RocketShoes:cart",JSON.stringify(cart));
    }
  },[cart,cartPreviousValue]);

  const addProduct = async (productId: number) => {
    try {
      const updateCard=[...cart];
      const productExists=updateCard.find(
        (product)=>product.id===productId
      );
      const stock=await api.get(`/stock/${productId}`)
      const stockAmount=stock.data.amount;
      const currentAmount = productExists? productExists.amount:0;
      const amount=currentAmount+1;
      if(amount>stockAmount){
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }
      if(productExists){
        productExists.amount=amount;
      } 
      else{
        const product = await api.get(`/product/${productId}`);
        const newProduct ={
          ...product.data,
          amount:1,
        };
        updateCard.push(newProduct);
      }
      setCart(updateCard);
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
