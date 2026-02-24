"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

interface Translations {
    nav: {
        home: string
        cosmetics: string
        perfumes: string
        fashion: string
        accessories: string
        sudanese: string
        about: string
        contact: string
        account: string
        cart: string
        wishlist: string
    }
    header: {
        customer_service: string
        search_placeholder: string
        search_label: string
        login_label: string
        language_label: string
        cart_label: string
        wishlist_label: string
        menu_label: string
        free_shipping_text: string
        remaining_for_free_shipping: string
        congrats_free_shipping: string
        ola_store: string
    }
    footer: {
        about_title: string
        about_text: string
        links_title: string
        categories_title: string
        contact_title: string
        follow_us: string
        rights: string
        privacy: string
        terms: string
        location: string
        all_products: string
        shipping_policy: string
        returns_policy: string
        ola_store: string
    }
    home: {
        hero_title: string
        hero_subtitle: string
        shop_now: string
        featured_products: string
        new_arrivals: string
        browse_categories: string
        reviews_title: string
        app_download_title: string
        app_download_text: string
        home_badges: {
            new: string
            new_arrivals: string
            mix_save: string
            gifts_sets: string
            sudanese_beauty: string
        }
        reviews: Array<{
            id: number
            name: string
            city: string
            rating: number
            comment: string
            color: string
        }>
        reviews_subtitle: string
        reviews_badge: string
        tiktok: string
        youtube: string
        follow_us: string
        watch_tutorials: string
        trust_badges: Array<{
            title: string
            description: string
        }>
        story_badge: string
        story_title: string
        story_subtitle: string
        ritual_badge: string
        ritual_title: string
        ritual_description: string
        shop_ritual: string
        podcast_title: string
        podcast_subtitle: string
    }
    products: {
        title: string
        all: string
        all_products: string
        found_products: string
        no_products_found: string
        error_loading_products: string
        loading_products: string
        filter_title: string
        sort_title: string
        price_low_high: string
        price_high_low: string
        newest: string
        add_to_cart: string
        add_to_cart_label: string
        out_of_stock: string
        view_details: string
        new_badge: string
        wishlist_add: string
        wishlist_remove: string
        wishlist_login_required: string
        added_to_cart: string
        add_to_cart_error: string
        discount_label: string
        select_quantity: string
        added_label: string
        adding_label: string
        authentic_label: string
        cod_label: string
        details_label: string
        no_description: string
        not_available: string
        wishlist_error: string
        terms: string
        shipping_policy: string
        returns_policy: string
        ola_store: string
    }
    messages: {
        success: string
        error: string
        loading: string
    }
    cart: {
        title: string
        empty_title: string
        empty_text: string
        continue_shopping: string
        checkout: string
        summary_title: string
        subtotal: string
        shipping: string
        shipping_free: string
        shipping_threshold_text: string
        free_shipping_congrats: string
        total: string
        items_count: string
        original_product: string
        unit_price_label: string
        remove: string
        secure_checkout_text: string
        return_policy_text: string
        item_removed: string
        update_quantity_success: string
        update_quantity_error: string
        remove_item_success: string
        remove_item_error: string
    }
    checkout: {
        title: string
        shipping_address: string
        payment_method: string
        order_summary: string
        place_order: string
        processing: string
        first_name: string
        last_name: string
        email: string
        phone: string
        address: string
        city: string
        complete_purchase: string
        shipping_calculated_later: string
        delivery_info: string
        coupon_placeholder: string
        apply_coupon: string
        coupon_error: string
        discount_label: string
        cod_label: string
        cod_description: string
        success_title: string
        success_message: string
        back_to_home: string
        required_fields_error: string
        loyalty_earned_desc: string
        have_coupon: string
        coupon_applied: string
        cities: { id: string; name: string }[]
    }
    account: {
        title: string
        orders: string
        wishlist: string
        profile: string
        loyalty: string
        coupons: string
        addresses: string
        logout: string
        no_orders: string
        no_wishlist: string
        no_coupons: string
        order_details: string
        order_number: string
        order_date: string
        order_total: string
        order_status: string
        points_balance: string
        points_earned: string
        points_history: string
        points_history_empty: string
        tier_label: string
        how_to_earn: string
        how_to_redeem: string
        exclusive_gifts: string
        earn_info: string
        redeem_info: string
        gifts_info: string
        verify_whatsapp: string
        verify_whatsapp_desc: string
        send_code: string
        confirm_code: string
        code_placeholder: string
        verification_success: string
        verification_error: string
        profile_info: string
        edit: string
        save: string
        cancel: string
        first_name: string
        last_name: string
        email: string
        phone: string
        calling_phone: string
        secondary_phone_optional: string
        city: string
        select_city: string
        birthday: string
        update_success: string
        update_error: string
        connection_error: string
        loading_orders: string
        loading_coupons: string
        copy_code: string
        code_copied: string
    }
    popups: {
        purchase_prefix: string
        purchase_from: string
        purchase_bought: string
        purchase_time: {
            just_now: string
            one_min: string
            two_mins: string
            three_mins: string
            five_mins: string
        }
        purchases: Array<{
            name: string
            city: string
            product: string
        }>
    }
    search: {
        no_results: string
        suggested_categories: string
        categories: string[]
    }
}

