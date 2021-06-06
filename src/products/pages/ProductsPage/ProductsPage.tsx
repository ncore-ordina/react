import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  match,
  useHistory,
} from "react-router-dom";
import { Page, ReadOnly, Dialog } from "components";
import { ProductsTable } from "products";
import { EditProduct, CreateProduct } from "products/containers";
import { useSelector } from "react-redux";
import { selectIsReadOnly } from "../../../state/selectors";

export function ProductsPage() {
  const { url }: match = useRouteMatch();
  const isReadOnly = useSelector(selectIsReadOnly);
  const { push } = useHistory();

  const gotToCreateProduct = () => push(`${url}/create`);

  return (
    <>
      <Page
        title="Products"
        onCreateButtonClick={isReadOnly ? undefined : gotToCreateProduct}
      >
        <ProductsTable></ProductsTable>
      </Page>
      <Switch>
        <Route path={`${url}/create`}>
          <Dialog
            show={true}
            title={"Create product"}
            onClose={() => push(url)}
          >
            {isReadOnly ? <ReadOnly /> : <CreateProduct />}
          </Dialog>
        </Route>
        <Route path={`${url}/:productId/edit`}>
          <Dialog show={true} title={"Edit product"} onClose={() => push(url)}>
            {isReadOnly ? <ReadOnly /> : <EditProduct />}
          </Dialog>
        </Route>
      </Switch>
    </>
  );
}
