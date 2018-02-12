import {
  getContacts,
  getContactWithID,
  addNewContact,
  updateContact,
  deleteContact
} from "./controllers";

const routes = app => {
  app
    .route("/contact")
    .get(getContacts)
    .post(addNewContact);

  app
    .route("/contact/:id")
    .get(getContactWithID)
    .put(updateContact)
    .delete(deleteContact);
};

export default routes;