const translations: Record<Language, Translations> = {
    ar: {
        nav: {
            home: "الرئيسية",
            cosmetics: "مستحضرات تجميل",
            perfumes: "عطور",
            fashion: "أزياء",
            accessories: "اكسسوارات",
            sudanese: "المنتجات السودانية",
            about: "عن متجر العُلا",
            contact: "اتصل بنا",
            account: "حسابي",
            cart: "السلة",
            wishlist: "المفضلة"
        },
        header: {
            customer_service: "خدمة العملاء",
            search_placeholder: "ابحث عن منتجات...",
            search_label: "بحث",
            login_label: "حسابي",
            language_label: "تغيير اللغة",
            cart_label: "السلة",
            wishlist_label: "المفضلة",
            menu_label: "القائمة",
            free_shipping_text: "شحن مجاني للطلبات فوق {threshold} جنيه",
            remaining_for_free_shipping: "متبقي {amount} جنيه للحصول على الشحن المجاني",
            congrats_free_shipping: "🎉 مبروك! حصلت على شحن مجاني",
            ola_store: "متجر العُلا"
        },
        footer: {
            about_title: "عن متجر العُلا",
            about_text: "متجرك الأول لكل مستلزمات الجمال، العطور الرقية، والأزياء السودانية الأصيلة. نسعى دائماً لتقديم الأفضل لعملائنا.",
            links_title: "روابط سريعة",
            categories_title: "الأقسام",
            contact_title: "تواصل معنا",
            follow_us: "تابعنا",
            rights: "جميع الحقوق محفوظة.",
            privacy: "سياسة الخصوصية",
            terms: "شروط الاستخدام",
            location: "بورتسودان، السودان",
            all_products: "كل المنتجات",
            shipping_policy: "سياسة الشحن",
            returns_policy: "سياسة الإرجاع",
            ola_store: "متجر العُلا"
        },
        home: {
            hero_title: "جمالك، اختيارنا الأول",
            hero_subtitle: "اكتشفي تشكيلة واسعة من أرقى العطور ومستحضرات التجميل العالمية والمحلية.",
            shop_now: "تسوقي الآن",
            featured_products: "منتجات مميزة",
            new_arrivals: "وصل حديثاً",
            browse_categories: "تصفح الأقسام",
            reviews_title: "آراء عميلاتنا",
            app_download_title: "حملي تطبيق العُلا",
            app_download_text: "تسوقي أسهل وأسرع مع تطبيقنا المخصص للهواتف الذكية.",
            home_badges: {
                new: "جديد",
                new_arrivals: "وصل حديثاً",
                mix_save: "امزج ووفر",
                gifts_sets: "هدايا ومجموعات",
                sudanese_beauty: "جمال سوداني"
            },
            reviews: [
                {
                    id: 1,
                    name: "سارة أحمد",
                    city: "بورتسودان",
                    rating: 5,
                    comment: "منتجات رائعة وأصلية! التوصيل سريع جداً في بورتسودان والخدمة ممتازة. العطر ريحته خيال وثابتة.",
                    color: "from-pink-500/10 to-rose-500/10"
                },
                {
                    id: 2,
                    name: "فاطمة علي",
                    city: "الخرطوم",
                    rating: 5,
                    comment: "أفضل متجر للمكياج في السودان! المنتجات وصلتني مغلفة بطريقة راقية جداً والتعامل عبر واتساب مريح جداً.",
                    color: "from-emerald-500/10 to-teal-500/10"
                },
                {
                    id: 3,
                    name: "منى م.",
                    city: "عطبرة",
                    rating: 5,
                    comment: "بجد كنت خايفة أطلب أونلاين بس العُلا طلع ثقة. منتجات أصلية وبأسعار منطقية جداً. شكراً ليكم!",
                    color: "from-blue-500/10 to-indigo-500/10"
                },
                {
                    id: 4,
                    name: "هبة حسن",
                    city: "كسلا",
                    rating: 5,
                    comment: "جودة المنتجات مذهلة حقاً! طلبت عطور ومستحضرات بشرة وكلها طلعت فاخرة. الشحن لكسلا كان سريع.",
                    color: "from-amber-500/10 to-orange-500/10"
                }
            ],
            reviews_subtitle: "نفتخر بخدمة آلاف العميلات في كافة أنحاء السودان، وسعادتهن هي سر نجاحنا.",
            reviews_badge: "ماذا تقول الجميلات عنا",
            tiktok: "تيك توك",
            youtube: "يوتيوب",
            follow_us: "تابعينا على يوتيوب",
            watch_tutorials: "شاهدي أحدث الدروس والنصائح الجمالية",
            trust_badges: [
                {
                    title: "منتجات أصلية",
                    description: "ماركات أصلية 100%"
                },
                {
                    title: "توصيل سريع",
                    description: "توصيل خلال 2-3 أيام لكافة الولايات"
                },
                {
                    title: "دعم فني 24/7",
                    description: "دائماً هنا لمساعدتك"
                },
                {
                    title: "أفضل جودة",
                    description: "تشكيلة مختارة بعناية"
                }
            ],
            story_badge: "التراث",
            story_title: "طقوس سودانية",
            story_subtitle: "قرون من التقاليد، معبأة من أجلك.",
            ritual_badge: "الطقوس",
            ritual_title: "الدلكة السودانية",
            ritual_description: "أكثر من مجرد مقشر. إنها تقاليد عريقة تمتد لقرون.",
            shop_ritual: "تسوقي الطقس",
            podcast_title: "العُلا بودكاست",
            podcast_subtitle: "استمع إلى قصصنا وإلهامنا"
        },
        products: {
            title: "المنتجات",
            all: "الكل",
            all_products: "كافة المنتجات",
            found_products: "تم العثور على {count} منتج",
            no_products_found: "لم يتم العثور على منتجات",
            error_loading_products: "حدث خطأ في تحميل المنتجات",
            loading_products: "جاري التحميل...",
            filter_title: "التصنيفات",
            sort_title: "ترتيب حسب",
            price_low_high: "السعر: من الأقل للأعلى",
            price_high_low: "السعر: من الأعلى للأقل",
            newest: "الأحدث",
            add_to_cart: "أضف للسلة",
            add_to_cart_label: "أضف للسلة",
            out_of_stock: "نفد من المخزن",
            view_details: "عرض التفاصيل",
            new_badge: "جديد",
            wishlist_add: "تمت إضافة المنتج إلى المفضلة",
            wishlist_remove: "تمت إزالة المنتج من المفضلة",
            wishlist_login_required: "يرجى تسجيل الدخول لحفظ المنتجات في المفضلة",
            added_to_cart: "تمت إضافة المنتج إلى السلة بنجاح",
            add_to_cart_error: "عذراً، فشل إضافة المنتج إلى السلة",
            discount_label: "خصم",
            select_quantity: "اختر الكمية",
            added_label: "تمت الإضافة",
            adding_label: "جاري الإضافة...",
            authentic_label: "منتج أصلي 100%",
            cod_label: "الدفع عند الاستلام",
            details_label: "التفاصيل والوصف",
            no_description: "لا يوجد وصف متوفر لهذا المنتج حالياً.",
            not_available: "عذراً، هذا المنتج غير متوفر حالياً",
            wishlist_error: "عذراً، فشل تحديث المفضلة",
            terms: "شروط الخدمة",
            shipping_policy: "سياسة الشحن",
            returns_policy: "سياسة الإرجاع",
            ola_store: "متجر العُلا"
        },
        messages: {
            success: "نجاح",
            error: "خطأ",
            loading: "جاري التحميل..."
        },
        cart: {
            title: "سلة التسوق",
            empty_title: "سلة التسوق فارغة",
            empty_text: "يبدو أنك لم تضف أي منتجات إلى سلتك بعد. ابدأ التسوق الآن واكتشف عروضنا المميزة!",
            continue_shopping: "ابدأ التسوق",
            checkout: "إتمام الطلب",
            summary_title: "ملخص الطلب",
            subtotal: "المجموع الفرعي",
            shipping: "رسوم الشحن",
            shipping_free: "مجاني",
            shipping_threshold_text: "أضف {amount} للحصول على شحن مجاني!",
            free_shipping_congrats: "🎉 مبروك! لقد حصلت على شحن مجاني لطلبك.",
            total: "الإجمالي",
            items_count: "{count} منتجات",
            original_product: "منتج أصلي",
            unit_price_label: "للقطعة",
            remove: "حذف",
            secure_checkout_text: "تسوق آمن ومضمون ١٠٪",
            return_policy_text: "سياسة إرجاع مرنة خلال ١٤ يوم",
            item_removed: "تم حذف المنتج",
            update_quantity_success: "تم تحديث الكمية",
            update_quantity_error: "فشل تحديث الكمية",
            remove_item_success: "تم حذف المنتج من السلة",
            remove_item_error: "فشل حذف المنتج"
        },
        checkout: {
            title: "إتمام الشراء",
            shipping_address: "عنوان الشحن",
            payment_method: "طريقة الدفع",
            order_summary: "ملخص الطلب",
            place_order: "تأكيد الطلب",
            processing: "جاري المعالجة...",
            first_name: "الاسم الأول",
            last_name: "اسم العائلة",
            email: "البريد الإلكتروني",
            phone: "رقم الهاتف",
            address: "العنوان",
            city: "المدينة",
            complete_purchase: "إتمام الشراء",
            shipping_calculated_later: "يتم حسابها لاحقاً",
            delivery_info: "معلومات التوصيل",
            coupon_placeholder: "أدخل الكود هنا",
            apply_coupon: "تطبيق",
            coupon_error: "كود الخصم غير صالح",
            discount_label: "الخصم",
            cod_label: "الدفع عند الاستلام",
            cod_description: "ادفع نقداً عند استلام طلبك",
            success_title: "تم استلام طلبك بنجاح!",
            success_message: "شكراً لتسوقك معنا، {name}. سنقوم بالتواصل معك قريباً لتأكيد التوصيل.",
            back_to_home: "العودة للرئيسية",
            required_fields_error: "يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، العنوان)",
            loyalty_earned_desc: "شراء منتجات (طلب #{id})",
            have_coupon: "هل لديك كود خصم؟",
            coupon_applied: "تم تطبيق الخصم: {code}",
            cities: [
                { id: "الخرطوم", name: "الخرطوم" },
                { id: "أم درمان", name: "أم درمان" },
                { id: "بحري", name: "بحري" },
                { id: "بورتسودان", name: "بورتسودان" },
                { id: "مدني", name: "مدني" },
                { id: "عطبرة", name: "عطبرة" },
                { id: "نيالا", name: "نيالا" },
                { id: "دنقلا", name: "دنقلا" }
            ]
        },
        account: {
            title: "حسابي",
            orders: "طلباتي",
            wishlist: "قائمة الأمنيات",
            profile: "الملف الشخصي",
            loyalty: "نقاط الولاء",
            coupons: "قسائم الخصم",
            addresses: "العناوين",
            logout: "تسجيل الخروج",
            no_orders: "لا توجد طلبات سابقة",
            no_wishlist: "قائمة الأمنيات فارغة",
            no_coupons: "لا توجد قسائم حالياً",
            order_details: "تفاصيل الطلب",
            order_number: "رقم الطلب",
            order_date: "التاريخ",
            order_total: "المجموع",
            order_status: "الحالة",
            points_balance: "رصيدك الحالي",
            points_earned: "نقطة ولاء",
            points_history: "سجل النقاط",
            points_history_empty: "لا توجد عمليات سابقة على النقاط",
            tier_label: "المستوى الحالي",
            how_to_earn: "اجمعي النقاط",
            how_to_redeem: "استبدلي النقاط",
            exclusive_gifts: "هدايا حصرية",
            earn_info: "نقطة واحدة لكل 10,000 SDG مشتريات",
            redeem_info: "كل نقطة تساوي 5,000 SDG خصم مباشر",
            gifts_info: "استمتعي بعروض خاصة لمستوى ولائك",
            verify_whatsapp: "وثقي حسابك عبر واتساب",
            verify_whatsapp_desc: "خطوة أخيرة لتفعيل حماية حسابك وميزات الولاء الحصرية.",
            send_code: "إرسال الرمز",
            confirm_code: "تأكيد",
            code_placeholder: "000000",
            verification_success: "تم توثيق الحساب بنجاح!",
            verification_error: "رمز التحقق غير صحيح",
            profile_info: "معلومات الحساب",
            edit: "تعديل",
            save: "حفظ التغييرات",
            cancel: "إلغاء",
            first_name: "الاسم الأول",
            last_name: "الاسم الأخير",
            email: "البريد الإلكتروني",
            phone: "رقم الواتساب الرئيسي",
            calling_phone: "رقم الهاتف للاتصال",
            secondary_phone_optional: "رقم هاتف إضافي (اختياري)",
            city: "المدينة",
            select_city: "اختر المدينة",
            birthday: "تاريخ الميلاد",
            update_success: "تم تحديث الملف الشخصي بنجاح!",
            update_error: "فشل تحديث الملف الشخصي",
            connection_error: "خطأ في الاتصال",
            loading_orders: "جاري تحميل الطلبات...",
            loading_coupons: "جاري تحميل القسائم...",
            copy_code: "نسخ الكود",
            code_copied: "تم نسخ الكود!"
        },
        popups: {
            purchase_prefix: "قامت",
            purchase_from: "من",
            purchase_bought: "بشراء",
            purchase_time: {
                just_now: "الآن",
                one_min: "منذ دقيقة",
                two_mins: "منذ دقيقتين",
                three_mins: "منذ ٣ دقائق",
                five_mins: "منذ ٥ دقائق"
            },
            purchases: [
                { name: "سارة أ.", city: "بورتسودان", product: "عطر ليالي الشرق" },
                { name: "منى م.", city: "عطبرة", product: "مجموعة العناية بالبشرة" },
                { name: "مريم ت.", city: "بورتسودان", product: "سيروم الهيالورونيك" },
                { name: "أمل خ.", city: "عطبرة", product: "كريم الترطيب العميق" }
            ]
        },
        search: {
            no_results: "لم نعثر على نتائج لـ \"{query}\"",
            suggested_categories: "فئات مقترحة",
            categories: ["عطور", "مستحضرات تجميل", "أزياء", "أدوات عناية", "منتجات سودانية"]
        }
    },
    en: {
        nav: {
            home: "Home",
            cosmetics: "Cosmetics",
            perfumes: "Perfumes",
            fashion: "Fashion",
            accessories: "Accessories",
            sudanese: "Sudanese Products",
            about: "About Ola Shop",
            contact: "Contact Us",
            account: "Account",
            cart: "Cart",
            wishlist: "Wishlist"
        },
        header: {
            customer_service: "Customer Service",
            search_placeholder: "Search products...",
            search_label: "Search",
            login_label: "Account",
            language_label: "Change Language",
            cart_label: "Cart",
            wishlist_label: "Wishlist",
            menu_label: "Menu",
            free_shipping_text: "Free shipping for orders over {threshold} SDG",
            remaining_for_free_shipping: "{amount} SDG remaining for free shipping",
            congrats_free_shipping: "🎉 Congrats! You got free shipping",
            ola_store: "Ola Store"
        },
        footer: {
            about_title: "About Ola Shop",
            about_text: "Your first destination for all beauty needs, premium perfumes, and authentic Sudanese fashion. We always strive to provide the best for our customers.",
            links_title: "Quick Links",
            categories_title: "Categories",
            contact_title: "Contact Us",
            follow_us: "Follow Us",
            rights: "All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Use",
            location: "Port Sudan, Sudan",
            all_products: "All Products",
            shipping_policy: "Shipping Policy",
            returns_policy: "Return Policy",
            ola_store: "Ola Shop"
        },
        home: {
            hero_title: "Your Beauty, Our Priority",
            hero_subtitle: "Discover a wide range of the finest international and local perfumes and cosmetics.",
            shop_now: "Shop Now",
            featured_products: "Featured Products",
            new_arrivals: "New Arrivals",
            browse_categories: "Browse Categories",
            reviews_title: "Customer Reviews",
            app_download_title: "Download Ola App",
            app_download_text: "Shop easier and faster with our dedicated smartphone app.",
            home_badges: {
                new: "New",
                new_arrivals: "New Arrivals",
                mix_save: "Mix & Save",
                gifts_sets: "Gifts & Sets",
                sudanese_beauty: "Sudanese Beauty"
            },
            reviews: [
                {
                    id: 1,
                    name: "Sarah Ahmed",
                    city: "Port Sudan",
                    rating: 5,
                    comment: "Amazing and authentic products! Very fast delivery in Port Sudan and excellent service. The perfume smells divine and lasts long.",
                    color: "from-pink-500/10 to-rose-500/10"
                },
                {
                    id: 2,
                    name: "Fatima Ali",
                    city: "Khartoum",
                    rating: 5,
                    comment: "Best makeup store in Sudan! My products arrived elegantly packaged and the WhatsApp support is very helpful.",
                    color: "from-emerald-500/10 to-teal-500/10"
                },
                {
                    id: 3,
                    name: "Mona M.",
                    city: "Atbara",
                    rating: 5,
                    comment: "I was hesitant to order online, but Ola turned out to be trustworthy. Original products at very fair prices. Thank you!",
                    color: "from-blue-500/10 to-indigo-500/10"
                },
                {
                    id: 4,
                    name: "Heba Hassan",
                    city: "Kassala",
                    rating: 5,
                    comment: "Stunning quality! Ordered several perfumes and skincare items, and all were premium. Shipping to Kassala was quick.",
                    color: "from-amber-500/10 to-orange-500/10"
                }
            ],
            reviews_subtitle: "We are proud to serve thousands of customers across Sudan, and their happiness is the secret to our success.",
            reviews_badge: "What beauties say about us",
            tiktok: "TikTok",
            youtube: "YouTube",
            follow_us: "Follow us on YouTube",
            watch_tutorials: "Watch latest tutorials and beauty tips",
            trust_badges: [
                {
                    title: "Authentic Products",
                    description: "100% Original Brands"
                },
                {
                    title: "Fast Delivery",
                    description: "Delivery in 2-3 days to all states"
                },
                {
                    title: "Support 24/7",
                    description: "Always here to help you"
                },
                {
                    title: "Best Quality",
                    description: "Carefully selected collection"
                }
            ],
            story_badge: "The Heritage",
            story_title: "Sudanese Rituals",
            story_subtitle: "Centuries of tradition, bottled for you.",
            ritual_badge: "The Ritual",
            ritual_title: "Sudanese Dilka",
            ritual_description: "More than a scrub. It's a centuries-old tradition.",
            shop_ritual: "Shop the Ritual",
            podcast_title: "Ola Podcast",
            podcast_subtitle: "Listen to our stories and inspiration"
        },
        products: {
            title: "Products",
            all: "All",
            all_products: "All Products",
            found_products: "Found {count} products",
            no_products_found: "No products found",
            error_loading_products: "Error loading products",
            loading_products: "Loading...",
            filter_title: "Categories",
            sort_title: "Sort By",
            price_low_high: "Price: Low to High",
            price_high_low: "Price: High to Low",
            newest: "Newest",
            add_to_cart: "Add to Cart",
            add_to_cart_label: "Add to Cart",
            out_of_stock: "Out of Stock",
            view_details: "View Details",
            new_badge: "New",
            wishlist_add: "Added to wishlist",
            wishlist_remove: "Removed from wishlist",
            wishlist_login_required: "Please login to save products to wishlist",
            added_to_cart: "Product added to cart successfully",
            add_to_cart_error: "Sorry, failed to add product to cart",
            discount_label: "OFF",
            select_quantity: "Select Quantity",
            added_label: "Added",
            adding_label: "Adding...",
            authentic_label: "100% Authentic",
            cod_label: "Cash on Delivery",
            details_label: "Details & Description",
            no_description: "Currently, there is no description available for this product.",
            not_available: "Sorry, this product is currently not available",
            wishlist_error: "Sorry, failed to update wishlist",
            terms: "Terms of Service",
            shipping_policy: "Shipping Policy",
            returns_policy: "Return Policy",
            ola_store: "Ola Store"
        },
        messages: {
            success: "Success",
            error: "Error",
            loading: "Loading..."
        },
        cart: {
            title: "Shopping Cart",
            empty_title: "Your Cart is Empty",
            empty_text: "Looks like you haven't added anything to your cart yet. Start shopping now!",
            continue_shopping: "Start Shopping",
            checkout: "Checkout",
            summary_title: "Order Summary",
            subtotal: "Subtotal",
            shipping: "Shipping",
            shipping_free: "Free",
            shipping_threshold_text: "Add {amount} more for FREE shipping!",
            free_shipping_congrats: "🎉 Congrats! You've unlocked free shipping.",
            total: "Total",
            items_count: "{count} items",
            original_product: "Authentic Product",
            unit_price_label: "per item",
            remove: "Remove",
            secure_checkout_text: "100% Secure Shopping",
            return_policy_text: "Flexible 14-day Return Policy",
            item_removed: "Item removed",
            update_quantity_success: "Quantity updated",
            update_quantity_error: "Failed to update quantity",
            remove_item_success: "Item removed from cart",
            remove_item_error: "Failed to remove item"
        },
        checkout: {
            title: "Checkout",
            shipping_address: "Shipping Address",
            payment_method: "Payment Method",
            order_summary: "Order Summary",
            place_order: "Place Order",
            processing: "Processing...",
            first_name: "First Name",
            last_name: "Last Name",
            email: "Email",
            phone: "Phone",
            address: "Address",
            city: "City",
            complete_purchase: "Complete Purchase",
            shipping_calculated_later: "Calculated at next step",
            delivery_info: "Delivery Information",
            coupon_placeholder: "Enter code here",
            apply_coupon: "Apply",
            coupon_error: "Invalid discount code",
            discount_label: "Discount",
            cod_label: "Cash on Delivery",
            cod_description: "Pay cash when you receive your order",
            success_title: "Order Placed Successfully!",
            success_message: "Thank you for shopping with us, {name}. We will contact you soon to confirm delivery.",
            back_to_home: "Back to Home",
            required_fields_error: "Please fill all required fields (Name, Phone, Address)",
            loyalty_earned_desc: "Purchase products (Order #{id})",
            have_coupon: "Have a discount code?",
            coupon_applied: "Promo applied: {code}",
            cities: [
                { id: "الخرطوم", name: "Khartoum" },
                { id: "أم درمان", name: "Omdurman" },
                { id: "بحري", name: "Bahri" },
                { id: "بورتسودان", name: "Port Sudan" },
                { id: "مدني", name: "Wad Madani" },
                { id: "عطبرة", name: "Atbara" },
                { id: "نيالا", name: "Nyala" },
                { id: "دنقلا", name: "Dongola" }
            ]
        },
        account: {
            title: "My Account",
            orders: "My Orders",
            wishlist: "Wishlist",
            profile: "Profile",
            loyalty: "Loyalty Points",
            coupons: "Discount Coupons",
            addresses: "Addresses",
            logout: "Logout",
            no_orders: "No previous orders",
            no_wishlist: "Your wishlist is empty",
            no_coupons: "No coupons available currently",
            order_details: "Order Details",
            order_number: "Order Number",
            order_date: "Date",
            order_total: "Total",
            order_status: "Status",
            points_balance: "Current Balance",
            points_earned: "Points",
            points_history: "Points History",
            points_history_empty: "No previous points operations",
            tier_label: "Current Level",
            how_to_earn: "Earn Points",
            how_to_redeem: "Redeem Points",
            exclusive_gifts: "Exclusive Gifts",
            earn_info: "1 point for every 10,000 SDG purchases",
            redeem_info: "Each point equals 5,000 SDG direct discount",
            gifts_info: "Enjoy special offers for your loyalty level",
            verify_whatsapp: "Verify your account via WhatsApp",
            verify_whatsapp_desc: "One last step to activate account protection and exclusive loyalty features.",
            send_code: "Send Code",
            confirm_code: "Confirm",
            code_placeholder: "000000",
            verification_success: "Account verified successfully!",
            verification_error: "Invalid verification code",
            profile_info: "Account Information",
            edit: "Edit",
            save: "Save Changes",
            cancel: "Cancel",
            first_name: "First Name",
            last_name: "Last Name",
            email: "Email",
            phone: "Main WhatsApp Number",
            calling_phone: "Calling Phone Number",
            secondary_phone_optional: "Secondary Phone (Optional)",
            city: "City",
            select_city: "Select City",
            birthday: "Birthday",
            update_success: "Profile updated successfully!",
            update_error: "Failed to update profile",
            connection_error: "Connection error",
            loading_orders: "Loading orders...",
            loading_coupons: "Loading coupons...",
            copy_code: "Copy Code",
            code_copied: "Code copied!"
        },
        popups: {
            purchase_prefix: "",
            purchase_from: "from",
            purchase_bought: "bought",
            purchase_time: {
                just_now: "just now",
                one_min: "a minute ago",
                two_mins: "2 minutes ago",
                three_mins: "3 minutes ago",
                five_mins: "5 minutes ago"
            },
            purchases: [
                { name: "Sarah A.", city: "Port Sudan", product: "Layali El Sharq Perfume" },
                { name: "Mona M.", city: "Atbara", product: "Skincare Set" },
                { name: "Mariam T.", city: "Port Sudan", product: "Hyaluronic Serum" },
                { name: "Amal K.", city: "Atbara", product: "Deep Moisturizing Cream" }
            ]
        },
        search: {
            no_results: "No results found for \"{query}\"",
            suggested_categories: "Suggested Categories",
            categories: ["Perfumes", "Cosmetics", "Fashion", "Personal Care", "Sudanese"]
        }
    }
}

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: Translations
    dir: "rtl" | "ltr"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("ar")

    useEffect(() => {
        const savedLang = localStorage.getItem("ola_lang") as Language
        if (savedLang && (savedLang === "ar" || savedLang === "en")) {
            setLanguageState(savedLang)
        }
    }, [])

    useEffect(() => {
        document.documentElement.lang = language
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }, [language])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("ola_lang", lang)
    }

    const dir = language === "ar" ? "rtl" : "ltr"
    const t = translations[language]

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
