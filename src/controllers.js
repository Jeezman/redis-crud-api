import client from "../client";
const redisdb = process.env.REDIS_DB || 0;

//get all contact
export const getContacts = (req, res) => {
  var contacts = [];
  client.select(redisdb, (err, result) => {
    client.smembers(`contact:index`, (err, keys) => {
      if (err) return res.send(err);
      if (keys.length === 0) return res.json(keys);
      keys.map((key, i, arr) => {
        client.hgetall(key, (err, contact) => {
          if (err) return console.log(err);
          contacts.push(contact);
          if (arr.length - 1 === i) res.json(contacts);
        });
      });
    });
  });
};

//get contat with id
export const getContactWithID = (req, res) => {
  const { id } = req.params;
  client.select(redisdb, (err, result) => {
    client.hgetall(`contact:${id}`, (err, contact) => {
      if (!contact) {
        res.json(404, { message: "Contact not be found" });
      } else {
        res.json(contact);
      }
    });
  });
};

//add contact
export const addNewContact = (req, res) => {
  client.select(redisdb, (err, result) => {
    client.incr("contact:id", (err, id) => {
      if (err) return console.log(err);
      const { first_name, last_name, email, company, phone } = req.body;
      const key = `contact:${id}`;
      client.hmset(
        key,
        [
          "first_name",
          first_name,
          "last_name",
          last_name,
          "email",
          email,
          "company",
          company,
          "phone",
          phone,
          "id",
          id
        ],
        (err, result) => {
          if (err) return console.log(err);
          client.sadd("contact:index", key, (err, result) => {
            if (err) return console.log(err);
            res.json({ message: "Contact saved successfully!" });
          });
        }
      );
    });
  });
};

//update contact
export const updateContact = (req, res) => {
  const { id } = req.params;
  const key = `contact:${id}`;
  const updatedContactFields = req.body;

  let values = [];
  Object.keys(updatedContactFields).map(val => {
    values.push(val, updatedContactFields[val]);
  });
  client.select(redisdb, (err, result) => {
    client.hmset(key, values, (err, result) => {
      if (err) return console.log(err);
      res.json({ message: "Contact updated successfully!" });
    });
  });
};

//delet contact
export const deleteContact = (req, res) => {
  const { id } = req.params;
  const key = `contact:${id}`;
  client.select(redisdb, (err, result) => {
    client.del(key, (err, result) => {
      if (err) return console.log(err);
      client.srem(`contact:index`, key, (err, result) => {
        if (err) return console.log(err);
        res.json({ message: "Successfully deleted contact" });
      });
    });
  });
};
