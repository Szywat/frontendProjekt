import Link from "next/link"

export default function List({products, onSelectProduct}) {
    return (
        <section>
            {products.map(product => {
                return (
                    <div key={product.id}>
                        <Link href={`/products/${product.id}`}>
                        <img src={product.image} 
                        alt={product.title} 
                        onClick={() => onSelectProduct(product.title)} />
                        <p>{product.title}</p>
                        </Link>
                    </div>
                )
            })
            }
        </section>
    )
}