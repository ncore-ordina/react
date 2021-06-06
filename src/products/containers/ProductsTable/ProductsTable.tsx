import React, { useState, useEffect } from "react";
import {
  match,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { ProductRow, Product } from "products";
import {
  ActionButtonType,
  ActionButton,
  ActionButtonMenu,
  Table,
} from "components";
import { useSelector } from "react-redux";
import { selectIsReadOnly } from "../../../state/selectors";
import axios from "axios";

export function ProductsTable() {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const { url }: match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const isReadOnly = useSelector(selectIsReadOnly);

  const retrieveProducts = async () => {
    const result = (
      await axios.get(`${process.env.REACT_APP_API_URL}/products`)
    ).data;
    setProducts(result);
  };

  const onDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
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
