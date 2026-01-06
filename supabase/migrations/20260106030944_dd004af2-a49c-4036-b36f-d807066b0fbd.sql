-- Create a secure function to create orders with items in a single transaction
-- This is a SECURITY DEFINER function that runs with elevated privileges
-- It validates inputs and creates both the order and order items atomically

CREATE OR REPLACE FUNCTION public.create_order_with_items(
  _customer_name text,
  _customer_phone text,
  _customer_email text DEFAULT NULL,
  _customer_address text DEFAULT NULL,
  _customer_city text DEFAULT NULL,
  _customer_district text DEFAULT NULL,
  _payment_method text DEFAULT 'cod',
  _notes text DEFAULT NULL,
  _delivery_charge numeric DEFAULT 0,
  _items jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order_id uuid;
  _subtotal numeric := 0;
  _total_amount numeric := 0;
  _item jsonb;
  _product record;
BEGIN
  -- Validate required fields
  IF _customer_name IS NULL OR _customer_name = '' THEN
    RAISE EXCEPTION 'Customer name is required';
  END IF;
  
  IF _customer_phone IS NULL OR _customer_phone = '' THEN
    RAISE EXCEPTION 'Customer phone is required';
  END IF;
  
  IF jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'At least one item is required';
  END IF;

  -- Calculate subtotal and validate items
  FOR _item IN SELECT * FROM jsonb_array_elements(_items)
  LOOP
    -- Get product details
    SELECT id, name, price, image INTO _product
    FROM public.products
    WHERE id = (_item->>'product_id')::uuid AND is_active = true;
    
    IF _product.id IS NULL THEN
      RAISE EXCEPTION 'Product not found or inactive: %', _item->>'product_id';
    END IF;
    
    _subtotal := _subtotal + (_product.price * COALESCE((_item->>'quantity')::integer, 1));
  END LOOP;

  _total_amount := _subtotal + COALESCE(_delivery_charge, 0);

  -- Create the order
  INSERT INTO public.orders (
    customer_name,
    customer_phone,
    customer_email,
    customer_address,
    customer_city,
    customer_district,
    payment_method,
    notes,
    subtotal,
    delivery_charge,
    total_amount,
    status
  ) VALUES (
    _customer_name,
    _customer_phone,
    _customer_email,
    _customer_address,
    _customer_city,
    _customer_district,
    _payment_method,
    _notes,
    _subtotal,
    COALESCE(_delivery_charge, 0),
    _total_amount,
    'pending'
  )
  RETURNING id INTO _order_id;

  -- Create order items
  FOR _item IN SELECT * FROM jsonb_array_elements(_items)
  LOOP
    SELECT id, name, price, image INTO _product
    FROM public.products
    WHERE id = (_item->>'product_id')::uuid;
    
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_image,
      quantity,
      unit_price,
      total_price,
      selected_size
    ) VALUES (
      _order_id,
      _product.id,
      _product.name,
      _product.image,
      COALESCE((_item->>'quantity')::integer, 1),
      _product.price,
      _product.price * COALESCE((_item->>'quantity')::integer, 1),
      _item->>'selected_size'
    );
  END LOOP;

  RETURN _order_id;
END;
$$;

-- Grant execute permission to authenticated and anonymous users (for guest checkout)
GRANT EXECUTE ON FUNCTION public.create_order_with_items TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_with_items TO anon;