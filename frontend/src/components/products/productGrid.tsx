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
        <div className="bg-gray-50 h-full">
            <div className="mx-auto max-w-2xl px-8 sm:px-6 py-2 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className='flex flex-row'>
                        <h1 className="text-2xl font-bold text-indigo-600">Our Products</h1>
                    </div>
                    </div>
                    
                    <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-indigo-600"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-50 px-2 text-sm text-indigo-600">Pick a product to customize</span>
                    </div>
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
                                    src={`${process.env.NEXT_PUBLIC_API_HOST}${product.image_url}`}
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