const formatNumber = (number?: number) => {
  return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.");
};
const formatCurrency = (number: number) => {
  if (typeof number !== "number") return "0 đ";
  return formatNumber(number) + " đ";
};
const ProductList = (products: any) => {
  return (
    <div className="grid grid-cols-1 gap-4 px-12 mt-4 ">
      {!!products.products.length &&
        products?.products.map((product: any) => {
          return (
            <div key={product.id} className="flex flex-col">
              <div className="flex flex-row">
                <img
                  src={product?.images?.[0]}
                  alt={product?.name}
                  className="h-16 w-16 rounded-md"
                />
                <div className="flex flex-col ml-4">
                  <span className="text-sm font-semibold">{product?.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatCurrency(product?.price)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ProductList;
