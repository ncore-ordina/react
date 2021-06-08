import { FetchContext } from "auth/contexts/FetchContext";
import {
  ActionButton,
  ActionButtonMenu,
  ActionButtonType,
  Table,
} from "components";
import { Product, ProductRow } from "products";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  match,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { selectIsReadOnly } from "../../../state/selectors";

export function ProductsTable() {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const { url }: match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const isReadOnly = useSelector(selectIsReadOnly);

  const authAxios = useContext(FetchContext);
  const retrieveProducts = async () => {
    const result = (await authAxios.get(`/products`)).data;
    setProducts(result);
  };

  const onDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await authAxios.delete(`/products/${id}`);
      retrieveProducts();
    }
  };

  useEffect(() => {
    retrieveProducts();
  }, []);
  useEffect(() => history.listen(() => retrieveProducts()), [history]);

  return (
    <Table
      headers={["Id", "Name", "Description", "Product Code"]}
      data={products}
      renderRow={(product) => (
        <ProductRow key={product.id} product={product}>
          <ActionButtonMenu disabled={isReadOnly}>
            <ActionButton
              className="mr-4"
              type={ActionButtonType.EDIT}
              label="Edit"
              onClick={() =>
                history.push(`${url}/${product.id}/edit`, {
                  background: location,
                })
              }
            />
            <ActionButton
              type={ActionButtonType.DELETE}
              label="Delete"
              onClick={() => onDeleteProduct(product.id)}
            />
          </ActionButtonMenu>
        </ProductRow>
      )}
    ></Table>
  );
}
