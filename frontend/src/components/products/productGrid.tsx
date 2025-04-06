import { Product } from '@/models/product/domain/product';
import { useRouter } from 'next/navigation';

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    const router = useRouter();

    const handleProductClick = (productId: number) => {
        router.push(`/products/${productId}`);
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Our Products</h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className="group relative cursor-pointer rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                            onClick={() => handleProductClick(product.id)}
                        >
                            <div className="aspect-square w-full rounded-t-lg bg-gray-200 overflow-hidden">
                                <img
                                    src={`/api/placeholder/400/400`}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        <span className="absolute inset-0" />
                                        {product.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                </div>
                                
                                {product.components.some(comp => comp.required) && (
                                    <div className="mt-2">
                                        <ul className="space-y-1">
                                            {product.components
                                                .filter(comp => comp.required)
                                                .map((comp, index) => (
                                                    <li 
                                                        key={comp.id || index} 
                                                        className="text-xs flex items-center text-gray-700"
                                                    >
                                                        
                                                        - {comp.name}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}