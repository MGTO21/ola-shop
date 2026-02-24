"use client"

import { useState } from "react"
import { Package, Search, Plus, Edit, Trash2, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"

interface Product {
    id: string
    name: string
    nameAr: string
    sku: string
    category: string
    stock: number
    minStock: number
    price: number
    cost: number
    image?: string
}

export default function WarehousePage() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: "1",
            name: "Lipstick - Red Velvet",
            nameAr: "أحمر شفاه - أحمر مخملي",
            sku: "LIP-001",
            category: "Makeup",
            stock: 45,
            minStock: 20,
            price: 250,
            cost: 150,
        },
        {
            id: "2",
            name: "Face Serum - Vitamin C",
            nameAr: "سيروم الوجه - فيتامين سي",
            sku: "SKN-002",
            category: "Skincare",
            stock: 12,
            minStock: 15,
            price: 450,
            cost: 280,
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)

    const lowStockProducts = products.filter((p) => p.stock <= p.minStock)
    const totalValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Warehouse Management</h1>
                                <p className="text-sm text-gray-600">إدارة المخزون</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Low Stock Items</p>
                                <p className="text-2xl font-bold text-red-500">{lowStockProducts.length}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Stock Value</p>
                                <p className="text-2xl font-bold">{totalValue.toLocaleString()} SDG</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">In Stock</p>
                                <p className="text-2xl font-bold text-green-500">
                                    {products.filter((p) => p.stock > p.minStock).length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-800">Low Stock Alert</h3>
                                <p className="text-sm text-red-700">
                                    {lowStockProducts.length} product(s) are running low on stock
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name, SKU, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products
                                    .filter(
                                        (p) =>
                                            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            p.category.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((product) => {
                                        const margin = ((product.price - product.cost) / product.price) * 100
                                        const isLowStock = product.stock <= product.minStock

                                        return (
                                            <tr key={product.id} className={isLowStock ? "bg-red-50" : ""}>
                                                <td className="px-6 py-4 text-sm font-mono">{product.sku}</td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-sm text-gray-500">{product.nameAr}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{product.category}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${isLowStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                                            }`}
                                                    >
                                                        {isLowStock && <AlertTriangle className="w-4 h-4" />}
                                                        {product.stock} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">{product.price} SDG</td>
                                                <td className="px-6 py-4 text-sm">{product.cost} SDG</td>
                                                <td className="px-6 py-4 text-sm font-medium text-green-600">{margin.toFixed(1)}%</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-1 hover:bg-gray-100 rounded">
                                                            <Edit className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                        <button className="p-1 hover:bg-gray-100 rounded">
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
