CREATE OR REPLACE FUNCTION public.create_order_with_items(
  _customer_name text, 
  _customer_phone text, 
  _customer_email text DEFAULT NULL::text, 
  _customer_address text DEFAULT NULL::text, 
  _customer_city text DEFAULT NULL::text, 
  _customer_district text DEFAULT NULL::text, 
  _payment_method text DEFAULT 'cod'::text, 
  _notes text DEFAULT NULL::text, 
  _delivery_charge numeric DEFAULT 0, 
  _items jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _order_id uuid;
  _subtotal numeric := 0;
  _total_amount numeric := 0;
  _item jsonb;
  _product record;
  _product_id uuid;
  _product_name text;
  _product_image text;
  _unit_price numeric;
  _quantity integer;
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
    _product_id := NULL;
    _product_name := NULL;
    _product_image := NULL;
    _unit_price := NULL;
    _quantity := COALESCE((_item->>'quantity')::integer, 1);
    
    -- Check if product_id is provided and valid
    IF _item->>'product_id' IS NOT NULL AND _item->>'product_id' != '' THEN
      -- Try to get product from database
      SELECT id, name, price, image INTO _product
      FROM public.products
      WHERE id = (_item->>'product_id')::uuid AND is_active = true;
      
      IF _product.id IS NOT NULL THEN
        _product_id := _product.id;
        _product_name := _product.name;
        _product_image := _product.image;
        _unit_price := _product.price;
      END IF;
    END IF;
    
    -- If product not found in DB, use provided values
    IF _product_name IS NULL THEN
      _product_name := _item->>'product_name';
      _product_image := _item->>'product_image';
      _unit_price := COALESCE((_item->>'unit_price')::numeric, 0);
    END IF;
    
    -- Validate we have required data
    IF _product_name IS NULL OR _product_name = '' THEN
      RAISE EXCEPTION 'Product name is required for each item';
    END IF;
    
    IF _unit_price IS NULL OR _unit_price <= 0 THEN
      RAISE EXCEPTION 'Valid unit price is required for each item';
    END IF;
    
    _subtotal := _subtotal + (_unit_price * _quantity);
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
    _product_id := NULL;
    _product_name := NULL;
    _product_image := NULL;
    _unit_price := NULL;
    _quantity := COALESCE((_item->>'quantity')::integer, 1);
    
    -- Check if product_id is provided and valid
    IF _item->>'product_id' IS NOT NULL AND _item->>'product_id' != '' THEN
      SELECT id, name, price, image INTO _product
      FROM public.products
      WHERE id = (_item->>'product_id')::uuid;
      
      IF _product.id IS NOT NULL THEN
        _product_id := _product.id;
        _product_name := _product.name;
        _product_image := _product.image;
        _unit_price := _product.price;
      END IF;
    END IF;
    
    -- If product not found in DB, use provided values
    IF _product_name IS NULL THEN
      _product_name := _item->>'product_name';
      _product_image := _item->>'product_image';
      _unit_price := COALESCE((_item->>'unit_price')::numeric, 0);
    END IF;
    
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
      _product_id,
      _product_name,
      _product_image,
      _quantity,
      _unit_price,
      _unit_price * _quantity,
      _item->>'selected_size'
    );
  END LOOP;

  RETURN _order_id;
END;
$$;