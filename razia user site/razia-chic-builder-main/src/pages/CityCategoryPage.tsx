
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, ChevronRight, MapPin, Truck, ShieldCheck, Clock } from 'lucide-react';

// Mock Data (Replace with API call)
const MOCK_PRODUCTS = [
  { id: 1, name: "Luxury Abaya", price: 299, image: "https://images.unsplash.com/photo-1596704017254-9b12106e20c4?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Silk Scarf", price: 89, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Evening Gown", price: 450, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "Summer Dress", price: 150, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600" },
];

const CityCategoryPage = () => {
    const { category, city } = useParams();
    const cityTitle = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Saudi Arabia';
    const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') : 'Products';

    // In a real app, fetch products based on category here
    const products = MOCK_PRODUCTS; 

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `Best ${categoryTitle} in ${cityTitle}`,
        "description": `Shop top-rated ${categoryTitle} in ${cityTitle}. Express delivery to your doorstep in ${cityTitle}.`,
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://raziachic.com" },
                { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://raziachic.com/shop" },
                { "@type": "ListItem", "position": 3, "name": `${categoryTitle} in ${cityTitle}` }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Helmet>
                <title>Best {categoryTitle} in {cityTitle} | Fast Shipping to {cityTitle}</title>
                <meta name="description" content={`Looking for ${categoryTitle} in ${cityTitle}? Discover our premium collection with fast delivery to ${cityTitle}, easy returns, and cash on delivery available.`} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>

            {/* Hero Section */}
            <div className="bg-white px-4 py-12 text-center shadow-sm sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Best {categoryTitle} in <span className="text-primary">{cityTitle}</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                    Discover our exclusive collection of {categoryTitle} available for fast delivery to {cityTitle}.
                    Quality guaranteed with easy returns.
                </p>
                <div className="mt-6 flex justify-center gap-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1"><Truck size={16} /> Fast Shipping to {cityTitle}</div>
                    <div className="flex items-center gap-1"><ShieldCheck size={16} /> Authentic Quality</div>
                    <div className="flex items-center gap-1"><Clock size={16} /> 24/7 Support</div>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center text-sm text-gray-500">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span>Shop</span>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="font-semibold text-gray-900">{categoryTitle} in {cityTitle}</span>
                </nav>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <div key={product.id} className="group relative rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                            <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        <Link to={`/products/${product.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">Available in {cityTitle}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{product.price} SAR</p>
                            </div>
                            <button className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ / Content Section for SEO */}
            <div className="container mx-auto mt-16 px-4">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold">Why Buy {categoryTitle} in {cityTitle}?</h2>
                        <div className="space-y-4 text-gray-600">
                            <p>
                                Finding high-quality <strong>{categoryTitle}</strong> in <strong>{cityTitle}</strong> can be challenging.
                                At Razia Chic, we bring the latest trends directly to your doorstep.
                                Whether you are in North {cityTitle} or the city center, our logistics partners ensure
                                speedy delivery within 24-48 hours.
                            </p>
                            <p>
                                We understand the local preferences of our customers in {cityTitle}.
                                That's why our {categoryTitle} collection is curated to suit the climate and style suitable for the region.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">Do you offer cash on delivery in {cityTitle}?</h3>
                                <p className="mt-1 text-sm text-gray-600">Yes, we offer Cash on Delivery (COD) for all orders shipped to {cityTitle} and surrounding areas.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">How long does shipping take to {cityTitle}?</h3>
                                <p className="mt-1 text-sm text-gray-600">Orders placed before 2 PM are processed same-day. Delivery to {cityTitle} typically takes 1-3 business days.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Can I return items if I am in {cityTitle}?</h3>
                                <p className="mt-1 text-sm text-gray-600">Absolutely. We offer a hassle-free 14-day return policy for all our customers in {cityTitle}.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Quick Links for Connectivity */}
            <div className="container mx-auto mt-12 px-4 text-center">
                <p className="text-sm text-gray-500">
                    Not in {cityTitle}? We also ship to <Link to={`/shop/${category}/in/riyadh`} className="underline">Riyadh</Link>,
                    <Link to={`/shop/${category}/in/jeddah`} className="ml-1 underline">Jeddah</Link>, and 
                    <Link to={`/shop/${category}/in/dammam`} className="ml-1 underline">Dammam</Link>.
                </p>
            </div>
        </div>
    );
};

export default CityCategoryPage;
