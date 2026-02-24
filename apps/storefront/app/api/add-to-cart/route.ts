import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { variant_id, quantity = 1, cart_id } = body;

        if (!variant_id) {
            return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
        }

        let cartIdToUse = cart_id;

        // If no cart exists, create one
        if (!cartIdToUse) {
            const createCartRes = await fetch(`${BACKEND_URL}/store/carts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-publishable-api-key': PUBLISHABLE_KEY
                },
                body: JSON.stringify({
                    region_id: 'reg_SUDAN',
                    currency_code: 'sdg'
                })
            });

            if (!createCartRes.ok) {
                const errorData = await createCartRes.text();
                console.error('[Add to Cart] Failed to create cart:', errorData);
                return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
            }

            const cartData = await createCartRes.json();
            cartIdToUse = cartData.cart.id;
        }

        // Add item to cart
        const addItemRes = await fetch(`${BACKEND_URL}/store/carts/${cartIdToUse}/line-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': PUBLISHABLE_KEY
            },
            body: JSON.stringify({
                variant_id,
                quantity
            })
        });

        if (!addItemRes.ok) {
            const errorData = await addItemRes.text();
            console.error('[Add to Cart] Failed to add item:', errorData);
            return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
        }

        const updatedCart = await addItemRes.json();

        return NextResponse.json({
            success: true,
            cartId: cartIdToUse,
            cart: updatedCart.cart
        });

    } catch (error: any) {
        console.error('[Add to Cart] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
