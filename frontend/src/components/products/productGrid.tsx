import { Product } from '@/models/product/domain/product';
import { useRouter } from 'next/navigation';
import { Star,  Heart } from 'lucide-react';

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    const router = useRouter();

    const handleProductClick = (productId: number) => {
        router.push(`/products/${productId}`);
    };

    const getRandomRating = () => (Math.random() * 2 + 3).toFixed(1);

    return (
        <div className="bg-gray-50">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Products</h2>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className="group bg-white rounded-lg border cursor-pointer border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                            onClick={() => handleProductClick(product.id)}
                        >
                            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                <img
                                    src={`http://localhost:3000${product.image_url}`}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Heart size={18} className="text-gray-600 hover:text-red-500" />
                                </div>
                            </div>

                            <div className="p-4" >
                                <div className="flex items-center text-sm text-yellow-500 mb-1">
                                    <Star size={16} fill="currentColor" />
                                    <span className="ml-1 text-gray-700">{getRandomRating()}</span>
                                    <span className="ml-1 text-gray-400">({Math.floor(Math.random() * 100) + 5} reviews)</span>
                                </div>
                                
                                <h3 className="text-lg font-medium text-gray-900">
                                    {product.name}
                                </h3>
                                
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>                               
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}